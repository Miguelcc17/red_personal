from .neo4j_connection import neo4j_conn
from datetime import datetime
import uuid

class PersonRepository:
    def __init__(self):
        self.conn = neo4j_conn

    def create(self, data):
        data['id'] = str(uuid.uuid4())
        data['created_at'] = datetime.utcnow().isoformat()
        data['updated_at'] = data['created_at']

        with self.conn.get_session() as session:
            result = session.run(
                """
                CREATE (p:Person {
                    id: $id,
                    nombre: $nombre,
                    apellido: $apellido,
                    edad: $edad,
                    genero: $genero,
                    ciudad: $ciudad,
                    pais: $pais,
                    profesion: $profesion,
                    email: $email,
                    telefono: $telefono,
                    descripcion: $descripcion,
                    intereses: $intereses,
                    created_at: $created_at,
                    updated_at: $updated_at
                })
                RETURN p
                """,
                **data
            )
            record = result.single()
            return dict(record['p']) if record else None

    def get_all(self):
        with self.conn.get_session() as session:
            result = session.run("MATCH (p:Person) RETURN p ORDER BY p.nombre ASC")
            return [dict(record['p']) for record in result]

    def get_by_id(self, person_id):
        with self.conn.get_session() as session:
            result = session.run("MATCH (p:Person {id: $id}) RETURN p", id=person_id)
            record = result.single()
            return dict(record['p']) if record else None

    def update(self, person_id, data):
        data['id'] = person_id
        data['updated_at'] = datetime.utcnow().isoformat()

        # Build set clause
        set_parts = []
        for key in data.keys():
            if key != 'id':
                set_parts.append(f"p.{key} = ${key}")
        set_clause = ", ".join(set_parts)

        with self.conn.get_session() as session:
            result = session.run(
                f"MATCH (p:Person {{id: $id}}) SET {set_clause} RETURN p",
                **data
            )
            record = result.single()
            return dict(record['p']) if record else None

    def delete(self, person_id):
        with self.conn.get_session() as session:
            # Delete relationships first or use DETACH DELETE
            session.run("MATCH (p:Person {id: $id}) DETACH DELETE p", id=person_id)
            return True
