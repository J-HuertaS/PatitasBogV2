from flask import Blueprint

from reports.controllers.response_controller import ResponseController
from config.db_decorator import with_db
from common.security.protected_route import protected_route


response_routes = Blueprint("responses", __name__)


@response_routes.route("/reports/<int:report_id>/responses", methods=["POST"])
@protected_route
def create_response(db, report_id):
    return ResponseController.create_response(db, report_id)


@response_routes.route("/reports/<int:report_id>/responses", methods=["GET"])
@with_db
def get_responses(db, report_id):
    return ResponseController.get_responses(db, report_id)


@response_routes.route("/responses/<int:response_id>/confirm", methods=["POST"])
@protected_route
def confirm_response(db, response_id):
    return ResponseController.confirm_response(db, response_id)


@response_routes.route("/responses/<int:response_id>/reject", methods=["POST"])
@protected_route
def reject_response(db, response_id):
    return ResponseController.reject_response(db, response_id)

@response_routes.route("/responses/<int:response_id>", methods=["DELETE"])
@protected_route
def delete_response(db, response_id):
    return ResponseController.delete_response(db, response_id)

@response_routes.route("/responses/<int:response_id>", methods=["PATCH"])
@protected_route
def update_response(db, response_id):
    return ResponseController.update_response(db, response_id)