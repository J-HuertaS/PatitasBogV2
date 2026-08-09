from auth.repositories.user_repository import UserRepository

class ReputationService:

    def __init__(self,db):

        self.db = db

        self.user_repo = UserRepository(db)


    def add_points(self, user_id, points):

        user = self.user_repo.get_by_id(user_id)

        if not user:
            raise ValueError("User not found")

        user.points += points

        self.user_repo.save(user)

        self.db.flush()

        return True