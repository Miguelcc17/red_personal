import sys
import os
from datetime import datetime, date
import uuid

# Add the parent directory to sys.path to import from app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

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
            "descripcion": "Persona sociable y profesional", "intereses": ["tecnología", "deporte"]
        }
        p2_data = {
            "nombre": "María", "apellido": "González", "edad": 27, "genero": "Femenino",
            "ciudad": "Madrid", "pais": "España", "profesion": "Arquitecta",
            "email": "maria@email.com", "telefono": "987654321",
            "descripcion": "Amante del diseño y el arte", "intereses": ["viajes", "pintura"]
        }
        p3_data = {
            "nombre": "Pedro", "apellido": "Ramírez", "edad": 35, "genero": "Masculino",
            "ciudad": "Buenos Aires", "pais": "Argentina", "profesion": "Médico",
            "email": "pedro@email.com", "telefono": "555555555",
            "descripcion": "Especialista en cardiología", "intereses": ["lectura", "ajedrez"]
        }
        p4_data = {
            "nombre": "Ana", "apellido": "López", "edad": 31, "genero": "Femenino",
            "ciudad": "México DF", "pais": "México", "profesion": "Diseñadora",
            "email": "ana@email.com", "telefono": "444444444",
            "descripcion": "Creativa y detallista", "intereses": ["música", "fotografía"]
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

    print("Database seeded successfully!")

if __name__ == "__main__":
    seed()
