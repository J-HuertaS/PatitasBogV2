from datetime import datetime

from reports.repositories.report_repository import ReportRepository
from reports.repositories.response_repository import ResponseRepository
from reports.repositories.comment_repository import CommentRepository


class ReportService:

    def __init__(self, db):

        self.db = db

        self.report_repo = ReportRepository(db)
        self.response_repo = ResponseRepository(db)
        self.comment_repo = CommentRepository(db)

    # -----------------------------
    # REPORTS
    # -----------------------------

    def create_report(self, report, image):



        return self.report_repo.create(report)

    def update_report(self, report_id, data):

        report = self.report_repo.get_by_id(report_id)

        if not report:
            raise ValueError("Reporte no encontrado")

        if report.status != "open":
            raise ValueError("No se puede editar un reporte cerrado")

        report.pet_name = data.get("pet_name", report.pet_name)
        report.description = data.get("description", report.description)
        report.reward = data.get("reward", report.reward)

        return self.report_repo.update(report)

    def close_report(self, report_id):

        report = self.report_repo.get_by_id(report_id)

        if not report:
            raise ValueError("Reporte no encontrado")

        if report.status == "closed":
            raise ValueError("El reporte ya está cerrado")

        report.status = "closed"
        report.closed_at = datetime.utcnow()

        return self.report_repo.update(report)
    
    def delete_report(self, report_id):

        report = self.report_repo.get_by_id(report_id)

        if not report:
            raise ValueError("Report not found")

        if report.status != "open":
            raise ValueError("Only open reports can be deleted")

        try:

            self.report_repo.delete(report)

        except Exception:
            self.db.rollback()
            raise

    # -----------------------------
    # COMMENTS
    # -----------------------------

    def add_comment(self, comment):

        report = self.report_repo.get_by_id(comment.report_id)

        if not report:
            raise ValueError("Reporte no encontrado")

        if report.status == "closed":
            raise ValueError("No se pueden agregar comentarios a un reporte cerrado")

        return self.comment_repo.create(comment)

    def update_comment(self, comment_id, content):

        comment = self.comment_repo.get_by_id(comment_id)

        if not comment:
            raise ValueError("Comentario no encontrado")

        report = self.report_repo.get_by_id(comment.report_id)

        if report.status != "open":
            raise ValueError("No se pueden editar comentarios en reportes cerrados")

        comment.content = content

        return self.comment_repo.update(comment)

    def delete_comment(self, comment_id):

        comment = self.comment_repo.get_by_id(comment_id)

        if not comment:
            raise ValueError("Comentario no encontrado")

        report = self.report_repo.get_by_id(comment.report_id)

        if report.status != "open":
            raise ValueError("No se pueden eliminar comentarios en reportes cerrados")

        self.comment_repo.delete(comment)

    # -----------------------------
    # RESPONSES
    # -----------------------------

    def add_response(self, response, images):

        report = self.report_repo.get_by_id(response.report_id)

        if not report:
            raise ValueError("Reporte no encontrado")

        if report.status == "closed":
            raise ValueError("El reporte ya está cerrado")

        if response.type == "found" and len(images) == 0:
            raise ValueError("Un hallazgo debe incluir al menos una imagen")

        return self.response_repo.create(response)

    def update_response(self, response_id, data):

        response = self.response_repo.get_by_id(response_id)

        if not response:
            raise ValueError("Respuesta no encontrada")

        if response.status != "pending":
            raise ValueError("No se puede editar esta respuesta")

        response.comment = data.get("comment", response.comment)

        return self.response_repo.update(response)

    def delete_response(self, response_id):

        response = self.response_repo.get_by_id(response_id)

        if not response:
            raise ValueError("Respuesta no encontrada")

        if response.status != "pending":
            raise ValueError("No se puede eliminar esta respuesta")

        self.response_repo.delete(response)

    # -----------------------------
    # CONFIRMAR HALLAZGO
    # -----------------------------

    def confirm_found(self, response_id, finder_user):

        response = self.response_repo.get_by_id(response_id)

        if not response:
            raise ValueError("Respuesta no encontrada")

        report = self.report_repo.get_by_id(response.report_id)

        if report.status == "closed":
            raise ValueError("El reporte ya está cerrado")

        try:

            response.status = "confirmed"

            report.status = "closed"
            report.closed_at = datetime.utcnow()

            finder_user.points += 10

            self.db.commit()

        except Exception:

            self.db.rollback()
            raise

    # -----------------------------
    # RECHAZAR HALLAZGO
    # -----------------------------

    def reject_found(self, response_id, finder_user):

        response = self.response_repo.get_by_id(response_id)

        if not response:
            raise ValueError("Respuesta no encontrada")

        try:

            response.status = "rejected"

            finder_user.points -= 10

            self.db.commit()

        except Exception:

            self.db.rollback()
            raise