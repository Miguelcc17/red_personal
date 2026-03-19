from .neo4j_connection import neo4j_conn
from datetime import datetime
import uuid

class RelationshipRepository:
    def __init__(self):
        self.conn = neo4j_conn

    def create(self, p1_id, p2_id, data):
        data['id'] = str(uuid.uuid4())
        data['created_at'] = datetime.utcnow().isoformat()
        data['updated_at'] = data['created_at']

        with self.conn.get_session() as session:
            result = session.run(
                """
                MATCH (p1:Person {id: $p1_id}), (p2:Person {id: $p2_id})
                CREATE (p1)-[r:RELATED_TO {
                    id: $id,
                    tipo_relacion: $tipo_relacion,
                    descripcion: $descripcion,
                    nivel_confianza: $nivel_confianza,
                    fecha_inicio: $fecha_inicio,
                    created_at: $created_at,
                    updated_at: $updated_at
                }]->(p2)
                RETURN r, p1.id AS p1_id, p2.id AS p2_id
                """,
                p1_id=p1_id, p2_id=p2_id, **data
            )
            record = result.single()
            if record:
                rel = dict(record['r'])
                rel['p1_id'] = record['p1_id']
                rel['p2_id'] = record['p2_id']
                return rel
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
                relationships.append(rel)
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
                return rel
            return None

    def update(self, rel_id, data):
        data['id'] = rel_id
        data['updated_at'] = datetime.utcnow().isoformat()

        set_parts = []
        for key in data.keys():
            if key != 'id':
                set_parts.append(f"r.{key} = ${key}")
        set_clause = ", ".join(set_parts)

        with self.conn.get_session() as session:
            result = session.run(
                f"MATCH (p1:Person)-[r:RELATED_TO {{id: $id}}]->(p2:Person) SET {set_clause} RETURN r, p1.id AS p1_id, p2.id AS p2_id",
                **data
            )
            record = result.single()
            if record:
                rel = dict(record['r'])
                rel['p1_id'] = record['p1_id']
                rel['p2_id'] = record['p2_id']
                return rel
            return None

    def delete(self, rel_id):
        with self.conn.get_session() as session:
            session.run("MATCH ()-[r:RELATED_TO {id: $id}]->() DELETE r", id=rel_id)
            return True
