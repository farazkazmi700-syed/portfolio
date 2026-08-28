"""CMS service layer.

- export_profile(): builds the cvData dict from the database, applying
  newest-first ordering per section.
- merge_payload_into_db(): dedupe-aware writer used by LinkedIn sync/import.
  Only items whose fingerprint is NOT already stored are inserted;
  everything already present on the site is skipped untouched.
"""
from app.models import (Certification, Education, Experience,
                        ProfileSetting, Project, Skill, SyncLog, _clean, db)

# Section sort order helper reuse -------------------------------------------
try:
    from app.services.helpers import period_sort_key
except Exception:  # pragma: no cover - fallback if helpers unavailable
    def period_sort_key(text):
        return text or ""


def _sorted(items, key_field="period"):
    return sorted(items, key=lambda it: period_sort_key(it.get(key_field)),
                  reverse=True)


def export_profile():
    """cvData-shaped dict assembled from the DB."""
    skills = {}
    soft = []
    for s in Skill.query.all():
        info = s.as_dict()
        if info.get("kind") == "soft":
            soft.append(info["name"])
        else:
            skills.setdefault(info["category"], []).append(info["name"])

    profile = {ps.key: ps.value for ps in ProfileSetting.query.all()}
    profile.update({
        "skills": dict(sorted(skills.items())),
        "softSkills": soft,
        "experience": _sorted(
            [e.as_dict() for e in Experience.query.all()]),
        "projects": _sorted([p.as_dict() for p in Project.query.all()], "category"),
        "education": _sorted([e.as_dict() for e in Education.query.all()]),
        "certifications": _sorted(
            [c.as_dict() for c in Certification.query.all()], "period"),
    })
    # Clean out None/empty seeded settings that shouldn't render as null.
    return {k: v for k, v in profile.items() if v is not None}


def _existing_fingerprints(model):
    return {r.fingerprint() for r in model.query.all()}


def merge_payload_into_db(incoming, source_label, source_tag="linkedin"):
    """Insert ONLY the items not already on the website.

    Returns (added_count, skipped_count) and records a SyncLog row.
    The caller commits the session.
    """
    added = skipped = 0

    fps_exp = _existing_fingerprints(Experience)
    for e in incoming.get("experience") or []:
        title = (e.get("title") or "").strip()
        if not title:
            continue
        fp = f"{title.lower()}@{(e.get('company') or '').lower().strip()}"
        if fp in fps_exp:
            skipped += 1
            continue
        row = Experience(source=source_tag, **_clean(e, Experience))
        db.session.add(row)
        fps_exp.add(fp)
        added += 1

    fps_proj = _existing_fingerprints(Project)
    for p in incoming.get("projects") or []:
        title = (p.get("title") or "").strip()
        if not title:
            continue
        fp = f"project:{title.lower().strip()}"
        if fp in fps_proj:
            skipped += 1
            continue
        tags = p.get("tags")
        if isinstance(tags, list):
            p = {**p, "tags": ",".join(map(str, tags))}
        db.session.add(Project(source=source_tag, **_clean(p, Project)))
        fps_proj.add(fp)
        added += 1

    fps_edu = _existing_fingerprints(Education)
    for ed in incoming.get("education") or []:
        degree = (ed.get("degree") or "").strip()
        if not degree:
            continue
        fp = f"{degree.lower().strip()}@{(ed.get('institution') or '').lower().strip()}"
        if fp in fps_edu:
            skipped += 1
            continue
        db.session.add(Education(source=source_tag, **_clean(ed, Education)))
        fps_edu.add(fp)
        added += 1

    fps_cert = _existing_fingerprints(Certification)
    for c in incoming.get("certifications") or []:
        name = (c.get("name") or "").strip()
        if not name:
            continue
        fp = f"{name.lower().strip()}@{(c.get('issuer') or '').lower().strip()}"
        if fp in fps_cert:
            skipped += 1
            continue
        db.session.add(Certification(source=source_tag,
                                     **_clean(c, Certification)))
        fps_cert.add(fp)
        added += 1

    for category, names in (incoming.get("skills") or {}).items():
        if not isinstance(names, (list, tuple)):
            continue
        if isinstance(names, dict):  # provider oddity: {name: {...}}
            names = list(names.keys())
        for n in names:
            name = str(n).strip()
            if not name:
                continue
            cat = str(category).strip() or "Other"
            fp = f"skill:{cat}:{name.lower().strip()}"
            if Skill.query.filter_by(category=cat, name=name).first():
                skipped += 1
                continue
            db.session.add(Skill(category=cat, name=name,
                                 source=source_tag))
            added += 1

    db.session.add(SyncLog(source_label=source_label, items_added=added,
                           items_skipped_existing=skipped))
    return added, skipped


def sync_scalar_settings(payload):
    """Update key/value site fields when a non-empty value arrives."""
    touched = 0
    for key in ("name", "title", "tagline", "bio", "location", "phone",
                "email", "github", "linkedin"):
        value = payload.get(key)
        if isinstance(value, str) and value.strip():
            current = ProfileSetting.query.get(key)
            if not current or current.value != value.strip():
                ProfileSetting.set(key, value.strip())
                touched += 1
    return touched
