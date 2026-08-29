"""SQLAlchemy models for the portfolio CMS.

Tables: admin_users, profile_settings, experiences, projects, educations,
certifications, skills, sync_logs.
On first run the DB is seeded from backend/data/profile.json so nothing is lost.
"""
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash

db = SQLAlchemy()


class AdminUser(db.Model):
    __tablename__ = "admin_users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class ProfileSetting(db.Model):
    __tablename__ = "profile_settings"

    key = db.Column(db.String(80), primary_key=True)
    value = db.Column(db.Text, default="")

    @staticmethod
    def set(key, value):
        row = db.session.get(ProfileSetting, key)
        if not row:
            row = ProfileSetting(key=key)
            db.session.add(row)
        row.value = str(value if value is not None else "")
        return row


class Experience(db.Model):
    __tablename__ = "experiences"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(160), nullable=False)
    company = db.Column(db.String(160), default="")
    period = db.Column(db.String(80), default="")
    description = db.Column(db.Text, default="")
    source = db.Column(db.String(20), default="manual")  # manual | linkedin
    image = db.Column(db.String(400), default="")
    file_url = db.Column(db.String(400), default="")

    def fingerprint(self):
        return f"{(self.title or '').lower().strip()}@{(self.company or '').lower().strip()}"

    def as_dict(self):
        d = {"id": self.id, "title": self.title, "company": self.company,
             "period": self.period, "description": self.description}
        if self.image:
            d["image"] = self.image
        if self.file_url:
            d["file_url"] = self.file_url
        return d


class Project(db.Model):
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, default="")
    tags = db.Column(db.Text, default="")      # comma separated
    category = db.Column(db.String(80), default="")
    link = db.Column(db.String(400), default="")
    image = db.Column(db.String(400), default="")
    published = db.Column(db.Boolean, default=True, nullable=False)
    source = db.Column(db.String(20), default="manual")

    def fingerprint(self):
        return f"project:{(self.title or '').lower().strip()}"

    def as_dict(self):
        d = {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "tags": [t.strip() for t in (self.tags or "").split(",") if t.strip()],
            "category": self.category,
            "published": bool(self.published),
        }
        if self.link:
            d["link"] = self.link
        if self.image:
            d["image"] = self.image
        return d


class Education(db.Model):
    __tablename__ = "educations"

    id = db.Column(db.Integer, primary_key=True)
    degree = db.Column(db.String(200), nullable=False)
    institution = db.Column(db.String(200), default="")
    period = db.Column(db.String(80), default="")
    status = db.Column(db.String(80), default="")
    source = db.Column(db.String(20), default="manual")
    image = db.Column(db.String(400), default="")
    file_url = db.Column(db.String(400), default="")

    def fingerprint(self):
        return f"{(self.degree or '').lower().strip()}@{(self.institution or '').lower().strip()}"

    def as_dict(self):
        d = {"id": self.id, "degree": self.degree, "institution": self.institution,
             "period": self.period}
        if self.status:
            d["status"] = self.status
        if self.image:
            d["image"] = self.image
        if self.file_url:
            d["file_url"] = self.file_url
        return d


class Certification(db.Model):
    __tablename__ = "certifications"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(220), nullable=False)
    issuer = db.Column(db.String(220), default="")
    period = db.Column(db.String(80), default="")
    source = db.Column(db.String(20), default="manual")
    image = db.Column(db.String(400), default="")
    file_url = db.Column(db.String(400), default="")
    credential_url = db.Column(db.String(400), default="")

    def fingerprint(self):
        return f"{(self.name or '').lower().strip()}@{(self.issuer or '').lower().strip()}"

    def as_dict(self):
        d = {"id": self.id, "name": self.name, "issuer": self.issuer,
                "period": self.period}
        if self.image:
            d["image"] = self.image
        if self.file_url:
            d["file_url"] = self.file_url
        if self.credential_url:
            d["credential_url"] = self.credential_url
        return d


# ==== PART 2 CONTINUES BELOW ====


class Skill(db.Model):
    __tablename__ = "skills"

    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(120), default="Other")
    name = db.Column(db.String(160), nullable=False)
    kind = db.Column(db.String(20), default="technical")  # technical | soft
    source = db.Column(db.String(20), default="manual")

    __table_args__ = (
        db.UniqueConstraint("category", "name", name="uq_skill_category_name"),
    )

    def fingerprint(self):
        return f"skill:{(self.category or '').lower().strip()}:{(self.name or '').lower().strip()}"

    def as_dict(self):
        return {"category": self.category, "name": self.name,
                "kind": self.kind, "id": self.id}


class SyncLog(db.Model):
    __tablename__ = "sync_logs"

    id = db.Column(db.Integer, primary_key=True)
    ran_at = db.Column(db.DateTime, server_default=db.func.now())
    source_label = db.Column(db.String(120), default="")
    items_added = db.Column(db.Integer, default=0)
    items_skipped_existing = db.Column(db.Integer, default=0)


# ---------------------------------------------------------------- seeding ----

_PROFILE_KEYS = (
    "name", "title", "tagline", "bio",
    "location", "phone", "email", "github", "linkedin",
    "profileImage", "resume",
)


def _clean(data, model):
    """Keep only keys that are real columns of `model`."""
    cols = {c for c in model.__table__.columns.keys()}
    cols.discard("id")
    out = {}
    for k, v in (data or {}).items():
        if k in cols and v is not None:
            out[k] = v if not isinstance(v, list) else ", ".join(map(str, v))
    return out


def _ensure_col(table, col, ddl):
    """Add a column to a SQLite table if it does not exist yet."""
    from sqlalchemy import text
    cols = [r[1] for r in db.session.execute(
        text("PRAGMA table_info(%s)" % table)).fetchall()]
    if col not in cols:
        db.session.execute(text(
            "ALTER TABLE %s ADD COLUMN %s %s" % (table, col, ddl)))
        db.session.commit()


def ensure_schema():
    """Create all tables and apply additive migrations (idempotent)."""
    db.create_all()
    _ensure_col("projects", "published", "BOOLEAN NOT NULL DEFAULT 1")
    _ensure_col("projects", "image", "VARCHAR(400) DEFAULT ''")
    _ensure_col("projects", "file_url", "VARCHAR(400) DEFAULT ''")
    _ensure_col("experiences", "image", "VARCHAR(400) DEFAULT ''")
    _ensure_col("experiences", "file_url", "VARCHAR(400) DEFAULT ''")
    _ensure_col("educations", "image", "VARCHAR(400) DEFAULT ''")
    _ensure_col("educations", "file_url", "VARCHAR(400) DEFAULT ''")
    _ensure_col("certifications", "image", "VARCHAR(400) DEFAULT ''")
    _ensure_col("certifications", "file_url", "VARCHAR(400) DEFAULT ''")
    _ensure_col("certifications", "credential_url", "VARCHAR(400) DEFAULT ''")


def seed_if_empty():
    """Create tables and populate them once from profile.json."""
    import json as _json
    import os as _os

    from flask import current_app

    from app.services.store import STORE_PATH

    db.create_all()

    if not AdminUser.query.first():
        db.session.add(AdminUser(
            username=current_app.config["ADMIN_USERNAME"],
            password_hash=generate_password_hash(
                current_app.config["ADMIN_PASSWORD"]),
        ))

    payload = {}
    if _os.path.exists(STORE_PATH):
        with open(STORE_PATH, "r", encoding="utf-8-sig") as fh:
            payload = _json.load(fh) or {}

    for key in _PROFILE_KEYS:
        value = payload.get(key, "") or ""
        existing = db.session.get(ProfileSetting, key)
        if not existing or not existing.value:
            ProfileSetting.set(key, value)

    existing_fps = set()
    for model in (Experience, Project, Education, Certification, Skill):
        for row in model.query.all():
            existing_fps.add(row.fingerprint())

    for s in payload.get("softSkills") or []:
        fp = f"skill:soft skills:{s.lower().strip()}"
        if fp not in existing_fps:
            existing_fps.add(fp)
            db.session.add(Skill(category="Soft Skills", name=s, kind="soft"))
    for category, names in (payload.get("skills") or {}).items():
        for n in names or []:
            fp = f"skill:{category.lower().strip()}:{n.lower().strip()}"
            if fp not in existing_fps:
                existing_fps.add(fp)
                db.session.add(Skill(category=category, name=n))

    for e in payload.get("experience") or []:
        fp = f"{e.get('title','').lower().strip()}@{e.get('company','').lower().strip()}"
        if fp not in existing_fps:
            existing_fps.add(fp)
            db.session.add(Experience(**_clean(e, Experience)))
    for p in payload.get("projects") or []:
        fp = f"project:{p.get('title','').lower().strip()}"
        if fp not in existing_fps:
            existing_fps.add(fp)
            data = _clean(p, Project)
            data["tags"] = ", ".join(p.get("tags") or [])
            db.session.add(Project(**data))
    for ed in payload.get("education") or []:
        fp = f"{ed.get('degree','').lower().strip()}@{ed.get('institution','').lower().strip()}"
        if fp not in existing_fps:
            existing_fps.add(fp)
            db.session.add(Education(**_clean(ed, Education)))
    for c in payload.get("certifications") or []:
        fp = f"{c.get('name','').lower().strip()}@{c.get('issuer','').lower().strip()}"
        if fp not in existing_fps:
            existing_fps.add(fp)
            db.session.add(Certification(**_clean(c, Certification)))

    db.session.commit()
    print("[db] tables ensured & seeded where empty")
