from .neo4j_connection import neo4j_conn
import json

class GraphRepository:
    def __init__(self):
        self.conn = neo4j_conn

    def _process_node(self, node):
        props = dict(node)
        if 'hobbies' in props and isinstance(props['hobbies'], str):
            try: props['hobbies'] = json.loads(props['hobbies'])
            except: pass
        if 'historial_trabajos' in props and isinstance(props['historial_trabajos'], str):
            try: props['historial_trabajos'] = json.loads(props['historial_trabajos'])
            except: pass
        return props

    def get_full_graph(self):
        with self.conn.get_session() as session:
            nodes_result = session.run("MATCH (p:Person) RETURN p")
            nodes = []
            for record in nodes_result:
                node = record['p']
                processed_props = self._process_node(node)
                nodes.append({
                    "id": node['id'],
                    "label": f"{node['nombre']} {node['apellido']}",
                    "group": node['profesion'],
                    "city": node['ciudad'],
                    "properties": processed_props
                })

            links_result = session.run("MATCH (p1:Person)-[r:RELATED_TO]->(p2:Person) RETURN r, p1.id AS source, p2.id AS target")
            links = []
            for record in links_result:
                rel = record['r']
                links.append({
                    "id": rel['id'],
                    "source": record['source'],
                    "target": record['target'],
                    "label": rel['tipo_relacion'],
                    "description": rel['descripcion'],
                    "properties": dict(rel)
                })

            return {"nodes": nodes, "links": links}

    def get_graph_by_person(self, person_id):
        with self.conn.get_session() as session:
            query = """
            MATCH (p:Person {id: $id})
            OPTIONAL MATCH (p)-[r]-(neighbor:Person)
            RETURN p, collect(distinct neighbor) as neighbors, collect(distinct r) as relationships
            """
            result = session.run(query, id=person_id)
            record = result.single()
            if not record:
                return {"nodes": [], "links": []}

            p = record['p']
            neighbors = record['neighbors']
            rels = record['relationships']

            nodes = [{
                "id": p['id'],
                "label": f"{p['nombre']} {p['apellido']}",
                "group": p['profesion'],
                "city": p['ciudad'],
                "properties": self._process_node(p)
            }]
            for n in neighbors:
                if n:
                    nodes.append({
                        "id": n['id'],
                        "label": f"{n['nombre']} {n['apellido']}",
                        "group": n['profesion'],
                        "city": n['ciudad'],
                        "properties": self._process_node(n)
                    })

            links = []
            for r in rels:
                if r:
                    links.append({
                        "id": r['id'],
                        "source": r.start_node['id'],
                        "target": r.end_node['id'],
                        "label": r['tipo_relacion'],
                        "description": r['descripcion'],
                        "properties": dict(r)
                    })

            return {"nodes": nodes, "links": links}
