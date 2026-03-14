from datetime import datetime

from sqlalchemy.orm import Session
from geoalchemy2.elements import WKTElement

from reports.models.report import Report
from reports.models.report_image import ReportImage

from reports.repositories.report_repository import ReportRepository
from reports.repositories.report_image_repository import ReportImageRepository

from common.services.storage_service import StorageService


class ReportService:

    def __init__(self, db: Session):

        self.db = db
        self.report_repo = ReportRepository(db)
        self.image_repo = ReportImageRepository(db)

        self.storage_service = StorageService()

    def create_report(
        self,
        user_id,
        pet_type,
        pet_name,
        description,
        lat,
        lng,
        images=None,
        primary_image_index=0,
        last_seen_date=None,
        reward=None
    ):
        point = WKTElement(f"POINT({lng} {lat})", srid=4326)

        report = Report(
            user_id=user_id,
            pet_type=pet_type,
            pet_name=pet_name,
            description=description,
            location=point,
            last_seen_date=last_seen_date,
            reward=reward,
            status="open",
            created_at=datetime.utcnow()
        )

        self.report_repo.create(report)

        self.db.flush()

        if images:

            for i, image in enumerate(images):

                path, url, thumb_url = self.storage_service.upload_report_image(
                    report.id,
                    image
                )

                if primary_image_index >= len(images) and primary_image_index < 0:
                    primary_image_index = 0

                img = ReportImage(
                    report_id=report.id,
                    url=url,
                    thumbnail_url=thumb_url,
                    path=path,
                    is_primary=(i == primary_image_index)
                )

                self.image_repo.create(img)

        return report
    
    def get_feed(self, lat, lng, radius, limit, offset, pet_type=None):

        results = self.report_repo.get_feed(
            lat,
            lng,
            radius,
            limit,
            offset,
            pet_type
        )

        reports = []

        for r in results:
            reports.append({
                "id": r.id,
                "pet_type": r.pet_type,
                "pet_name": r.pet_name,
                "description": r.description,
                "distance": float(r.distance),
                "lat": float(r.lat),
                "lng": float(r.lng),
                "thumbnail": r.thumbnail_url
            })

        return reports
    
    def get_report(self, report_id):

        report = self.report_repo.get_with_images(report_id)

        if not report:
            raise ValueError("Report not found")

        lat = report.location.data["coordinates"][1]
        lng = report.location.data["coordinates"][0]

        return {
            "id": report.id,
            "pet_type": report.pet_type,
            "pet_name": report.pet_name,
            "description": report.description,
            "reward": report.reward,
            "status": report.status,
            "created_at": report.created_at,
            "updated_at": report.updated_at,
            "last_seen_date": report.last_seen_date,
            "location": {
                "lat": lat,
                "lng": lng
            },
            "images": [
                {
                    "url": img.url,
                    "thumbnail": img.thumbnail_url,
                    "is_primary": img.is_primary
                }
                for img in report.images
            ]
        }