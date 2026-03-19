from flask import Flask
from flask_cors import CORS
from .config import Config
from .repositories.neo4j_connection import init_neo4j

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    CORS(app)

    # Initialize Neo4j
    init_neo4j(app)

    # Register blueprints
    from .routes.health import health_bp
    from .routes.persons import persons_bp
    from .routes.relationships import relationships_bp
    from .routes.graph import graph_bp

    app.register_blueprint(health_bp, url_prefix='/api')
    app.register_blueprint(persons_bp, url_prefix='/api')
    app.register_blueprint(relationships_bp, url_prefix='/api')
    app.register_blueprint(graph_bp, url_prefix='/api')

    return app
