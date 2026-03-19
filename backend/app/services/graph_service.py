from ..repositories.graph_repository import GraphRepository

class GraphService:
    def __init__(self):
        self.repository = GraphRepository()

    def get_full_graph(self):
        return self.repository.get_full_graph()

    def get_graph_by_person(self, person_id):
        return self.repository.get_graph_by_person(person_id)

graph_service = GraphService()
