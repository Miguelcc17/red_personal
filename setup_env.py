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

    # Also ensure it exists in backend for local testing
    if os.path.exists('.env') and not os.path.exists('backend/.env'):
        with open('.env', 'r') as f:
            content = f.read()
        with open('backend/.env', 'w') as f:
            f.write(content)

if __name__ == "__main__":
    setup()
