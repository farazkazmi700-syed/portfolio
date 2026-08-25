"""Health & CV API routes."""
from flask import Blueprint

from app.controllers import health_controller

health_bp = Blueprint("health", __name__)


@health_bp.route("/health", methods=["GET"])
def health():
    return health_controller.health()


@health_bp.route("/cv", methods=["GET"])
def cv():
    return health_controller.get_cv()
