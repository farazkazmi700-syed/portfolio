"""Normalize LinkedIn payloads (structured JSON or scraped HTML) into the
portfolio schema used by the frontend `cvData.js`.
"""
import json
import re

from app.services.helpers import SyncError, clean


def _pick(mapping, *keys):
    """Return the first non-empty value among possible key spellings."""
    for key in keys:
        value = mapping.get(key)
        if isinstance(value, str) and clean(value):
            return clean(value)
    return ""


def _fmt_range(item, start_keys=("start_date", "startDate", "started_on", "date_from"),
               end_keys=("end_date", "endDate", "ended_on", "date_to")):
    start = _pick(item, *start_keys)
    end = _pick(item, *end_keys)
    if not start and not end:
        return ""
    if start and end and end.lower() in ("present", "now"):
        return f"{start} – Present"
    if start and end:
        return f"{start} – {end}"
    return start or end or ""


def parse_json_payload(payload):
    """Parse structured provider JSON (ScrapingDog/RapidAPI style)."""
    profile = {
        "name": _pick(payload, "full_name", "fullName", "name"),
        "title": _pick(payload, "headline", "title", "current_title"),
        "bio": clean(payload.get("summary") or payload.get("about") or ""),
        "location": _pick(payload, "location", "city", "locality"),
        "email": _pick(payload, "email", "email_address"),
        "experience": [],
        "projects": [],
        "education": [],
        "certifications": [],
        "skills": {},
    }

    for item in payload.get("experiences") or payload.get("experience") or []:
        if not isinstance(item, dict):
            continue
        title = _pick(item, "title", "position", "role")
        company = _pick(item, "company", "company_name", "organization")
        if not (company or title):
            continue
        profile["experience"].append({
            "title": title,
            "company": company,
            "period": _fmt_range(item),
            "description": clean(item.get("description") or item.get("summary") or ""),
        })

    for item in payload.get("education") or payload.get("education_history") or []:
        if not isinstance(item, dict):
            continue
        school = _pick(item, "school", "school_name", "institution", "university")
        degree = _pick(item, "degree")
        field = _pick(item, "field_of_study", "field", "study", "major")
        if degree and field:
            degree = f"{degree} ({field})"
        if not (school or degree):
            continue
        period = _fmt_range(item)
        profile["education"].append({
            "degree": degree,
            "institution": school,
            "period": period,
            "status": "In Progress" if "present" in period.lower() else "Completed",
        })

    for item in payload.get("certifications") or payload.get("certification") or []:
        if not isinstance(item, dict):
            continue
        name = _pick(item, "name", "certification_name", "title")
        if not name:
            continue
        profile["certifications"].append({
            "name": name,
            "issuer": _pick(item, "issuer", "authority", "organization", "provider"),
            "period": _fmt_range(
                item,
                start_keys=("start_date", "issue_date", "issueDate", "startDate", "date"),
                end_keys=("end_date", "expiry_date", "endDate"),
            ),
        })

    for item in payload.get("projects") or []:
        if not isinstance(item, dict):
            continue
        title = _pick(item, "name", "title", "project_name")
        if not title:
            continue
        profile["projects"].append({
            "title": title,
            "description": clean(item.get("description") or item.get("summary") or ""),
            "tags": [clean(t) for t in item.get("tags") or [] if clean(t)],
            "category": _pick(item, "category") or "Machine Learning",
            "github": _pick(item, "url", "link", "github"),
        })

    raw_skills = []
    for entry in payload.get("skills") or []:
        if isinstance(entry, str):
            raw_skills.append(clean(entry))
        elif isinstance(entry, dict):
            raw_skills.append(_pick(entry, "name", "skill", "title"))
    if raw_skills:
        profile["skills"]["LinkedIn Skills"] = [s for s in raw_skills if s]

    return profile


def parse_html(html_text):
    """Best-effort extraction from an anonymous public-profile HTML page.

    The guest page embeds JSON blobs that include 'experience'/'education'
    keys. We scan script blocks for them; when none are found the page was an
    auth-wall and we raise.
    """
    for block in re.findall(r"<script[^>]*>(.*?)</script>", html_text, flags=re.S | re.I):
        try:
            data = json.loads(block)
        except (json.JSONDecodeError, TypeError):
            continue

        stack = [data]
        while stack:
            node = stack.pop()
            if isinstance(node, dict):
                if "experience" in node or "education" in node:
                    parsed = parse_json_payload(node)
                    if any((parsed["experience"], parsed["education"],
                            parsed["certifications"])):
                        return parsed
                stack.extend(node.values())
            elif isinstance(node, list):
                stack.extend(node)

    raise SyncError(
        "Could not extract structured data from the public profile HTML "
        "(profile likely behind LinkedIn's auth wall). Use an API provider "
        "key or the manual import endpoint."
    )


def parse_source(source):
    """Dispatch on fetch_profile_source() output kind."""
    if source["kind"] == "json":
        return parse_json_payload(source["payload"])
    return parse_html(source["html"])

