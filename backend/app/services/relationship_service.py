from ..repositories.relationship_repository import RelationshipRepository

class RelationshipService:
    def __init__(self):
        self.repository = RelationshipRepository()

    def create_relationship(self, p1_id, p2_id, data):
        return self.repository.create(p1_id, p2_id, data)

    def get_all_relationships(self):
        return self.repository.get_all()

    def get_relationship_by_id(self, rel_id):
        return self.repository.get_by_id(rel_id)

    def update_relationship(self, rel_id, data):
        return self.repository.update(rel_id, data)

    def delete_relationship(self, rel_id):
        return self.repository.delete(rel_id)

relationship_service = RelationshipService()
