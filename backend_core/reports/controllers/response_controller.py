from flask import request, jsonify, g

from reports.services.response_service import ResponseService

class ResponseController:

    @staticmethod
    def create_response(db, report_id):

        service = ResponseService(db)

        type = request.form.get("type")
        comment = request.form.get("comment")

        lat = request.form.get("lat")
        lng = request.form.get("lng")

        try:
            if lat:
                lat = float(lat)

            if lng:
                lng = float(lng)
        except (TypeError, ValueError):
            return jsonify({"error": "Invalid lat/lng format"}), 400

        images = request.files.getlist("images")

        # verificar campos no nulos
        if not type:
            return jsonify({"error":"Type must be specified"})

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

        except PermissionError as e:

            return jsonify({"error":str(e)}), 403

        return jsonify({
            "id": response.id,
            "status": response.status
        }), 201
    
    @staticmethod
    def get_responses(db, report_id):

        service = ResponseService(db)

        # Try 1: Validar entrada
        try:
            page = int(request.args.get("page", 1))
            limit = int(request.args.get("limit", 10))
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid page/limit format"}), 400

        try:

            responses = service.get_responses_by_report(report_id, page, limit)

        except ValueError as e:

            return jsonify({"error":str(e)}), 400
        
        return jsonify(responses), 200
    
    @staticmethod
    def confirm_response(db, response_id):

        service = ResponseService(db)

        try:
            service.confirm_response(
                response_id,
                g.user_id
            )

        except ValueError as e:
            return jsonify({
                "error": str(e)
            }), 400

        except PermissionError as e:
            return jsonify({
                "error": str(e)
            }), 403

        return jsonify({
            "message": "Response confirmed"
        }), 200
    
    @staticmethod
    def reject_response(db, response_id):

        service = ResponseService(db)

        try:

            service.reject_response(
                response_id,
                g.user_id
            )

        except ValueError as e:
                    return jsonify({
                        "error": str(e)
                    }), 400
        
        except PermissionError as e:
            return jsonify({
                "error": str(e)
            }), 403
        
        return jsonify({
            "message": "Response rejected"
        }), 200

    @staticmethod
    def delete_response(db, response_id):

        service = ResponseService(db)

        try:

            service.delete_response(
                response_id,
                g.user_id
            )
        
        except ValueError as e:
            return jsonify({
                "error": str(e)
            }), 400

        except PermissionError as e:
            return jsonify({
                "error": str(e)
            }), 403

        return jsonify({
            "message": "Response deleted"
        }), 200
    
    @staticmethod
    def update_response(db, response_id):

        service = ResponseService(db)

        data = request.json

        lat = data.get("lat")
        lng = data.get("lng")

        try:
            if lat:
                lat = float(lat)  # ← Convierte
            if lng:
                lng = float(lng)  # ← Convierte
        except (TypeError, ValueError):
            return jsonify({"error": "Invalid lat/lng format"}), 400

        try:
        
            service.update_response(
                response_id,
                g.user_id,
                comment=data.get("comment"),
                lat=data.get("lat"),
                lng=data.get("lng")
            )
        
        except ValueError as e:
            return jsonify({
                "error": str(e)
            }), 400

        except PermissionError as e:
            return jsonify({
                "error": str(e)
            }), 403

        return jsonify({
            "message": "Response updated"
        }), 200