from flask import Flask, jsonify
from neo4j import GraphDatabase

app = Flask(__name__)
driver = GraphDatabase.driver("bolt:localhost:7687", auth=("neo4j", "password"))

@app.route('/personas', methods=['GET'])
def get_personas():
    session = driver.session()
    records, summary, keys = session.run("MATCH (p:Person) RETURN p")


    print(records)
    print(summary)
    print(keys)
    # personas = []
    # for record in result:
    #     node = record["p"]  # El nodo en sí
    #     print('aqui ',node)
    #     persona = node.properties  # Extraemos solo las propiedades del nodo
    #     personas.append(persona)
    
    # Cerrar la sesión
    session.close()
    
    # Retornar los resultados en formato JSON
    return jsonify(personas)

if __name__ == '__main__':
    app.run(debug=True)
