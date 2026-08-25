"""Controllers for health & CV endpoints."""
import time

from flask import jsonify


def health():
    return (
        jsonify(
            {
                "success": True,
                "status": "healthy",
                "uptime": round(time.time()),
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
            }
        ),
        200,
    )


def get_cv():
    # TODO: serve real CV data here (DB / file / CMS)
    return (
        jsonify(
            {
                "success": True,
                "message": "CV endpoint — wire up your data source in app/controllers/health_controller.py",
            }
        ),
        200,
    )
