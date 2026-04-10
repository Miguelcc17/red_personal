import os

def setup():
    if not os.path.exists('.env'):
        if os.path.exists('.env.example'):
            print("Copiando .env.example a .env...")
            with open('.env.example', 'r') as f:
                content = f.read()
            with open('.env', 'w') as f:
                f.write(content)
            print("Archivo .env creado exitosamente.")
        else:
            print("Error: .env.example no encontrado.")
    else:
        print("El archivo .env ya existe.")

if __name__ == "__main__":
    setup()
