"""HTTP API: public portfolio endpoints + LinkedIn sync + admin CMS."""
import os
from werkzeug.utils import secure_filename
from flask import Blueprint, jsonify, request, send_from_directory
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

from app import cms
from app.middleware import SyncError
from app.models import (AdminUser, Certification, Education,
                        Experience, Project, Skill, db)
from app.services import generator, parser, store
from app.services.linkedin_fetcher import DEFAULT_URL, fetch_profile_source

api = Blueprint("api", __name__, url_prefix="/api")
admin = Blueprint("admin", __name__, url_prefix="/api/admin")


# --- File uploads --------------------------------------------------- #

@api.get("/uploads/<filename>")
@admin.get("/uploads/<filename>")
def serve_upload(filename):
    upload_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "uploads"))
    return send_from_directory(upload_dir, filename)


@admin.post("/upload")
@jwt_required()
def upload_file():
    if "file" not in request.files:
        return jsonify({"ok": False, "error": "No file part"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"ok": False, "error": "No selected file"}), 400
    if file:
        filename = secure_filename(file.filename)
        # Add unique prefix
        import time
        filename = f"{int(time.time())}_{filename}"
        upload_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "uploads"))
        os.makedirs(upload_dir, exist_ok=True)
        filepath = os.path.join(upload_dir, filename)
        file.save(filepath)
        file_url = f"/api/uploads/{filename}"
        return jsonify({"ok": True, "url": file_url, "filename": filename})
    return jsonify({"ok": False, "error": "Upload failed"}), 400

# Model registry used by generic CRUD ------------------------------- #
RESOURCES = {
    "experience": (Experience, ("title",)),
    "projects": (Project, ("title",)),
    "education": (Education, ("degree",)),
    "certifications": (Certification, ("name",)),
    "skills": (Skill, ("category", "name")),
}


def regen_static():
    """Rewrite cvData.js files so static builds reflect DB changes."""
    generator.generate(cms.export_profile())


def _sync_response(added, skipped, *, include_data=True):
    """Return consistent payload shape for sync/import endpoints."""
    response = {
        "ok": True,
        "added": int(added),
        "skippedAlreadyOnSite": int(skipped),
        "stats": {
            "added": int(added),
            "updated": 0,
            "skippedAlreadyOnSite": int(skipped),
        },
    }
    if include_data:
        response["data"] = cms.export_profile()
    return response


# ------------------------------------------------------------------ #
#  Public API                                                         #
# ------------------------------------------------------------------ #

@api.get("/health")
def health():
    return jsonify({"ok": True, "service": "portfolio-linkedin-sync"})


@api.get("/portfolio")
def get_portfolio():
    return jsonify({"ok": True, "data": cms.export_profile()})


# ------------------------------------------------------------------ #
#  LinkedIn sync / import  (dedupe: only NEW items are written)       #
# ------------------------------------------------------------------ #

@api.post("/linkedin/sync")
def linkedin_sync():
    payload = request.get_json(silent=True) or {}
    url = payload.get("url") or DEFAULT_URL
    source = fetch_profile_source(url)
    incoming = parser.parse_source(source)
    label = f"linkedin-sync:{source['kind']}"
    added, skipped = cms.merge_payload_into_db(incoming, label)
    cms.sync_scalar_settings(incoming)
    db.session.commit()
    regen_static()
    profile = store.load()
    store.record_update(profile, label, added, skipped)
    store.save(profile)
    response = _sync_response(added, skipped)
    response["lastSyncedAt"] = profile["meta"]["lastSyncedAt"]
    return jsonify(response)


@api.post("/linkedin/import")
def linkedin_import():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        raise SyncError("Request body must be a JSON object.")
    incoming = payload.get("data") if isinstance(payload.get("data"), dict) else payload
    if not isinstance(incoming.get("skills"), dict):
        incoming = parser.parse_json_payload(incoming)
    label = payload.get("label", "manual-import:api")
    added, skipped = cms.merge_payload_into_db(incoming, label)
    cms.sync_scalar_settings(incoming)
    db.session.commit()
    regen_static()
    profile = store.load()
    store.record_update(profile, label, added, skipped)
    store.save(profile)
    return jsonify(_sync_response(added, skipped))


# ------------------------------------------------------------------ #
#  Auth                                                               #
# ------------------------------------------------------------------ #

@api.post("/auth/login")
def login():
    body = request.get_json(silent=True) or {}
    user = AdminUser.query.filter_by(
        username=(body.get("username") or "").strip()).first()
    if not user or not user.check_password(body.get("password") or ""):
        return jsonify({"ok": False, "error": "Invalid credentials"}), 401
    token = create_access_token(identity=user.username)
    return jsonify({"ok": True, "token": token,
                    "username": user.username})


def register_blueprints(app):
    app.register_blueprint(api)
    app.register_blueprint(admin)


# ------------------------------------------------------------------ #
#  Admin CMS (JWT-protected)                                          #
# ------------------------------------------------------------------ #

@admin.get("/profile")
@jwt_required()
def admin_profile():
    return jsonify({"ok": True, "data": cms.export_profile()})


@admin.put("/profile")
@jwt_required()
def update_profile():
    body = request.get_json(silent=True) or {}
    cms.sync_scalar_settings(body)
    # Allow explicit clearing of optional fields too.
    for key, value in (body or {}).items():
        if key in ("name", "title", "tagline", "bio", "location", "phone",
                   "email", "github", "linkedin") and value is not None:
            from app.models import ProfileSetting
            ProfileSetting.set(key, str(value))
    db.session.commit()
    regen_static()
    return jsonify({"ok": True, "data": cms.export_profile()})


def _crud(resource):
    model, required = RESOURCES[resource]

    @jwt_required()
    def get_all():
        rows = model.query.all()
        return jsonify({"ok": True,
                        "data": [r.as_dict() for r in rows]})

    @jwt_required()
    def create():
        body = request.get_json(silent=True) or {}
        missing = [f for f in required if not str(body.get(f) or "").strip()]
        if missing:
            return jsonify({"ok": False,
                            "error": f"Missing field(s): {', '.join(missing)}"}), 400
        if resource == "projects" and isinstance(body.get("tags"), list):
            body = {**body, "tags": ",".join(map(str, body["tags"]))}
        row = model(**_safe_cols(model, body))
        db.session.add(row)
        db.session.commit()
        regen_static()
        return jsonify({"ok": True, "data": row.as_dict()}), 201

    get_all.__name__ = f"{resource}_list"     # unique flask endpoints
    create.__name__ = f"{resource}_create"
    return get_all, create


def _safe_cols(model, body):
    from app.models import _clean
    cleaned = _clean(body, model)
    if model is Skill:
        cleaned.setdefault("category", "Other")
    return cleaned


for _name, (_model, _req) in RESOURCES.items():
    _list, _create = _crud(_name)
    admin.get(f"/{_name}")(_list)
    admin.post(f"/{_name}")(_create)


@admin.put("/<resource>/<int:row_id>")
@jwt_required()
def update_row(resource, row_id):
    if resource not in RESOURCES:
        return jsonify({"ok": False, "error": "Unknown resource"}), 404
    model, _ = RESOURCES[resource]
    row = db.session.get(model, row_id)
    if not row:
        return jsonify({"ok": False, "error": "Not found"}), 404
    body = request.get_json(silent=True) or {}
    if resource == "projects" and isinstance(body.get("tags"), list):
        body = {**body, "tags": ",".join(map(str, body["tags"]))}
    for k, v in _safe_cols(model, body).items():
        setattr(row, k, v)
    db.session.commit()
    regen_static()
    return jsonify({"ok": True, "data": row.as_dict()})


@admin.delete("/<resource>/<int:row_id>")
@jwt_required()
def delete_row(resource, row_id):
    if resource not in RESOURCES:
        return jsonify({"ok": False, "error": "Unknown resource"}), 404
    model, _ = RESOURCES[resource]
    row = db.session.get(model, row_id)
    if not row:
        return jsonify({"ok": False, "error": "Not found"}), 404
    db.session.delete(row)
    db.session.commit()
    regen_static()
    return jsonify({"ok": True})


@admin.post("/change-password")
@jwt_required()
def change_password():
    from werkzeug.security import generate_password_hash

    from app.models import AdminUser
    body = request.get_json(silent=True) or {}
    new = (body.get("newPassword") or "").strip()
    if len(new) < 8:
        return jsonify({"ok": False,
                        "error": "Password must be at least 8 characters"}), 400
    user = AdminUser.query.filter_by(username=get_jwt_identity()).first()
    user.password_hash = generate_password_hash(new)
    db.session.commit()
    return jsonify({"ok": True})
