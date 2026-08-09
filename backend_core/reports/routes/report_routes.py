from flask import Blueprint
from reports.controllers.report_controller import ReportController
from config.db_decorator import with_db
from common.security.protected_route import protected_route

report_routes = Blueprint("reports", __name__)

@report_routes.route("/reports", methods=["POST"])
@protected_route
def create_report(db):
    return ReportController.create_report(db)

@report_routes.route("/reports", methods=["GET"])
@with_db
def get_feed(db):
    return ReportController.get_feed(db)

@report_routes.route("/reports/<int:report_id>", methods=["GET"])
@with_db
def get_report(db, report_id):
    return ReportController.get_report(db, report_id)

@report_routes.route("/reports/<int:report_id>", methods=["DELETE"])
@protected_route
def delete_report(db, report_id):
    return ReportController.delete_report(db, report_id)

@report_routes.route("/users/me/reports", methods=["GET"])
@protected_route
def get_my_reports(db):
    return ReportController.get_my_reports(db)

@report_routes.route("/reports/<int:report_id>", methods=["PATCH"])
@protected_route
def update_report(db, report_id):
    return ReportController.update_report(db, report_id)

