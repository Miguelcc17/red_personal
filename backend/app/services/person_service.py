from ..repositories.person_repository import PersonRepository

class PersonService:
    def __init__(self):
        self.repository = PersonRepository()

    def create_person(self, data):
        return self.repository.create(data)

    def get_all_persons(self):
        return self.repository.get_all()

    def get_person_by_id(self, person_id):
        return self.repository.get_by_id(person_id)

    def update_person(self, person_id, data):
        return self.repository.update(person_id, data)

    def delete_person(self, person_id):
        return self.repository.delete(person_id)

person_service = PersonService()
