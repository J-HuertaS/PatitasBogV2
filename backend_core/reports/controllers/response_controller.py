from flask import request, jsonify, g

from config.db_decorator import with_db

from reports.services.response_service import ResponseService

class ResponseController:

    @staticmethod
    @with_db
    def create_response(db, report_id):

        service = ResponseService(db)

        type = request.form.get("type")
        comment = request.form.get("comment")

        lat = request.form.get("lat")
        lng = request.form.get("lng")

        if lat:
            lat = float(lat)

        if lng:
            lng = float(lng)

        images = request.files.getlist("images")

        try:

            response = service.create_response(
                report_id=report_id,
                user_id=g.user_id,
                type=type,
                comment=comment,
                lat=lat,
                lng=lng,
                images=images
            )

        except ValueError as e:
        
            return jsonify({"error":str(e)}), 400

        return jsonify({
            "id": response.id,
            "status": response.status
        }), 201
    
    @staticmethod
    @with_db
    def get_responses(db, report_id):

        service = ResponseService(db)

        responses = service.get_responses_by_report(report_id)

        return jsonify(responses)
    
    @staticmethod
    @with_db
    def confirm_response(db, response_id):

        service = ResponseService(db)

        service.confirm_response(
            response_id,
            g.user_id
        )

        return jsonify({
            "message": "Response confirmed"
        })
    
    @staticmethod
    @with_db
    def reject_response(db, response_id):

        service = ResponseService(db)

        service.reject_response(
            response_id,
            g.user_id
        )

        return jsonify({
            "message": "Response rejected"
        })
    
    @staticmethod
    @with_db
    def mistaken_response(db, response_id):

        service = ResponseService(db)

        service.mistaken_response(
            response_id,
            g.user_id
        )

        return jsonify({
            "message": "Response marked as mistaken"
        })