"""Flask application factory."""
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config import Config


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # --- Extensions ---
    CORS(app)
    JWTManager(app)

    from app.models import db

    db.init_app(app)

    # --- Ensure tables/columns exist and seed default portfolio/admin data ---
    with app.app_context():
        from app.models import ensure_schema, seed_if_empty
        ensure_schema()
        seed_if_empty()

    # --- Blueprints (routes) ---
    from app.routes import register_blueprints

    register_blueprints(app)

    # --- Middleware / error handlers ---
    from app.middleware import register_error_handlers

    register_error_handlers(app)

    return app
