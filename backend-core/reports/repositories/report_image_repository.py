from reports.models.report_image import ReportImage

class ReportImageRepository:

    def __init__(self, db):
        self.db = db

    def create(self, image):

        self.db.add(image)
        self.db.commit()
        self.db.refresh(image)

        return image

    def delete(self, image):

        self.db.delete(image)
        self.db.commit()

    def get_by_id(self, image_id):

        return self.db.query(ReportImage).filter(
            ReportImage.id == image_id
        ).first()