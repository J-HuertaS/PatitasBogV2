from datetime import datetime
from geoalchemy2.elements import WKTElement

from reports.models.response import Response
from reports.models.response_image import ResponseImage

from reports.repositories.response_repository import ResponseRepository
from reports.repositories.response_image_repository import ResponseImageRepository
from reports.repositories.report_repository import ReportRepository

from common.services.storage_service import StorageService


from backend_core.common.services.reputation_service import ReputationService


class ResponseService:

    def __init__(self, db):

        self.db = db

        self.response_repo = ResponseRepository(db)
        self.image_repo = ResponseImageRepository(db)
        self.report_repo = ReportRepository(db)

        self.storage = StorageService()

        self.reputation_service = ReputationService(db)


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

        if type not in ["sighting", "finding"]:
            raise ValueError("Invalid response type")

        # -------------------------
        # VALIDATIONS
        # -------------------------

        report = self.report_repo.get_by_id(report_id)

        if user_id == report.user_id:
            raise PermissionError("The owner report can't create responses")

        if not report:
            raise ValueError("Report not found")

        if report.status == "closed":
            raise ValueError("Report already closed. You cannot add more responses.")

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

    def get_responses_by_report(self, report_id, page=1, limit=10):

        report = self.report_repo.get_by_id(report_id)

        if not report:
            raise ValueError("Report not found")

        responses = self.response_repo.get_by_report(report_id, page, limit)

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
        # por ahora, marca como confirmado un hallazgo

        response = self.response_repo.get_by_id(response_id)

        if not response:
            raise ValueError("Response not found")

        if response.status == "confirmed":
            raise ValueError("Response already confirmed")

        report = self.report_repo.get_by_id(response.report_id)

        if not report:
            raise ValueError("Report not found")

        if report.user_id != user_id:
            raise PermissionError("Only the report owner can confirm responses")
        
        if report.status == "closed":
            raise ValueError("Report already closed")

        response.status = "confirmed"

        if response.type == "finding":
            report.status = "closed"
            report.closed_at = datetime.utcnow()
            # suma +20 puntos
            self.reputation_service.add_points(response.user_id, 20)

        if response.type == "sighting":
            # suma +5 puntos
            self.reputation_service.add_points(response.user_id, 5)


        return response
    
    def reject_response(self, response_id, user_id):
        # por ahora, marca como rejected un hallazgo o un avistamiento

        response = self.response_repo.get_by_id(response_id)
        
        if not response:
            raise ValueError("Response not found")

        if response.status == "rejected":
            raise ValueError("Response already rejected")

        report = self.report_repo.get_by_id(response.report_id)

        if not report:
            raise ValueError("Report not found")

        if report.user_id != user_id:
            raise PermissionError("Only the report owner can reject responses")
        
        if report.status == "closed":
            raise ValueError("Report already closed")

        response.status = "rejected"

        if response.type == "finding":
            # resta -20 puntos
            self.reputation_service.add_points(response.user_id, -20)

        # en el caso de sighting no pasa nada ya que pudo haber sido una confusion.

        return response
    
    def delete_response(self, response_id, user_id):

        response = self.response_repo.get_by_id(response_id)

        if not response:
            raise ValueError("Response not found")
        
        if response.user_id != user_id:
            raise PermissionError("You can only delete your own responses")

        images = self.image_repo.get_by_response(response_id)

        for image in images:
            self.storage.delete_file(image.path)
            self.image_repo.delete(image)

        self.response_repo.delete(response)

        return True
    
    def update_response(self, response_id, user_id, comment=None, lat=None, lng=None):

        response = self.response_repo.get_by_id(response_id)

        if not response:
            raise ValueError("Response not found")

        if response.user_id != user_id:
            raise PermissionError("You can only edit your own responses")

        report = self.report_repo.get_by_id(response.report_id)

        if not report:
            raise ValueError("Report not found")

        if report.status != "open":
            raise ValueError("Cannot edit responses of closed reports")

        if response.status != "pending":
            raise ValueError("Only pending responses can be edited")

        if comment:
            response.comment = comment

        if lat and lng:
            response.location = WKTElement(f"POINT({lng} {lat})", srid=4326)

        return response