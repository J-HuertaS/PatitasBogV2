from flask import Blueprint
from reports.controllers.report_controller import ReportController
from common.security.auth_decorator import auth_required

report_routes = Blueprint("reports", __name__)

@report_routes.route("/reports", methods=["POST"])
@auth_required
def create_report():
    return ReportController.create_report()

@report_routes.route("/reports", methods=["GET"])
def get_feed():
    return ReportController.get_feed()

@report_routes.route("/reports/<int:report_id>", methods=["GET"])
def get_report(report_id):
    return ReportController.get_report(report_id)

@report_routes.route("/reports/<int:report_id>", methods=["DELETE"])
@auth_required
def delete_report(report_id):
    return ReportController.delete_report(report_id)

