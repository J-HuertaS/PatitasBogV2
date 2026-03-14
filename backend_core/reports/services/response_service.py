from datetime import datetime
from geoalchemy2.elements import WKTElement

from reports.models.response import Response
from reports.models.response_image import ResponseImage

from reports.repositories.response_repository import ResponseRepository
from reports.repositories.response_image_repository import ResponseImageRepository
from reports.repositories.report_repository import ReportRepository

from common.services.storage_service import StorageService


class ResponseService:

    def __init__(self, db):

        self.db = db

        self.response_repo = ResponseRepository(db)
        self.image_repo = ResponseImageRepository(db)
        self.report_repo = ReportRepository(db)

        self.storage = StorageService()


    def create_response(
        self,
        report_id,
        user_id,
        type,
        comment,
        lat,
        lng,
        images=None
    ):

        if type not in ["sighting", "found"]:
            raise ValueError("Invalid response type")

        # -------------------------
        # VALIDATIONS
        # -------------------------

        if type == "sighting" and (lat is None or lng is None):
            raise ValueError("Location required for sightings")

        if type == "found" and (not images or len(images) == 0):
            raise ValueError("Photo required for found responses")

        # -------------------------
        # LOCATION
        # -------------------------

        point = None

        if lat and lng:
            point = WKTElement(f"POINT({lng} {lat})", srid=4326)

        # -------------------------
        # CREATE RESPONSE
        # -------------------------

        response = Response(
            report_id=report_id,
            user_id=user_id,
            type=type,
            comment=comment,
            location=point,
            status="pending",
            created_at=datetime.utcnow()
        )

        self.response_repo.create(response)

        # flush para obtener id
        self.db.flush()

        # -------------------------
        # UPLOAD IMAGES
        # -------------------------

        if images:

            for image in images:

                path, url, thumb = self.storage.upload_response_image(
                    response.id,
                    image
                )

                img = ResponseImage(
                    response_id=response.id,
                    url=url,
                    thumbnail_url=thumb,
                    path=path
                )

                self.image_repo.create(img)

        return response

    def get_responses_by_report(self, report_id):

        responses = self.response_repo.get_by_report(report_id)

        result = []

        for r in responses:

            images = self.image_repo.get_by_response(r.id)

            result.append({
                "id": r.id,
                "type": r.type,
                "comment": r.comment,
                "status": r.status,
                "created_at": r.created_at,
                "images": [
                    {
                        "url": img.url,
                        "thumbnail": img.thumbnail_url
                    }
                    for img in images
                ]
            })

        return result
    
    def confirm_response(self, response_id, user_id):

        response = self.response_repo.get_by_id(response_id)

        if not response:
            raise ValueError("Response not found")

        report = self.report_repo.get_by_id(response.report_id)

        if report.user_id != user_id:
            raise PermissionError("Only the report owner can confirm responses")

        response.status = "confirmed"

        report.status = "closed"
        report.closed_at = datetime.utcnow()

        return response
    
    def reject_response(self, response_id, user_id):

        response = self.response_repo.get_by_id(response_id)

        if not response:
            raise ValueError("Response not found")

        report = self.report_repo.get_by_id(response.report_id)

        if report.user_id != user_id:
            raise PermissionError("Only the report owner can reject responses")

        response.status = "rejected"

        return response
    
    def mistaken_response(self, response_id, user_id):

        response = self.response_repo.get_by_id(response_id)

        if not response:
            raise ValueError("Response not found")

        report = self.report_repo.get_by_id(response.report_id)

        if report.user_id != user_id:
            raise PermissionError("Only the report owner can modify responses")

        response.status = "mistaken"

        return response