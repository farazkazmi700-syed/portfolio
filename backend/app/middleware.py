"""Global error handling registered on the app."""
from flask import jsonify

from app.services.helpers import SyncError


def register_error_handlers(app):
    @app.errorhandler(SyncError)
    def handle_sync_error(exc):
        return (
            jsonify(
                {
                    "ok": False,
                    "error": str(exc),
                    "hint": (
                        "LinkedIn blocks anonymous scraping. Options: "
                        "(1) set SCRAPINGDOG_API_KEY or RAPIDAPI_KEY in backend/.env; "
                        "(2) POST normalized profile JSON to /api/linkedin/import; "
                        "(3) run: python backend/scripts/sync.py --import file.json"
                    ),
                }
            ),
            502,
        )

    @app.errorhandler(404)
    def handle_404(_exc):
        return jsonify({"ok": False, "error": "Not found"}), 404

    @app.errorhandler(500)
    def handle_500(_exc):
        return jsonify({"ok": False, "error": "Internal server error"}), 500
