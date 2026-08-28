"""SQLAlchemy models for the portfolio CMS.

Tables: admin_users, profile_settings, experiences, projects, educations,
certifications, skills, articles (blog), sync_logs.
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

    def fingerprint(self):
        return f"{(self.title or '').lower().strip()}@{(self.company or '').lower().strip()}"

    def as_dict(self):
        return {"id": self.id, "title": self.title, "company": self.company,
                "period": self.period, "description": self.description}


class Project(db.Model):
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, default="")
    tags = db.Column(db.Text, default="")      # comma separated
    category = db.Column(db.String(80), default="")
    link = db.Column(db.String(400), default="")
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
        }
        if self.link:
            d["link"] = self.link
        return d


class Education(db.Model):
    __tablename__ = "educations"

    id = db.Column(db.Integer, primary_key=True)
    degree = db.Column(db.String(200), nullable=False)
    institution = db.Column(db.String(200), default="")
    period = db.Column(db.String(80), default="")
    status = db.Column(db.String(80), default="")
    source = db.Column(db.String(20), default="manual")

    def fingerprint(self):
        return f"{(self.degree or '').lower().strip()}@{(self.institution or '').lower().strip()}"

    def as_dict(self):
        d = {"id": self.id, "degree": self.degree, "institution": self.institution,
             "period": self.period}
        if self.status:
            d["status"] = self.status
        return d


class Certification(db.Model):
    __tablename__ = "certifications"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(220), nullable=False)
    issuer = db.Column(db.String(220), default="")
    period = db.Column(db.String(80), default="")
    source = db.Column(db.String(20), default="manual")

    def fingerprint(self):
        return f"{(self.name or '').lower().strip()}@{(self.issuer or '').lower().strip()}"

    def as_dict(self):
        return {"id": self.id, "name": self.name, "issuer": self.issuer,
                "period": self.period}


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


class Article(db.Model):
    __tablename__ = "articles"

    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(220), unique=True, nullable=False)
    title = db.Column(db.String(220), nullable=False)
    excerpt = db.Column(db.Text, default="")
    body = db.Column(db.Text, default="")
    tags = db.Column(db.String(300), default="")       # comma separated
    published = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(),
                           onupdate=db.func.now())

    def as_dict(self, full=False):
        d = {
            "id": self.id,
            "slug": self.slug,
            "title": self.title,
            "excerpt": self.excerpt or (self.body or "")[:180],
            "tags": [t.strip() for t in (self.tags or "").split(",") if t.strip()],
            "published": bool(self.published),
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
        }
        if full:
            d["body"] = self.body
        return d


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


def seed_if_empty():
    """Create tables and populate them once from profile.json."""
    import json as _json
    import os as _os

    from flask import current_app

    from app import create_app
    from app.services.store import STORE_PATH

    app = create_app()
    with app.app_context():
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
