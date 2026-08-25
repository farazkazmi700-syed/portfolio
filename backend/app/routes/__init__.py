"""API route registration."""
from app.routes.health_routes import health_bp


def register_blueprints(app):
    """Register all blueprints under the /api prefix."""
    app.register_blueprint(health_bp, url_prefix="/api")
