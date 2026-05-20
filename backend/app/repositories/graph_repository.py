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
            # ⚡ Bolt: Prevent Neo4j OutOfMemory errors and Cartesian product bottlenecks
            # by fetching nodes and links in separate, streamed queries instead of
            # forcing a single aggregated row with `collect(distinct)`.

            # Fetch nodes
            nodes_query = "MATCH (n) RETURN n"
            nodes_result = session.run(nodes_query)

            nodes = []
            for record in nodes_result:
                node = record['n']
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

            # Fetch links
            links_query = """
            MATCH (n)-[r]->(m)
            RETURN elementId(n) as source, elementId(m) as target, type(r) as label, properties(r) as props
            """
            links_result = session.run(links_query)

            links = []
            for record in links_result:
                source = record['source']
                target = record['target']
                label = record['label']
                props = record['props']

                links.append({
                    "id": f"{source}-{target}-{label}",
                    "source": source,
                    "target": target,
                    "label": label,
                    "properties": self._convert_neo4j_types(props)
                })

            return {"nodes": nodes, "links": links}

    def get_graph_by_person(self, person_id):
        # Starts from a person and expands to all neighbors within 2 hops for a good "local" view
        with self.conn.get_session() as session:
            # ⚡ Bolt: Prevent Cartesian product explosion and memory exhaustion by
            # separating node and relationship retrieval instead of forcing an
            # aggregated single-row approach with collect(distinct).

            nodes_query = """
            MATCH (p:Person {id: $pid})
            MATCH (p)-[*0..2]-(n)
            RETURN DISTINCT n
            """
            nodes_result = session.run(nodes_query, pid=person_id)

            nodes = []
            for record in nodes_result:
                node = record['n']
                label = node.get('nombre_completo') or node.get('nombre') or (list(node.labels)[0] if node.labels else "Unknown")
                nodes.append({
                    "id": node.element_id,
                    "label": label,
                    "group": list(node.labels)[0] if node.labels else "Unknown",
                    "properties": self._convert_neo4j_types(dict(node))
                })

            if not nodes:
                return {"nodes": [], "links": []}

            links_query = """
            MATCH (p:Person {id: $pid})
            MATCH (p)-[*0..2]-(n)
            WITH collect(distinct n) as all_nodes
            UNWIND all_nodes as n
            MATCH (n)-[r]->(m) WHERE m in all_nodes
            RETURN elementId(n) as source, elementId(m) as target, type(r) as label, properties(r) as props
            """
            links_result = session.run(links_query, pid=person_id)

            links = []
            for record in links_result:
                links.append({
                    "id": f"{record['source']}-{record['target']}-{record['label']}",
                    "source": record['source'],
                    "target": record['target'],
                    "label": record['label'],
                    "properties": self._convert_neo4j_types(record['props'])
                })

            return {"nodes": nodes, "links": links}
