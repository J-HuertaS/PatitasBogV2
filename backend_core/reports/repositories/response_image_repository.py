from sqlalchemy.orm import Session
from reports.models.response_image import ResponseImage


class ResponseImageRepository:

    def __init__(self, db: Session):

        self.db = db


    def create(self, image: ResponseImage):

        self.db.add(image)


    def get_by_response(self, response_id: int):

        return (
            self.db.query(ResponseImage)
            .filter(ResponseImage.response_id == response_id)
            .all()
        )


    def delete(self, image: ResponseImage):

        self.db.delete(image)