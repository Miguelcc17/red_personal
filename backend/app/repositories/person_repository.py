from .neo4j_connection import neo4j_conn
from datetime import datetime
import uuid
import json

class PersonRepository:
    def __init__(self):
        self.conn = neo4j_conn

    def _prepare_data(self, data):
        # Convert lists and dicts to strings for Neo4j storage
        prepared_data = data.copy()
        if 'hobbies' in prepared_data:
            prepared_data['hobbies'] = json.dumps(prepared_data['hobbies'])
        if 'historial_trabajos' in prepared_data:
            prepared_data['historial_trabajos'] = json.dumps(prepared_data['historial_trabajos'])
        return prepared_data

    def _unprepare_node(self, node):
        # Convert strings back to lists and dicts
        node_dict = dict(node)
        if 'hobbies' in node_dict and node_dict['hobbies']:
            try:
                node_dict['hobbies'] = json.loads(node_dict['hobbies'])
            except: pass
        if 'historial_trabajos' in node_dict and node_dict['historial_trabajos']:
            try:
                node_dict['historial_trabajos'] = json.loads(node_dict['historial_trabajos'])
            except: pass
        return node_dict

    def create(self, data):
        data['id'] = str(uuid.uuid4())
        data['created_at'] = datetime.utcnow().isoformat()
        data['updated_at'] = data['created_at']

        prepared_data = self._prepare_data(data)

        # Construct dynamic create query based on properties
        props = ", ".join([f"{k}: ${k}" for k in prepared_data.keys()])

        with self.conn.get_session() as session:
            result = session.run(
                f"CREATE (p:Person {{ {props} }}) RETURN p",
                **prepared_data
            )
            record = result.single()
            return self._unprepare_node(record['p']) if record else None

    def get_all(self):
        with self.conn.get_session() as session:
            result = session.run("MATCH (p:Person) RETURN p ORDER BY p.nombre ASC")
            return [self._unprepare_node(record['p']) for record in result]

    def get_by_id(self, person_id):
        with self.conn.get_session() as session:
            result = session.run("MATCH (p:Person {id: $id}) RETURN p", id=person_id)
            record = result.single()
            return self._unprepare_node(record['p']) if record else None

    def update(self, person_id, data):
        data['id'] = person_id
        data['updated_at'] = datetime.utcnow().isoformat()

        prepared_data = self._prepare_data(data)

        set_parts = []
        for key in prepared_data.keys():
            if key != 'id':
                set_parts.append(f"p.{key} = ${key}")
        set_clause = ", ".join(set_parts)

        with self.conn.get_session() as session:
            result = session.run(
                f"MATCH (p:Person {{id: $id}}) SET {set_clause} RETURN p",
                **prepared_data
            )
            record = result.single()
            return self._unprepare_node(record['p']) if record else None

    def delete(self, person_id):
        with self.conn.get_session() as session:
            session.run("MATCH (p:Person {id: $id}) DETACH DELETE p", id=person_id)
            return True
