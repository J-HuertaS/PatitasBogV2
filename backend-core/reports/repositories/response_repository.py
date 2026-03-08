from reports.models.response import Response


class ResponseRepository:

    def __init__(self, db):
        self.db = db

    def create(self, response):
        self.db.add(response)
        self.db.commit()
        self.db.refresh(response)
        return response

    def get_by_report(self, report_id):
        return (
            self.db.query(Response)
            .filter(Response.report_id == report_id)
            .all()
        )
    
    def update(self, response):
        self.db.commit()
        self.db.refresh(response)
        return response
    
    def delete(self, response):
        self.db.delete(response)
        self.db.commit()