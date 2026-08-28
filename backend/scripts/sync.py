"""CLI wrapper for the LinkedIn sync pipeline.

Examples (run from repo root, PowerShell):

  # Fetch straight from LinkedIn via configured providers (API key needed)
  backend\\venv\\Scripts\\python.exe backend\\scripts\\sync.py

  # Import a normalized profile JSON file instead (works with no API key)
  backend\\venv\\Scripts\\python.exe backend\\scripts\\sync.py --import profile.json

The command merges into backend/data/profile.json and rewrites
src/content/cvData.js.
"""
import argparse
import json
import os
import sys

_BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_ROOT_DIR = os.path.dirname(_BACKEND_DIR)
for _p in (_BACKEND_DIR, _ROOT_DIR):
    if _p not in sys.path:
        sys.path.insert(0, _p)


from app.services import generator, merger, parser, store  # noqa: E402
from app.services.helpers import SyncError  # noqa: E402
from app.services.linkedin_fetcher import DEFAULT_URL, fetch_profile_source  # noqa: E402


def main():
    ap = argparse.ArgumentParser(description="Sync LinkedIn data (DB-backed).")
    ap.add_argument("--url", default=DEFAULT_URL, help="LinkedIn profile URL")
    ap.add_argument("--import", dest="import_file",
                    help="Path to a normalized profile JSON")
    args = ap.parse_args()

    from app import create_app
    flask_app = create_app()

    if args.import_file:
        with open(args.import_file, "r", encoding="utf-8-sig") as fh:
            raw = json.load(fh)
        # Accept either our normalized schema or a raw provider payload.
        if any(k in raw for k in ("experience", "education", "certifications")) \
                and isinstance(raw.get("skills"), dict):
            incoming = raw
        else:
            incoming = parser.parse_json_payload(raw)
        label = f"manual-import:{args.import_file}"
    else:
        try:
            source = fetch_profile_source(args.url)
            incoming = parser.parse_source(source)
            label = f"linkedin-fetch:{source['kind']}"
        except SyncError as exc:
            print(f"[sync FAILED] {exc}", file=sys.stderr)
            sys.exit(1)

    from app import cms
    from app.models import db
    with flask_app.app_context():
        added, skipped = cms.merge_payload_into_db(incoming, label)
        cms.sync_scalar_settings(incoming)
        db.session.commit()
        generator.generate(cms.export_profile())
    print(f"[sync] source          : {label}")
    print(f"[sync] new items added : {added}")
    print(f"[sync] already on site : {skipped} (skipped)")



if __name__ == "__main__":
    main()
