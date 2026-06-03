from .neo4j_connection import neo4j_conn
from datetime import datetime, date
import uuid
from neo4j.time import Date, DateTime

class PersonRepository:
    def __init__(self):
        self.conn = neo4j_conn

    def _convert_neo4j_types(self, data):
        if isinstance(data, dict):
            return {k: self._convert_neo4j_types(v) for k, v in data.items()}
        elif isinstance(data, list):
            return [self._convert_neo4j_types(i) for i in data]
        elif isinstance(data, (Date, DateTime)):
            return data.to_native()
        return data

    def create(self, data):
        data['id'] = str(uuid.uuid4())
        data['created_at'] = datetime.utcnow().isoformat()
        data['updated_at'] = data['created_at']

        # Extract related data
        hobbies = data.pop('hobbies', [])
        idiomas = data.pop('idiomas', [])
        historial_trabajos = data.pop('historial_trabajos', [])
        educacion = data.pop('educacion', [])
        metas = data.pop('metas', [])
        tatuajes = data.pop('tatuajes', None)

        ciudad_nacimiento = data.pop('ciudad_nacimiento', None)
        pais_nacimiento = data.pop('pais_nacimiento', None)
        ciudad_residencia = data.pop('ciudad_residencia', None)
        pais_residencia = data.pop('pais_residencia', None)

        profesion_nombre = data.pop('profesion', None)
        genero_nombre = data.pop('genero', None)

        with self.conn.get_session() as session:
            # 1. Create Person node
            props = ", ".join([f"{k}: ${k}" for k in data.keys()])
            result = session.run(f"CREATE (p:Person {{ {props} }}) RETURN p", **data)
            person_id = result.single()['p']['id']

            # Helper for merging and relating
            def relate(query, **kwargs):
                session.run(query, pid=person_id, **kwargs)

            if genero_nombre:
                relate("MATCH (p:Person {id: $pid}) MERGE (g:Gender {nombre: $nombre}) MERGE (p)-[:HAS_GENDER]->(g)", nombre=genero_nombre)
            if profesion_nombre:
                relate("MATCH (p:Person {id: $pid}) MERGE (pr:Profession {nombre: $nombre}) MERGE (p)-[:WORKS_AS]->(pr)", nombre=profesion_nombre)

            if ciudad_nacimiento and pais_nacimiento:
                relate("""
                    MATCH (p:Person {id: $pid})
                    MERGE (c:Country {nombre: $pais})
                    MERGE (ct:City {nombre: $ciudad})
                    MERGE (ct)-[:IN_COUNTRY]->(c)
                    MERGE (p)-[:BORN_IN]->(ct)
                """, pais=pais_nacimiento, ciudad=ciudad_nacimiento)

            if ciudad_residencia and pais_residencia:
                relate("""
                    MATCH (p:Person {id: $pid})
                    MERGE (c:Country {nombre: $pais})
                    MERGE (ct:City {nombre: $ciudad})
                    MERGE (ct)-[:IN_COUNTRY]->(c)
                    MERGE (p)-[:LIVES_IN]->(ct)
                """, pais=pais_residencia, ciudad=ciudad_residencia)

            if hobbies:
                relate("MATCH (p:Person {id: $pid}) UNWIND $hobbies AS h MERGE (x:Hobby {nombre: h.nombre}) MERGE (p)-[:ENJOYS {active: coalesce(h.active, true), categoria: h.categoria, descripcion: h.descripcion}]->(x)", hobbies=hobbies)

            if idiomas:
                relate("MATCH (p:Person {id: $pid}) UNWIND $idiomas AS l MERGE (x:Language {nombre: l.nombre}) MERGE (p)-[:SPEAKS {nivel: l.nivel}]->(x)", idiomas=idiomas)

            if historial_trabajos:
                relate("MATCH (p:Person {id: $pid}) UNWIND $trabajos AS j MERGE (c:Company {nombre: j.empresa}) CREATE (p)-[:WORKED_AT {cargo: j.cargo, desde: j.desde, hasta: j.hasta, actual: coalesce(j.actual, false), modalidad: j.modalidad, descripcion: j.descripcion, industria: j.industria}]->(c)", trabajos=historial_trabajos)

            if educacion:
                relate("MATCH (p:Person {id: $pid}) UNWIND $edu AS e MERGE (i:Institution {nombre: e.institucion}) CREATE (p)-[:STUDIED_AT {titulo: e.titulo, area: e.area, desde: e.desde, hasta: e.hasta, actual: coalesce(e.actual, false)}]->(i)", edu=educacion)

            if metas:
                relate("MATCH (p:Person {id: $pid}) UNWIND $metas AS g CREATE (x:Goal {tipo: g.tipo, descripcion: g.descripcion, desde: g.desde, hasta: g.hasta, estado: g.estado}) CREATE (p)-[:HAS_GOAL]->(x)", metas=metas)

            if tatuajes and tatuajes.get('tiene_tatuajes'):
                relate("MATCH (p:Person {id: $pid}) CREATE (x:Tattoo {descripcion: $descripcion, estilo: $estilo, significado: $significado, cantidad: $cantidad}) CREATE (p)-[:HAS_TATTOO]->(x)", **tatuajes)

            return self.get_by_id(person_id)

    def get_all(self):
        with self.conn.get_session() as session:
            # ⚡ Bolt: Fixed O(N*M*P) Cartesian product explosion by replacing multiple OPTIONAL MATCH
            # with Cypher Pattern Comprehensions. Now runs in linear time O(N+M+P).
            query = """
            MATCH (p:Person)
            RETURN p,
                   [(p)-[:HAS_GENDER]->(g:Gender) | g.nombre][0] as genero,
                   [(p)-[:WORKS_AS]->(pr:Profession) | pr.nombre][0] as profesion,
                   [(p)-[:LIVES_IN]->(rc:City) | rc.nombre][0] as ciudad_residencia,
                   [(p)-[:LIVES_IN]->(:City)-[:IN_COUNTRY]->(rco:Country) | rco.nombre][0] as pais_residencia
            ORDER BY p.nombre ASC
            """
            result = session.run(query)
            persons = []
            for record in result:
                data = dict(record['p'])
                data['genero'] = record['genero']
                data['profesion'] = record['profesion']
                data['ciudad_residencia'] = record['ciudad_residencia']
                data['pais_residencia'] = record['pais_residencia']
                persons.append(self._convert_neo4j_types(data))
            return persons

    def get_by_id(self, person_id):
        with self.conn.get_session() as session:
            # ⚡ Bolt: Fixed O(N*M*P) Cartesian product explosion by replacing multiple OPTIONAL MATCH
            # with Cypher Pattern Comprehensions. Now runs in linear time O(N+M+P).
            query = """
            MATCH (p:Person {id: $pid})
            RETURN p,
                   [(p)-[:HAS_GENDER]->(g:Gender) | g.nombre][0] as genero,
                   [(p)-[:WORKS_AS]->(pr:Profession) | pr.nombre][0] as profesion,
                   [(p)-[:BORN_IN]->(bc:City) | bc.nombre][0] as ciudad_nacimiento,
                   [(p)-[:BORN_IN]->(:City)-[:IN_COUNTRY]->(bco:Country) | bco.nombre][0] as pais_nacimiento,
                   [(p)-[:LIVES_IN]->(rc:City) | rc.nombre][0] as ciudad_residencia,
                   [(p)-[:LIVES_IN]->(:City)-[:IN_COUNTRY]->(rco:Country) | rco.nombre][0] as pais_residencia,
                   [(p)-[:HAS_TATTOO]->(t:Tattoo) | properties(t)][0] as tatuajes,
                   [(p)-[rel_h:ENJOYS]->(h:Hobby) | {nombre: h.nombre, active: rel_h.active, categoria: rel_h.categoria, descripcion: rel_h.descripcion}] as hobbies,
                   [(p)-[rel_l:SPEAKS]->(l:Language) | {nombre: l.nombre, nivel: rel_l.nivel}] as idiomas,
                   [(p)-[rel_w:WORKED_AT]->(comp:Company) | {empresa: comp.nombre, cargo: rel_w.cargo, desde: rel_w.desde, hasta: rel_w.hasta, actual: rel_w.actual, modalidad: rel_w.modalidad, descripcion: rel_w.descripcion, industria: rel_w.industria}] as historial_trabajos,
                   [(p)-[rel_e:STUDIED_AT]->(inst:Institution) | {institucion: inst.nombre, titulo: rel_e.titulo, area: rel_e.area, desde: rel_e.desde, hasta: rel_e.hasta, actual: rel_e.actual}] as educacion,
                   [(p)-[:HAS_GOAL]->(goal:Goal) | properties(goal)] as metas
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
            data['hobbies'] = record['hobbies']
            data['idiomas'] = record['idiomas']
            data['historial_trabajos'] = record['historial_trabajos']
            data['educacion'] = record['educacion']
            data['metas'] = record['metas']
            data['tatuajes'] = record['tatuajes']

            return self._convert_neo4j_types(data)

    def update(self, person_id, data):
        with self.conn.get_session() as session:
            # 1. Update basic properties
            data['id'] = person_id
            data['updated_at'] = datetime.utcnow().isoformat()

            # Extract lists for separate handling if they exist in data
            hobbies = data.pop('hobbies', None)
            idiomas = data.pop('idiomas', None)
            historial_trabajos = data.pop('historial_trabajos', None)

            props_to_set = {k: v for k, v in data.items() if not isinstance(v, (list, dict)) or k == 'especializacion' or k == 'soft_skills' or k == 'valores_fundamentales' or k == 'motivadores' or k == 'colores_favoritos'}

            if props_to_set:
                props_to_set.pop('id', None)
                session.run("MATCH (p:Person {id: $id}) SET p += $props", id=person_id, props=props_to_set)

            # 2. For complex relationships, simplest strategy is DETACH old and RECREATE
            # (In production we'd do incremental updates)
            if hobbies is not None:
                session.run("MATCH (p:Person {id: $pid})-[r:ENJOYS]->() DELETE r", pid=person_id)
                if hobbies:
                    session.run("MATCH (p:Person {id: $pid}) UNWIND $hobbies AS h MERGE (x:Hobby {nombre: h.nombre}) MERGE (p)-[:ENJOYS {active: coalesce(h.active, true)}]->(x)", pid=person_id, hobbies=hobbies)

            if historial_trabajos is not None:
                session.run("MATCH (p:Person {id: $pid})-[r:WORKED_AT]->() DELETE r", pid=person_id)
                if historial_trabajos:
                    session.run("MATCH (p:Person {id: $pid}) UNWIND $trabajos AS j MERGE (c:Company {nombre: j.empresa}) CREATE (p)-[:WORKED_AT {cargo: j.cargo, desde: j.desde, hasta: j.hasta}]->(c)", pid=person_id, trabajos=historial_trabajos)

            return self.get_by_id(person_id)

    def delete(self, person_id):
        with self.conn.get_session() as session:
            session.run("MATCH (p:Person {id: $pid}) OPTIONAL MATCH (p)-[:HAS_GOAL]->(g:Goal) OPTIONAL MATCH (p)-[:HAS_TATTOO]->(t:Tattoo) DETACH DELETE p, g, t", pid=person_id)
            return True
