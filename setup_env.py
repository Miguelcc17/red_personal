import os

def setup():
    if not os.path.exists('.env.example'):
        print("Error: .env.example no encontrado.")
        return

    print("Copiando .env.example a .env...")
    with open('.env.example', 'r') as f:
        content = f.read()

    with open('.env', 'w') as f:
        f.write(content)

    # Ensure it exists in backend for local testing
    if not os.path.exists('backend'):
        os.makedirs('backend')
    with open('backend/.env', 'w') as f:
        f.write(content)

    print("Archivos .env creados exitosamente en raíz y backend/.")

if __name__ == "__main__":
    setup()
