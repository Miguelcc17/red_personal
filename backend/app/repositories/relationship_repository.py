from .neo4j_connection import neo4j_conn
from datetime import datetime, date
import uuid
import json
from neo4j.time import Date, DateTime

class RelationshipRepository:
    def __init__(self):
        self.conn = neo4j_conn

    def _convert_neo4j_types(self, data):
        if isinstance(data, dict):
            return {k: self._convert_neo4j_types(v) for k, v in data.items()}
        elif isinstance(data, list):
            return [self._convert_neo4j_types(i) for i in data]
        elif isinstance(data, (Date, DateTime)):
            return data.isoformat()
        return data

    def create(self, p1_id, p2_id, data):
        data['id'] = str(uuid.uuid4())
        data['created_at'] = datetime.utcnow().isoformat()
        data['updated_at'] = data['created_at']

        # Serialize bitacora to JSON string for storage if it exists
        if 'bitacora' in data and data['bitacora']:
            data['bitacora'] = json.dumps(data['bitacora'])
        else:
            data['bitacora'] = json.dumps([])

        with self.conn.get_session() as session:
            # ⚡ Bolt: Prevent query recompilation and cache misses by using SET r += $props
            # instead of dynamic string concatenation or explicit properties in CREATE.
            result = session.run(
                """
                MATCH (p1:Person {id: $p1_id}), (p2:Person {id: $p2_id})
                CREATE (p1)-[r:RELATED_TO]->(p2)
                SET r += $props
                RETURN r, p1.id AS p1_id, p2.id AS p2_id
                """,
                p1_id=p1_id, p2_id=p2_id, props=data
            )
            record = result.single()
            if record:
                rel = dict(record['r'])
                rel['p1_id'] = record['p1_id']
                rel['p2_id'] = record['p2_id']
                # Deserialize bitacora back to list
                if rel.get('bitacora'):
                    try: rel['bitacora'] = json.loads(rel['bitacora'])
                    except: rel['bitacora'] = []
                return self._convert_neo4j_types(rel)
            return None

    def get_all(self):
        with self.conn.get_session() as session:
            result = session.run(
                "MATCH (p1:Person)-[r:RELATED_TO]->(p2:Person) RETURN r, p1.id AS p1_id, p2.id AS p2_id"
            )
            relationships = []
            for record in result:
                rel = dict(record['r'])
                rel['p1_id'] = record['p1_id']
                rel['p2_id'] = record['p2_id']
                if rel.get('bitacora'):
                    try: rel['bitacora'] = json.loads(rel['bitacora'])
                    except: rel['bitacora'] = []
                relationships.append(self._convert_neo4j_types(rel))
            return relationships

    def get_by_id(self, rel_id):
        with self.conn.get_session() as session:
            result = session.run(
                "MATCH (p1:Person)-[r:RELATED_TO {id: $id}]->(p2:Person) RETURN r, p1.id AS p1_id, p2.id AS p2_id",
                id=rel_id
            )
            record = result.single()
            if record:
                rel = dict(record['r'])
                rel['p1_id'] = record['p1_id']
                rel['p2_id'] = record['p2_id']
                if rel.get('bitacora'):
                    try: rel['bitacora'] = json.loads(rel['bitacora'])
                    except: rel['bitacora'] = []
                return self._convert_neo4j_types(rel)
            return None

    def update(self, rel_id, data):
        data['id'] = rel_id
        data['updated_at'] = datetime.utcnow().isoformat()

        if 'bitacora' in data and data['bitacora']:
            data['bitacora'] = json.dumps(data['bitacora'])

        with self.conn.get_session() as session:
            props_to_set = {k: v for k, v in data.items() if k != 'id'}
            result = session.run(
                "MATCH (p1:Person)-[r:RELATED_TO {id: $id}]->(p2:Person) SET r += $props RETURN r, p1.id AS p1_id, p2.id AS p2_id",
                id=rel_id, props=props_to_set
            )
            record = result.single()
            if record:
                rel = dict(record['r'])
                rel['p1_id'] = record['p1_id']
                rel['p2_id'] = record['p2_id']
                if rel.get('bitacora'):
                    try: rel['bitacora'] = json.loads(rel['bitacora'])
                    except: rel['bitacora'] = []
                return self._convert_neo4j_types(rel)
            return None

    def delete(self, rel_id):
        with self.conn.get_session() as session:
            result = session.run("MATCH ()-[r:RELATED_TO {id: $id}]->() DELETE r RETURN count(r) as count", id=rel_id)
            record = result.single()
            return record['count'] > 0 if record else False
