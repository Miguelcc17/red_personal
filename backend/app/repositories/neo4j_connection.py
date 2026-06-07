from neo4j import GraphDatabase
from flask import current_app
import time
import logging

logger = logging.getLogger('people-network')

class Neo4jConnection:
    def __init__(self, uri, user, password):
        self.uri = uri
        self.user = user
        self.password = password
        self.driver = None
        self.connect()

    def connect(self):
        retries = 5
        while retries > 0:
            try:
                self.driver = GraphDatabase.driver(self.uri, auth=(self.user, self.password))
                # Test connection
                self.driver.verify_connectivity()
                logger.info(f"Successfully connected to Neo4j at {self.uri}")

                # ⚡ Bolt: Add database indexes to optimize O(N) full node scans to O(log N) index lookups
                try:
                    with self.driver.session() as session:
                        session.run("CREATE INDEX IF NOT EXISTS FOR (p:Person) ON (p.id)")
                        session.run("CREATE INDEX IF NOT EXISTS FOR ()-[r:RELATED_TO]-() ON (r.id)")

                        # ⚡ Bolt: Add indexes for properties frequently used in MERGE operations
                        # This prevents O(N) full graph scans and changes them to O(log N) lookups
                        for label in ['Gender', 'Profession', 'Country', 'City', 'Hobby', 'Language', 'Company', 'Institution']:
                            session.run(f"CREATE INDEX IF NOT EXISTS FOR (n:{label}) ON (n.nombre)")
                except Exception as index_e:
                    logger.warning(f"Failed to create indexes: {index_e}")

                return
            except Exception as e:
                retries -= 1
                logger.warning(f"Failed to connect to Neo4j at {self.uri}. Retrying... ({retries} left). Error: {e}")
                time.sleep(5)

        logger.error(f"Could not connect to Neo4j after multiple retries.")

    def close(self):
        if self.driver:
            self.driver.close()

    def get_session(self):
        if not self.driver:
            self.connect()
        return self.driver.session()

# The global instance
neo4j_conn = None

def init_neo4j(app):
    global neo4j_conn
    neo4j_conn = Neo4jConnection(
        app.config['NEO4J_URI'],
        app.config['NEO4J_USER'],
        app.config['NEO4J_PASSWORD']
    )
    return neo4j_conn
