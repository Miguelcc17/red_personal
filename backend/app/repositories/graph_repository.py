from .neo4j_connection import neo4j_conn

class GraphRepository:
    def __init__(self):
        self.conn = neo4j_conn

    def get_full_graph(self):
        with self.conn.get_session() as session:
            # Get all persons as nodes
            nodes_result = session.run("MATCH (p:Person) RETURN p")
            nodes = []
            for record in nodes_result:
                node = record['p']
                nodes.append({
                    "id": node['id'],
                    "label": f"{node['nombre']} {node['apellido']}",
                    "group": node['profesion'],
                    "city": node['ciudad'],
                    "properties": dict(node)
                })

            # Get all relationships as links
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
            # Get person and their immediate neighbors
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
                "properties": dict(p)
            }]
            for n in neighbors:
                if n:
                    nodes.append({
                        "id": n['id'],
                        "label": f"{n['nombre']} {n['apellido']}",
                        "group": n['profesion'],
                        "city": n['ciudad'],
                        "properties": dict(n)
                    })

            links = []
            for r in rels:
                if r:
                    # Determine source/target from the relationship itself if possible, but neo4j relationship has start_node and end_node
                    links.append({
                        "id": r['id'],
                        "source": r.start_node['id'],
                        "target": r.end_node['id'],
                        "label": r['tipo_relacion'],
                        "description": r['descripcion'],
                        "properties": dict(r)
                    })

            return {"nodes": nodes, "links": links}
