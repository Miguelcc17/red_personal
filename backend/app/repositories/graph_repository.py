from .neo4j_connection import neo4j_conn
from neo4j.time import Date, DateTime

class GraphRepository:
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

    def get_full_graph(self):
        with self.conn.get_session() as session:
            # elementId() is the correct way to get a unique identifier in Neo4j 5.x
            query = """
            MATCH (n)
            OPTIONAL MATCH (n)-[r]->(m)
            RETURN collect(distinct n) as nodes, collect(distinct {source: elementId(n), target: elementId(m), label: type(r), props: properties(r)}) as links
            """
            result = session.run(query)
            record = result.single()

            nodes = []
            for node in record['nodes']:
                label = ""
                if 'nombre_completo' in node: label = node['nombre_completo']
                elif 'nombre' in node: label = node['nombre']
                elif 'empresa' in node: label = node['empresa']
                elif 'institucion' in node: label = node['institucion']
                elif 'titulo' in node: label = node['titulo']
                elif 'descripcion' in node: label = node['descripcion']

                # We use element_id as the primary id for visualization
                nodes.append({
                    "id": node.element_id,
                    "label": label or str(node.element_id),
                    "group": list(node.labels)[0] if node.labels else "Unknown",
                    "properties": self._convert_neo4j_types(dict(node))
                })

            links = []
            for link in record['links']:
                if link['target'] is not None:
                    links.append({
                        "id": f"{link['source']}-{link['target']}-{link['label']}",
                        "source": link['source'],
                        "target": link['target'],
                        "label": link['label'],
                        "properties": self._convert_neo4j_types(link['props'])
                    })

            return {"nodes": nodes, "links": links}

    def get_graph_by_person(self, person_id):
        # Starts from a person and expands to all neighbors within 2 hops for a good "local" view
        with self.conn.get_session() as session:
            query = """
            MATCH (p:Person {id: $pid})
            OPTIONAL MATCH path = (p)-[*1..2]-(m)
            WITH p, collect(distinct m) + p as all_nodes
            UNWIND all_nodes as n
            OPTIONAL MATCH (n)-[r]->(m) WHERE m in all_nodes
            RETURN collect(distinct n) as nodes, collect(distinct {source: elementId(n), target: elementId(m), label: type(r), props: properties(r)}) as links
            """
            result = session.run(query, pid=person_id)
            record = result.single()
            if not record or not record['nodes']:
                return {"nodes": [], "links": []}

            nodes = []
            for node in record['nodes']:
                label = node.get('nombre_completo') or node.get('nombre') or list(node.labels)[0]
                nodes.append({
                    "id": node.element_id,
                    "label": label,
                    "group": list(node.labels)[0] if node.labels else "Unknown",
                    "properties": self._convert_neo4j_types(dict(node))
                })

            links = []
            for link in record['links']:
                if link['target'] is not None:
                    links.append({
                        "id": f"{link['source']}-{link['target']}-{link['label']}",
                        "source": link['source'],
                        "target": link['target'],
                        "label": link['label'],
                        "properties": self._convert_neo4j_types(link['props'])
                    })

            return {"nodes": nodes, "links": links}
