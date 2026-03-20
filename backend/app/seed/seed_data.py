import sys
import os
from datetime import date

# Add the project root to sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.abspath(os.path.join(current_dir, "..", "..", ".."))
sys.path.append(backend_dir)

from app import create_app
from app.services.person_service import person_service
from app.services.relationship_service import relationship_service

def seed():
    app = create_app()
    with app.app_context():
        # Persons
        p1_data = {
            "nombre": "Juan", "apellido": "Pérez", "edad": 29, "genero": "Masculino",
            "ciudad": "Santiago", "pais": "Chile", "profesion": "Ingeniero",
            "email": "juan@email.com", "telefono": "123456789",
            "descripcion": "Persona sociable y profesional", "intereses": ["tecnología", "deporte"],
            "signo_zodiacal": "Aries", "colores_favoritos": ["Azul", "Negro"],
            "hobbies": [{"name": "Ciclismo", "active": True}, {"name": "Guitarra", "active": False}],
            "tiene_tatuajes": True, "tatuajes_descripcion": "Un ancla en el brazo derecho",
            "historial_trabajos": [{"company": "TechCorp", "role": "Junior Dev", "period": "2018-2020"}]
        }
        p2_data = {
            "nombre": "María", "apellido": "González", "edad": 27, "genero": "Femenino",
            "ciudad": "Madrid", "pais": "España", "profesion": "Arquitecta",
            "email": "maria@email.com", "telefono": "987654321",
            "descripcion": "Amante del diseño y el arte", "intereses": ["viajes", "pintura"],
            "signo_zodiacal": "Leo", "colores_favoritos": ["Blanco", "Dorado"],
            "hobbies": [{"name": "Pintura al óleo", "active": True}],
            "tiene_tatuajes": False,
            "historial_trabajos": [{"company": "Studio Design", "role": "Architect", "period": "2020-Present"}]
        }
        p3_data = {
            "nombre": "Pedro", "apellido": "Ramírez", "edad": 35, "genero": "Masculino",
            "ciudad": "Buenos Aires", "pais": "Argentina", "profesion": "Médico",
            "email": "pedro@email.com", "telefono": "555555555",
            "descripcion": "Especialista en cardiología", "intereses": ["lectura", "ajedrez"],
            "signo_zodiacal": "Escorpio", "colores_favoritos": ["Verde"],
            "hobbies": [{"name": "Ajedrez", "active": True}, {"name": "Tenis", "active": True}],
            "tiene_tatuajes": True, "tatuajes_descripcion": "Un electrocardiograma en la muñeca",
            "historial_trabajos": [{"company": "Hospital Central", "role": "Residente", "period": "2015-2020"}]
        }
        p4_data = {
            "nombre": "Ana", "apellido": "López", "edad": 31, "genero": "Femenino",
            "ciudad": "México DF", "pais": "México", "profesion": "Diseñadora",
            "email": "ana@email.com", "telefono": "444444444",
            "descripcion": "Creativa y detallista", "intereses": ["música", "fotografía"],
            "signo_zodiacal": "Piscis", "colores_favoritos": ["Violeta", "Cian"],
            "hobbies": [{"name": "Fotografía", "active": True}, {"name": "Yoga", "active": True}],
            "tiene_tatuajes": False,
            "historial_trabajos": [{"company": "Creative Agency", "role": "Senior Designer", "period": "2019-2023"}]
        }

        p1 = person_service.create_person(p1_data)
        p2 = person_service.create_person(p2_data)
        p3 = person_service.create_person(p3_data)
        p4 = person_service.create_person(p4_data)

        # Relationships
        relationship_service.create_relationship(p1['id'], p2['id'], {
            "tipo_relacion": "amigo", "descripcion": "Se conocen de la universidad",
            "nivel_confianza": 5, "fecha_inicio": date(2015, 3, 15).isoformat()
        })
        relationship_service.create_relationship(p2['id'], p3['id'], {
            "tipo_relacion": "socio", "descripcion": "Socios en proyecto inmobiliario",
            "nivel_confianza": 4, "fecha_inicio": date(2020, 1, 10).isoformat()
        })
        relationship_service.create_relationship(p3['id'], p4['id'], {
            "tipo_relacion": "compañero_trabajo", "descripcion": "Trabajaron juntos en el hospital",
            "nivel_confianza": 3, "fecha_inicio": date(2018, 6, 20).isoformat()
        })
        relationship_service.create_relationship(p4['id'], p1['id'], {
            "tipo_relacion": "pareja", "descripcion": "Viven juntos",
            "nivel_confianza": 5, "fecha_inicio": date(2021, 5, 5).isoformat()
        })

    print("Database seeded with detailed analysis data successfully!")

if __name__ == "__main__":
    seed()
