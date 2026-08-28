"""Load/save the merged portfolio snapshot persisted at backend/data/profile.json."""
import copy
import json
import os
from datetime import datetime, timezone

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(
    os.path.dirname(os.path.abspath(__file__)))))
DATA_DIR = os.path.join(BASE_DIR, "backend", "data")
STORE_PATH = os.path.join(DATA_DIR, "profile.json")

# Shape of a freshly seeded store when no snapshot exists yet.
_SEED = {
    "name": "",
    "title": "",
    "tagline": "",
    "bio": "",
    "location": "",
    "phone": "",
    "email": "",
    "github": "",
    "linkedin": "https://www.linkedin.com/in/muhammad-faraz-kazmi/",
    "skills": {},
    "softSkills": [],
    "experience": [],
    "projects": [],
    "education": [],
    "certifications": [],
    "meta": {
        "lastSyncedAt": None,
        "lastSource": None,
        "updates": [],  # history: [{at, source, added, updated}]
    },
}


def load():
    """Load the stored profile; seed an empty one on first run."""
    if not os.path.exists(STORE_PATH):
        return copy.deepcopy(_SEED)
    with open(STORE_PATH, "r", encoding="utf-8") as fh:
        data = json.load(fh)
    # Guarantee all seed keys exist even for older snapshots.
    for key, value in _SEED.items():
        data.setdefault(key, copy.deepcopy(value))
    return data


def save(profile):
    """Persist the merged profile snapshot atomically."""
    os.makedirs(DATA_DIR, exist_ok=True)
    tmp = STORE_PATH + ".tmp"
    with open(tmp, "w", encoding="utf-8") as fh:
        json.dump(profile, fh, indent=2, ensure_ascii=False)
    os.replace(tmp, STORE_PATH)


def record_update(profile, source, added=None, updated=None):
    """Append a sync-history entry and stamp the snapshot."""
    meta = profile.setdefault("meta", {})
    meta["lastSyncedAt"] = datetime.now(timezone.utc).isoformat(timespec="seconds")
    meta["lastSource"] = source
    updates = meta.setdefault("updates", [])
    updates.append({
        "at": meta["lastSyncedAt"],
        "source": source,
        "added": added or 0,
        "updated": updated or 0,
    })
    del updates[:-25]  # keep the last 25 entries
