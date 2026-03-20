import sys
import os
from datetime import date

# Add the project root to sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.abspath(os.path.join(current_dir, "..", "..", ".."))
sys.path.append(backend_dir)

from app import create_app
from app.services.person_service import person_service

def seed():
    app = create_app()
    with app.app_context():
        # Persons with normalized graph data
        p1_data = {
            "nombre": "Leandro", "apellido": "Pérez", "fecha_nacimiento": "2000-05-10",
            "email": "leandro@email.com", "telefono": "+56912345678",
            "descripcion": "Desarrollador enfocado en backend",
            "signo_zodiacal": "Tauro", "eneagrama": "5w6", "genero": "Masculino",
            "ciudad_nacimiento": "Caracas", "pais_nacimiento": "Venezuela",
            "ciudad_residencia": "Santiago", "pais_residencia": "Chile",
            "profesion": "Full Stack Developer", "rol_actual": "Senior Backend",
            "modelo_trabajo": "remoto", "vision_largo_plazo": "Crear una software factory",
            "valores_fundamentales": ["Lealtad", "Innovación"],
            "motivadores": ["Autonomía", "Impacto social"],
            "hobbies": [{"nombre": "Programación", "active": True}, {"nombre": "Gimnasio", "active": True}],
            "historial_trabajos": [
                {"empresa": "TechCorp", "cargo": "Junior Dev", "desde": "2018-01-01", "hasta": "2020-12-31", "actual": False, "modalidad": "presencial"},
                {"empresa": "Cloud Labs", "cargo": "Senior Backend", "desde": "2021-01-01", "hasta": None, "actual": True, "modalidad": "remoto"}
            ],
            "idiomas": [{"nombre": "Español", "nivel": "nativo"}, {"nombre": "Inglés", "nivel": "B2"}]
        }

        p2_data = {
            "nombre": "Yorgeson", "apellido": "Lopez", "fecha_nacimiento": "2000-10-12",
            "email": "yorgeson@email.com", "telefono": "+56911111111",
            "descripcion": "Emprendedor tecnológico",
            "signo_zodiacal": "Libra", "eneagrama": "3w4", "genero": "Masculino",
            "ciudad_nacimiento": "Caracas", "pais_nacimiento": "Venezuela",
            "ciudad_residencia": "Santiago", "pais_residencia": "Chile",
            "profesion": "Full Stack Developer", "rol_actual": "CEO",
            "modelo_trabajo": "hibrido", "vision_largo_plazo": "Crear una empresa de software global",
            "valores_fundamentales": ["Excelencia", "Velocidad"],
            "motivadores": ["Crecimiento", "Libertad financiera"],
            "hobbies": [{"nombre": "Lectura", "active": True}],
            "historial_trabajos": [
                {"empresa": "StartUp Hub", "cargo": "Lead Dev", "desde": "2020-05-01", "hasta": "2023-10-01", "actual": False, "modalidad": "hibrido"}
            ]
        }

        person_service.create_person(p1_data)
        person_service.create_person(p2_data)

    print("Database seeded with normalized ADVANCED graph data successfully!")

if __name__ == "__main__":
    seed()
