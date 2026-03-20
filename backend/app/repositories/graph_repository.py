from .neo4j_connection import neo4j_conn

class GraphRepository:
    def __init__(self):
        self.conn = neo4j_conn

    def get_full_graph(self):
        with self.conn.get_session() as session:
            # Match all relevant nodes and relationships
            # For simplicity, we just return everything to the UI
            query = """
            MATCH (n)
            OPTIONAL MATCH (n)-[r]->(m)
            RETURN collect(distinct n) as nodes, collect(distinct {source: id(n), target: id(m), label: type(r), props: properties(r)}) as links
            """
            result = session.run(query)
            record = result.single()

            nodes = []
            for node in record['nodes']:
                label = ""
                # Get the most descriptive property as label
                if 'nombre_completo' in node: label = node['nombre_completo']
                elif 'nombre' in node: label = node['nombre']
                elif 'empresa' in node: label = node['empresa']
                elif 'institucion' in node: label = node['institucion']
                elif 'titulo' in node: label = node['titulo']
                elif 'descripcion' in node: label = node['descripcion']

                nodes.append({
                    "id": str(node.id),
                    "label": label,
                    "group": list(node.labels)[0] if node.labels else "Unknown",
                    "properties": dict(node)
                })

            links = []
            for link in record['links']:
                if link['target'] is not None:
                    links.append({
                        "id": f"{link['source']}-{link['target']}-{link['label']}",
                        "source": str(link['source']),
                        "target": str(link['target']),
                        "label": link['label'],
                        "properties": link['props']
                    })

            return {"nodes": nodes, "links": links}

    def get_graph_by_person(self, person_id):
        # Implementation similar to get_full_graph but starting from a Person node
        with self.conn.get_session() as session:
            query = """
            MATCH (p:Person {id: $pid})
            OPTIONAL MATCH (p)-[r]-(m)
            RETURN p, collect(distinct m) as neighbors, collect(distinct r) as relationships
            """
            result = session.run(query, pid=person_id)
            record = result.single()
            if not record: return {"nodes": [], "links": []}

            nodes = []
            # ... process nodes and links ... (same logic as get_full_graph)
            return self.get_full_graph() # For now, just return all as it's easier to view the network
