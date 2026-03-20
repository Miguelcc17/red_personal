from .neo4j_connection import neo4j_conn
from datetime import datetime, date
import uuid

class PersonRepository:
    def __init__(self):
        self.conn = neo4j_conn

    def _serialize_date(self, obj):
        if isinstance(obj, (date, datetime)):
            return obj.isoformat()
        return obj

    def create(self, data):
        data['id'] = str(uuid.uuid4())
        data['created_at'] = datetime.utcnow().isoformat()
        data['updated_at'] = data['created_at']

        # Extract related data to create nodes/relationships
        hobbies = data.pop('hobbies', [])
        idiomas = data.pop('idiomas', [])
        historial_trabajos = data.pop('historial_trabajos', [])
        educacion = data.pop('educacion', [])
        metas = data.pop('metas', [])
        tatuajes = data.pop('tatuajes', None)

        # Location names
        ciudad_nacimiento = data.pop('ciudad_nacimiento', None)
        pais_nacimiento = data.pop('pais_nacimiento', None)
        ciudad_residencia = data.pop('ciudad_residencia', None)
        pais_residencia = data.pop('pais_residencia', None)

        # Simple related entities
        profesion_nombre = data.pop('profesion', None)
        genero_nombre = data.pop('genero', None)

        with self.conn.get_session() as session:
            # 1. Create Person node
            props = ", ".join([f"{k}: ${k}" for k in data.keys()])
            result = session.run(
                f"CREATE (p:Person {{ {props} }}) RETURN p",
                **data
            )
            person_node = result.single()['p']
            person_id = person_node['id']

            # 2. Handle simple related nodes (MERGE)
            if genero_nombre:
                session.run("MATCH (p:Person {id: $pid}) MERGE (g:Gender {nombre: $nombre}) MERGE (p)-[:HAS_GENDER]->(g)", pid=person_id, nombre=genero_nombre)
            if profesion_nombre:
                session.run("MATCH (p:Person {id: $pid}) MERGE (pr:Profession {nombre: $nombre}) MERGE (p)-[:WORKS_AS]->(pr)", pid=person_id, nombre=profesion_nombre)

            # 3. Handle Locations
            if ciudad_nacimiento and pais_nacimiento:
                session.run("""
                    MATCH (p:Person {id: $pid})
                    MERGE (c:Country {nombre: $pais})
                    MERGE (ct:City {nombre: $ciudad})
                    MERGE (ct)-[:IN_COUNTRY]->(c)
                    MERGE (p)-[:BORN_IN]->(ct)
                """, pid=person_id, pais=pais_nacimiento, ciudad=ciudad_nacimiento)

            if ciudad_residencia and pais_residencia:
                session.run("""
                    MATCH (p:Person {id: $pid})
                    MERGE (c:Country {nombre: $pais})
                    MERGE (ct:City {nombre: $ciudad})
                    MERGE (ct)-[:IN_COUNTRY]->(c)
                    MERGE (p)-[:LIVES_IN]->(ct)
                """, pid=person_id, pais=pais_residencia, ciudad=ciudad_residencia)

            # 4. Handle Hobbies
            for hobby in hobbies:
                session.run("""
                    MATCH (p:Person {id: $pid})
                    MERGE (h:Hobby {nombre: $nombre})
                    MERGE (p)-[:ENJOYS {active: $active, categoria: $categoria, descripcion: $descripcion}]->(h)
                """, pid=person_id, nombre=hobby['nombre'], active=hobby.get('active', True), categoria=hobby.get('categoria'), descripcion=hobby.get('descripcion'))

            # 5. Handle Languages
            for lang in idiomas:
                session.run("""
                    MATCH (p:Person {id: $pid})
                    MERGE (l:Language {nombre: $nombre})
                    MERGE (p)-[:SPEAKS {nivel: $nivel}]->(l)
                """, pid=person_id, nombre=lang['nombre'], nivel=lang.get('nivel'))

            # 6. Handle Work Experience
            for job in historial_trabajos:
                session.run("""
                    MATCH (p:Person {id: $pid})
                    MERGE (c:Company {nombre: $empresa})
                    CREATE (p)-[:WORKED_AT {
                        cargo: $cargo,
                        desde: $desde,
                        hasta: $hasta,
                        actual: $actual,
                        modalidad: $modalidad,
                        descripcion: $descripcion,
                        industria: $industria
                    }]->(c)
                """, pid=person_id, **job)

            # 7. Handle Education
            for edu in educacion:
                session.run("""
                    MATCH (p:Person {id: $pid})
                    MERGE (i:Institution {nombre: $institucion})
                    CREATE (p)-[:STUDIED_AT {
                        titulo: $titulo,
                        area: $area,
                        desde: $desde,
                        hasta: $hasta,
                        actual: $actual
                    }]->(i)
                """, pid=person_id, **edu)

            # 8. Handle Goals
            for goal in metas:
                session.run("""
                    MATCH (p:Person {id: $pid})
                    CREATE (g:Goal {
                        tipo: $tipo,
                        descripcion: $descripcion,
                        desde: $desde,
                        hasta: $hasta,
                        estado: $estado
                    })
                    CREATE (p)-[:HAS_GOAL]->(g)
                """, pid=person_id, **goal)

            # 9. Handle Tattoos
            if tatuajes and tatuajes.get('tiene_tatuajes'):
                session.run("""
                    MATCH (p:Person {id: $pid})
                    CREATE (t:Tattoo {
                        descripcion: $descripcion,
                        estilo: $estilo,
                        significado: $significado,
                        cantidad: $cantidad
                    })
                    CREATE (p)-[:HAS_TATTOO]->(t)
                """, pid=person_id, **tatuajes)

            return self.get_by_id(person_id)

    def get_all(self):
        # This becomes more complex as we need to aggregate related data
        # For listing, we might just return basic person info
        with self.conn.get_session() as session:
            result = session.run("MATCH (p:Person) RETURN p ORDER BY p.nombre ASC")
            return [dict(record['p']) for record in result]

    def get_by_id(self, person_id):
        with self.conn.get_session() as session:
            # Complex query to get person and all related nodes/relationships
            query = """
            MATCH (p:Person {id: $pid})
            OPTIONAL MATCH (p)-[:HAS_GENDER]->(g:Gender)
            OPTIONAL MATCH (p)-[:WORKS_AS]->(pr:Profession)
            OPTIONAL MATCH (p)-[:BORN_IN]->(bc:City)-[:IN_COUNTRY]->(bco:Country)
            OPTIONAL MATCH (p)-[:LIVES_IN]->(rc:City)-[:IN_COUNTRY]->(rco:Country)
            OPTIONAL MATCH (p)-[rel_h:ENJOYS]->(h:Hobby)
            OPTIONAL MATCH (p)-[rel_l:SPEAKS]->(l:Language)
            OPTIONAL MATCH (p)-[rel_w:WORKED_AT]->(comp:Company)
            OPTIONAL MATCH (p)-[rel_e:STUDIED_AT]->(inst:Institution)
            OPTIONAL MATCH (p)-[:HAS_GOAL]->(goal:Goal)
            OPTIONAL MATCH (p)-[:HAS_TATTOO]->(t:Tattoo)

            RETURN p, g.nombre as genero, pr.nombre as profesion,
                   bc.nombre as ciudad_nacimiento, bco.nombre as pais_nacimiento,
                   rc.nombre as ciudad_residencia, rco.nombre as pais_residencia,
                   collect(distinct {nombre: h.nombre, active: rel_h.active, categoria: rel_h.categoria, descripcion: rel_h.descripcion}) as hobbies,
                   collect(distinct {nombre: l.nombre, nivel: rel_l.nivel}) as idiomas,
                   collect(distinct {empresa: comp.nombre, cargo: rel_w.cargo, desde: rel_w.desde, hasta: rel_w.hasta, actual: rel_w.actual, modalidad: rel_w.modalidad, descripcion: rel_w.descripcion, industria: rel_w.industria}) as historial_trabajos,
                   collect(distinct {institucion: inst.nombre, titulo: rel_e.titulo, area: rel_e.area, desde: rel_e.desde, hasta: rel_e.hasta, actual: rel_e.actual}) as educacion,
                   collect(distinct properties(goal)) as metas,
                   properties(t) as tatuajes
            """
            result = session.run(query, pid=person_id)
            record = result.single()
            if not record: return None

            data = dict(record['p'])
            data['genero'] = record['genero']
            data['profesion'] = record['profesion']
            data['ciudad_nacimiento'] = record['ciudad_nacimiento']
            data['pais_nacimiento'] = record['pais_nacimiento']
            data['ciudad_residencia'] = record['ciudad_residencia']
            data['pais_residencia'] = record['pais_residencia']
            data['hobbies'] = [x for x in record['hobbies'] if x['nombre'] is not None]
            data['idiomas'] = [x for x in record['idiomas'] if x['nombre'] is not None]
            data['historial_trabajos'] = [x for x in record['historial_trabajos'] if x['empresa'] is not None]
            data['educacion'] = [x for x in record['educacion'] if x['institucion'] is not None]
            data['metas'] = record['metas']
            data['tatuajes'] = record['tatuajes']

            return data

    def update(self, person_id, data):
        # For simplicity in this project, we delete and recreate relationships on update
        # or just update simple properties. Real world would be more granular.
        with self.conn.get_session() as session:
            # 1. Update simple properties on Person node
            props_to_set = {k: v for k, v in data.items() if isinstance(v, (str, int, float, bool, list)) and k not in ['id', 'hobbies', 'idiomas', 'historial_trabajos', 'educacion', 'metas', 'tatuajes']}
            if props_to_set:
                props_to_set['id'] = person_id
                props_to_set['updated_at'] = datetime.utcnow().isoformat()
                set_clause = ", ".join([f"p.{k} = ${k}" for k in props_to_set.keys() if k != 'id'])
                session.run(f"MATCH (p:Person {{id: $id}}) SET {set_clause}", **props_to_set)

            # Implementation of full update for all related nodes is omitted for brevity,
            # but would follow similar logic to create() but with initial DETACHing of old specific relations.

            return self.get_by_id(person_id)

    def delete(self, person_id):
        with self.conn.get_session() as session:
            # Delete Person and their unique nodes (Goals, Tattoos)
            # Shared nodes (City, Country, Profession) stay.
            session.run("""
                MATCH (p:Person {id: $pid})
                OPTIONAL MATCH (p)-[:HAS_GOAL]->(g:Goal)
                OPTIONAL MATCH (p)-[:HAS_TATTOO]->(t:Tattoo)
                DETACH DELETE p, g, t
            """, pid=person_id)
            return True
