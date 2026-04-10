import requests
import sys
import time

BASE_URL = "http://localhost:5000/api"

def test_health():
    print("Testing /health...")
    try:
        res = requests.get(f"{BASE_URL}/health")
        assert res.status_code == 200
        print("✅ Health OK")
    except Exception as e:
        print(f"❌ Health Failed: {e}")

def test_crud_flow():
    print("Testing CRUD flow...")
    try:
        # 1. Create Person
        person_data = {
            "nombre": "Test", "apellido": "Automation", "edad": 25, "email": "test@auto.com",
            "telefono": "12345", "profesion": "Robot", "ciudad_nacimiento": "Lab", "pais_nacimiento": "Virtual"
        }
        res = requests.post(f"{BASE_URL}/persons", json=person_data)
        assert res.status_code == 201
        person_id = res.json()['data']['id']
        print(f"✅ Person created: {person_id}")

        # 2. Get Graph
        res = requests.get(f"{BASE_URL}/graph")
        assert res.status_code == 200
        print("✅ Graph retrieved")

        # 3. Cleanup
        requests.delete(f"{BASE_URL}/persons/{person_id}")
        print("✅ Person deleted")

    except Exception as e:
        print(f"❌ CRUD Flow Failed: {e}")

if __name__ == "__main__":
    # Wait for server if needed
    print("Waiting for backend...")
    time.sleep(2)
    test_health()
    test_crud_flow()
