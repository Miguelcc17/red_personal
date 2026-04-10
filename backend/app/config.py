import os
from dotenv import load_dotenv

# Try root .env first, then local .env
if os.path.exists('.env'):
    load_dotenv('.env')
elif os.path.exists('../.env'):
    load_dotenv('../.env')

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'default-secret-key')
    DEBUG = os.getenv('FLASK_DEBUG', '1') == '1'

    # Use APP_ prefixes to avoid conflict with standard Neo4j image variables
    NEO4J_URI = os.getenv('APP_NEO4J_URI', 'bolt://neo4j:7687')
    NEO4J_USER = os.getenv('APP_NEO4J_USER', 'neo4j')
    NEO4J_PASSWORD = os.getenv('APP_NEO4J_PASSWORD', 'password')
