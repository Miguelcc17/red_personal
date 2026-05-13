import requests
import json
import time

person_data = {
    "nombre": "Cartesian",
    "apellido": "Explosion",
    "email": "cartesian@test.com",
    "telefono": "123",
    "hobbies": [
        {"nombre": f"Hobby {i}"} for i in range(10)
    ],
    "idiomas": [
        {"nombre": f"Idioma {i}"} for i in range(5)
    ],
    "historial_trabajos": [
        {"empresa": f"Company {i}", "cargo": "Tester", "desde": "2020-01-01"} for i in range(5)
    ],
    "educacion": [
        {"institucion": f"University {i}", "titulo": "Degree"} for i in range(3)
    ]
}

# we need to spin up backend
