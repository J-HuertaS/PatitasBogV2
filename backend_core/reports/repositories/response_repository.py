from sqlalchemy.orm import Session
from sqlalchemy import desc

from reports.models.response import Response


class ResponseRepository:

    def __init__(self, db: Session):
        self.db = db


    # -------------------------
    # CREATE
    # -------------------------

    def create(self, response: Response):

        self.db.add(response)

        return response


    # -------------------------
    # GET BY ID
    # -------------------------

    def get_by_id(self, response_id: int):

        return (
            self.db.query(Response)
            .filter(Response.id == response_id)
            .first()
        )


    # -------------------------
    # GET BY REPORT
    # -------------------------

    def get_by_report(self, report_id: int):

        return (
            self.db.query(Response)
            .filter(Response.report_id == report_id)
            .order_by(desc(Response.created_at))
            .all()
        )


    # -------------------------
    # DELETE
    # -------------------------

    def delete(self, response: Response):

        self.db.delete(response)