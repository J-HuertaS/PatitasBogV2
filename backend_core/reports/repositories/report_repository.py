from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc

from reports.models.report import Report
from reports.models.report_image import ReportImage


from geoalchemy2.elements import WKTElement
from geoalchemy2.functions import ST_DWithin, ST_Distance, ST_X, ST_Y
from geoalchemy2 import Geometry

class ReportRepository:

    def __init__(self, db: Session):

        self.db = db

    def create(self, report: Report):

        self.db.add(report)
        return report
    
    def get_by_id(self,report_id: int):

        return(
            self.db.query(Report)
            .filter(Report.id == report_id)
            .first()
        )
    
    # -------------------------
    # GET BY USER
    # -------------------------

    def get_by_user(self, user_id: int, page: int = 1, limit: int = 10):

        offset = (page - 1) * limit

        return (
            self.db.query(Report)
            .filter(Report.user_id == user_id)
            .order_by(desc(Report.created_at))
            .offset(offset)
            .limit(limit)
            .all()
        )
    
    def delete(self, report: Report):
        
        self.db.delete(report)

    def get_feed(
        self,
        lat: float,
        lng: float,
        radius: int,
        limit: int,
        offset: int,
        pet_type: str | None = None
    ):
        point = WKTElement(f"POINT({lng} {lat})",srid=4326)
        distance = ST_Distance(Report.location, point).label("distance")

        lat_col = ST_Y(Report.location.cast(Geometry)).label("lat")
        lng_col = ST_X(Report.location.cast(Geometry)).label("lng")

        query = (
            self.db.query(
                Report.id,
                Report.pet_type,
                Report.pet_name,
                Report.description,
                Report.created_at,
                distance,
                lat_col,
                lng_col,
                ReportImage.thumbnail_url
            )
            .join(
                ReportImage,
                ReportImage.report_id == Report.id
            )
            .filter(
                ReportImage.is_primary == True
            )
            .filter(
                ST_DWithin(
                    Report.location,
                    point,
                    radius
                )
            )
            .filter(Report.status == "open")
        )

        if pet_type:
            query = query.filter(Report.pet_type == pet_type)

        # Order by distance (ascendant)
        query = (
            query
            .order_by(distance, desc(Report.created_at))
            .limit(limit)
            .offset(offset)
        )

        return query.all()
    
    def get_with_images(self, report_id: int):

        return (
            self.db.query(Report)
            .options(joinedload(Report.images))
            .filter(Report.id == report_id)
            .first()
        )
