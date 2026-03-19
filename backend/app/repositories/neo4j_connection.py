from neo4j import GraphDatabase
from flask import current_app

class Neo4jConnection:
    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self.driver.close()

    def get_session(self):
        return self.driver.session()

# The global instance will be initialized in extensions.py or __init__.py
neo4j_conn = None

def init_neo4j(app):
    global neo4j_conn
    neo4j_conn = Neo4jConnection(
        app.config['NEO4J_URI'],
        app.config['NEO4J_USER'],
        app.config['NEO4J_PASSWORD']
    )
    return neo4j_conn
