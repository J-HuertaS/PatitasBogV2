from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc, literal

from reports.models.report import Report
from reports.models.report_image import ReportImage


from geoalchemy2.elements import WKTElement
from geoalchemy2.functions import ST_DWithin, ST_Distance, ST_X, ST_Y
from geoalchemy2 import Geometry

class ReportRepository:

    def __init__(self, db: Session):

        self.db = db

    def create(self, report: Report):
        """Crea nuevo registro y asigna ID"""
        self.db.add(report)
        self.db.flush()
        return report

    def save(self, report: Report):
        """Guarda cambios en la sesión (sin flush)"""
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
        limit: int,
        offset: int,
        lat: float | None = None,
        lng: float | None = None,
        radius: int | None = None,
        pet_type: str | None = None
    ):
        distance = literal(0).label("distance")
        lat_col = literal(0).label("lat")
        lng_col = literal(0).label("lng")

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
            .filter(Report.status == "open")
        )

        if (radius):
            point = WKTElement(f"POINT({lng} {lat})",srid=4326)
            distance = ST_Distance(Report.location, point).label("distance")

            lat_col = ST_Y(Report.location.cast(Geometry)).label("lat")
            lng_col = ST_X(Report.location.cast(Geometry)).label("lng")

        
            query = (query.filter(
                ST_DWithin(
                    Report.location,
                    point,
                    radius
                )
            )
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
