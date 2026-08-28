"""Merge a freshly-parsed LinkedIn profile into the stored snapshot.

Rules (per the user's requirements):
- Existing entries are matched by identity keys. Matched entries keep their
  ORIGINAL date/period ("update ... with old one" = never lose the old dates)
  but get refreshed content (title, description, issuer...).
- Brand-new entries found on LinkedIn are added with their LinkedIn dates.
- Every section is re-sorted into proper sequence: newest first, unknown
  dates last (stable among themselves).
- Simple scalar fields (name, title, bio, location) only fill empty slots,
  so manual overrides in cvData are never clobbered.
"""
from app.services.helpers import period_sort_key


def _key_item(item):
    lowered = {k: str(v).strip().lower() for k, v in item.items() if isinstance(v, str)}
    return tuple(sorted(lowered.items()))


def _match_key(kind, item):
    """Identity key per section kind."""
    title = (item.get("title") or item.get("name") or item.get("degree") or "").lower().strip()
    if kind == "experience":
        return (title, (item.get("company") or "").lower().strip())
    if kind == "education":
        return (title, (item.get("institution") or "").lower().strip())
    if kind == "certifications":
        return (title, (item.get("issuer") or "").lower().strip())
    if kind == "projects":
        return (title,)
    return (title,)


def _merge_section(kind, existing, incoming):
    added = updated = 0
    existing_map = {_match_key(kind, e): dict(e) for e in existing}
    index = {_match_key(kind, e): i for i, e in enumerate(existing)}

    merged = [dict(e) for e in existing]

    for new in incoming:
        if not any(new.values()):
            continue
        key = _match_key(kind, new)
        if key in index:
            i = index[key]
            current = merged[i]
            changed = False
            for field, value in new.items():
                if value and value != current.get(field):
                    # Keep the original period/date of old entries.
                    if field == "period" and current.get("period"):
                        continue
                    current[field] = value
                    changed = True
            if changed:
                updated += 1
        else:
            merged.append(dict(new))
            existing_map[key] = new
            index[key] = len(merged) - 1
            added += 1

    # Proper sequence: newest first; entries without a date keep stable order
    # at the end (Python's sort is stable even with reverse=True).
    merged.sort(
        key=lambda item: period_sort_key(item.get("period")),
        reverse=True,
    )
    return merged, added, updated


_LIST_SECTIONS = (
    ("experience", ["title", "company", "period", "description"]),
    ("projects", ["title", "description", "tags", "category", "github"]),
    ("education", ["degree", "institution", "period", "status"]),
    ("certifications", ["name", "issuer", "period"]),
)


def merge(current, incoming):
    """Merge `incoming` LinkedIn profile into `current` store.

    Returns (merged_profile, stats_dict).
    """
    stats = {"added": 0, "updated": 0}
    merged = dict(current)

    # --- scalar fields: only fill blanks, never overwrite manual edits ----
    for field in ("name", "title", "bio", "location", "email", "tagline"):
        value = incoming.get(field)
        if value and not current.get(field):
            merged[field] = value
            stats["updated"] += 0

    linkedin_url = incoming.get("linkedin") or current.get("linkedin")
    merged["linkedin"] = linkedin_url

    # --- list sections ----------------------------------------------------
    for kind, _fields in _LIST_SECTIONS:
        section_merged, added, updated = _merge_section(
            kind, current.get(kind) or [], incoming.get(kind) or []
        )
        merged[kind] = section_merged
        stats["added"] += added
        stats["updated"] += updated

    # --- skills: union categories; keep category order ---------------------
    skills = dict(current.get("skills") or {})
    for category, items in (incoming.get("skills") or {}).items():
        existing_items = skills.get(category, [])
        combined = list(existing_items)
        for s in items:
            low = s.lower()
            if not any(s.lower() == e.lower() for e in combined):
                combined.append(s)
                stats["added"] += 1
        skills[category] = combined

    # Soft skills from providers land as one bucket; append uniques there.
    for s in incoming.get("softSkills") or []:
        low = s.lower()
        if not any(str(x).lower() == low for x in merged.get("softSkills") or []):
            merged.setdefault("softSkills", []).append(s)
            stats["added"] += 1

    merged["skills"] = skills
    return merged, stats
