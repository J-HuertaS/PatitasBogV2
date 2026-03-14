from flask import Blueprint

from reports.controllers.response_controller import ResponseController
from common.security.auth_decorator import auth_required

response_routes = Blueprint("responses", __name__)


@response_routes.route("/reports/<int:report_id>/responses", methods=["POST"])
@auth_required
def create_response(report_id):
    return ResponseController.create_response(report_id)


@response_routes.route("/reports/<int:report_id>/responses", methods=["GET"])
def get_responses(report_id):
    return ResponseController.get_responses(report_id)


@response_routes.route("/responses/<int:response_id>/confirm", methods=["POST"])
@auth_required
def confirm_response(response_id):
    return ResponseController.confirm_response(response_id)


@response_routes.route("/responses/<int:response_id>/reject", methods=["POST"])
@auth_required
def reject_response(response_id):
    return ResponseController.reject_response(response_id)


@response_routes.route("/responses/<int:response_id>/mistaken", methods=["POST"])
@auth_required
def mistaken_response(response_id):
    return ResponseController.mistaken_response(response_id)