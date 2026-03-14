from sqlalchemy.orm import Session

from reports.models.report_image import ReportImage

class ReportImageRepository:

    def __init__(self, db: Session):
        
        self.db = db


    def create(self, image: ReportImage):
        
        self.db.add(image)

    def get_by_report(self, report_id: int):

        return (
            self.db.query(ReportImage)
            .filter(ReportImage.report_id == report_id)
            .all()
        )
    
    def delete(self, image: ReportImage):

        self.db.delete(image)



    

