"""Error handlers / middleware registration."""


def register_error_handlers(app):
    """Register global error handlers on the app."""

    @app.errorhandler(404)
    def not_found(_error):
        return {"success": False, "message": "Route not found"}, 404

    @app.errorhandler(500)
    def internal_error(error):
        return {"success": False, "message": str(error) or "Internal Server Error"}, 500

    @app.errorhandler(Exception)
    def unhandled_exception(error):
        app.logger.exception("Unhandled exception")
        return {"success": False, "message": "Internal Server Error"}, 500
