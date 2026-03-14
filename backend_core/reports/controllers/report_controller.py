from flask import request, jsonify, g

from reports.services.report_service import ReportService
from config.db_decorator import with_db

class ReportController:
    @staticmethod
    @with_db
    def create_report(db):
        data = request.form

        pet_type = data.get("pet_type")
        pet_name = data.get("pet_name")
        description = data.get("description")

        lat = float(data.get("lat"))
        lng = float(data.get("lng"))

        reward = data.get("reward")
        last_seen_date = data.get("last_seen_date")

        primary_image_index = int(data.get("primary_image_index", 0))

        images = request.files.getlist("images")

        service = ReportService(db)

        try:

            report = service.create_report(
                user_id=g.user_id,
                pet_type=pet_type,
                pet_name=pet_name,
                description=description,
                lat=lat,
                lng=lng,
                images=images,
                primary_image_index=primary_image_index,
                last_seen_date=last_seen_date,
                reward=reward
            )

        except ValueError as e:
        
            return jsonify({"error":str(e)}), 400

        return jsonify({
            "id": report.id,
            "message": "Report created successfully"
        }), 201
    
    @staticmethod
    @with_db
    def get_feed(db):
        service = ReportService(db)

        lat = float(request.args.get("lat"))
        lng = float(request.args.get("lng"))

        radius = int(request.args.get("radius", 5000))
        limit = int(request.args.get("limit", 20))
        offset = int(request.args.get("offset", 0))

        pet_type = request.args.get("pet_type")

        reports = service.get_feed(
            lat,
            lng,
            radius,
            limit,
            offset,
            pet_type
        )

        return jsonify(reports)
    
    @staticmethod
    @with_db
    def get_report(db, report_id):

        service = ReportService(db)

        report = service.get_report(report_id)

        return jsonify(report)