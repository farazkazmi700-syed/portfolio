"""HTTP API: public portfolio endpoints + LinkedIn sync + admin CMS."""
import re

from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

from app import cms
from app.middleware import SyncError
from app.models import (AdminUser, Article, Certification, Education,
                        Experience, Project, Skill, db)
from app.services import generator, parser, store
from app.services.linkedin_fetcher import DEFAULT_URL, fetch_profile_source

api = Blueprint("api", __name__, url_prefix="/api")
admin = Blueprint("admin", __name__, url_prefix="/api/admin")

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


def slugify(text):
    return re.sub(r"-{2,}", "-", re.sub(r"[^a-z0-9]+", "-",
                  (text or "").lower())).strip("-") or "post"


# ------------------------------------------------------------------ #
#  Public API                                                         #
# ------------------------------------------------------------------ #

@api.get("/health")
def health():
    return jsonify({"ok": True, "service": "portfolio-linkedin-sync"})


@api.get("/portfolio")
def get_portfolio():
    return jsonify({"ok": True, "data": cms.export_profile()})


@api.get("/articles")
def list_articles():
    arts = Article.query.filter_by(published=True)\
        .order_by(Article.created_at.desc()).all()
    return jsonify({"ok": True, "data": [a.as_dict() for a in arts]})


@api.get("/articles/<slug>")
def get_article(slug):
    art = Article.query.filter_by(slug=slug, published=True).first()
    if not art:
        return jsonify({"ok": False, "error": "Article not found"}), 404
    return jsonify({"ok": True, "data": art.as_dict(full=True)})


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
    store.record_update(store.load(), label, added, skipped)
    return jsonify({"ok": True, "added": added,
                    "skippedAlreadyOnSite": skipped,
                    "lastSyncedAt": store.load()["meta"]["lastSyncedAt"],
                    "data": cms.export_profile()})


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
    return jsonify({"ok": True, "added": added,
                    "skippedAlreadyOnSite": skipped})


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


# --- Articles management ------------------------------------------- #

@admin.get("/articles")
@jwt_required()
def admin_articles():
    arts = Article.query.order_by(Article.created_at.desc()).all()
    return jsonify({"ok": True, "data": [a.as_dict(full=True) for a in arts]})


@admin.post("/articles")
@jwt_required()
def create_article():
    body = request.get_json(silent=True) or {}
    title = (body.get("title") or "").strip()
    if not title:
        return jsonify({"ok": False, "error": "Title is required"}), 400
    slug = slugify(body.get("slug") or title)
    if Article.query.filter_by(slug=slug).first():
        slug = f"{slug}-{Article.query.count() + 1}"
    published = bool(body.get("published", body.get("status") == "published"))
    art = Article(slug=slug, title=title, excerpt=body.get("excerpt", ""),
                  body=body.get("body", body.get("content", "")),
                  published=published)
    db.session.add(art)
    db.session.commit()
    return jsonify({"ok": True, "data": art.as_dict(full=True)}), 201


@admin.put("/articles/<int:art_id>")
@jwt_required()
def update_article(art_id):
    art = db.session.get(Article, art_id)
    if not art:
        return jsonify({"ok": False, "error": "Not found"}), 404
    body = request.get_json(silent=True) or {}
    for field in ("title", "excerpt", "body", "published"):
        if field in body:
            setattr(art, field, body[field])
    if body.get("slug"):
        art.slug = slugify(body["slug"])
    db.session.commit()
    return jsonify({"ok": True, "data": art.as_dict(full=True)})


@admin.delete("/articles/<int:art_id>")
@jwt_required()
def delete_article(art_id):
    art = db.session.get(Article, art_id)
    if not art:
        return jsonify({"ok": False, "error": "Not found"}), 404
    db.session.delete(art)
    db.session.commit()
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
