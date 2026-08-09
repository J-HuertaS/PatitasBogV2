from flask import request, jsonify, g

from reports.services.report_service import ReportService

class ReportController:
    @staticmethod
    def create_report(db):

        service = ReportService(db)

        data = request.form
        pet_type = data.get("pet_type")
        pet_name = data.get("pet_name")
        description = data.get("description")
        reward = data.get("reward")
        last_seen_date = data.get("last_seen_date")
        images = request.files.getlist("images")

        try:
    
            lat = float(data.get("lat"))
            lng = float(data.get("lng"))

        except (TypeError,ValueError):

            return jsonify({"error": "Invalid lat/lng format"}), 400
    
            
        try:
    
            primary_image_index = int(data.get("primary_image_index", 0))

        except (TypeError,ValueError):
        
            return jsonify({"error": "Invalid index format"}), 400


        # antes de crear el reporte, verifica los campos obligatorios
        # Validar campos obligatorios
        required_fields = {
            "pet_type": pet_type,
            "pet_name": pet_name,
            "description": description,
            "lat": lat,
            "lng": lng
        }

        for field, value in required_fields.items():
            if value is None:
                return jsonify({"error": f"Missing required field: {field}"}), 400

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

            return jsonify({"error": "Invalid data format"}), 400
        
        except TypeError as e:

            return jsonify({"error": "Missing required field"}), 400

        return jsonify({
            "id": report.id,
            "message": "Report created successfully"
        }), 201

    @staticmethod
    def update_report(db, report_id):

        service = ReportService(db)

        data = request.json

        lat = data.get("lat")
        lng = data.get("lng")

        try:
            if lat is not None:  # Solo si envía lat
                lat = float(lat)
            if lng is not None:  # Solo si envía lng
                lng = float(lng)
        except (TypeError, ValueError):
            return jsonify({"error": "Invalid lat/lng format"}), 400

        # Validar pet_name SOLO si se envía
        if "pet_name" in data and not data.get("pet_name"):
            return jsonify({"error": "Pet name cannot be empty"}), 400

        # Si envía lat O lng, DEBE enviar AMBOS
        if (lat is not None or lng is not None) and not (lat and lng):
            return jsonify({"error": "Both lat and lng must be specified"}), 400

        try:

            service.update_report(
                report_id,
                g.user_id,
                pet_name=data.get("pet_name"),
                description=data.get("description"),
                reward=data.get("reward"),
                last_seen_date=data.get("last_seen_date"),
                lat=lat,
                lng=lng
            )

        except ValueError as e:
            return jsonify({"error":str(e)}),404
        except PermissionError as e:
            return jsonify({"error":str(e)}),403

        return jsonify({
            "message": "Report updated"
        }), 200

    @staticmethod
    def delete_report(db, report_id):

        service = ReportService(db)

        try:

            service.delete_report(report_id, g.user_id)

        except ValueError as e:
            return jsonify({"error":str(e)}),404
        except PermissionError as e:
            return jsonify({"error":str(e)}),403

        return jsonify({"message":"Report deleted"}), 200



    @staticmethod
    def get_report(db, report_id):

        service = ReportService(db)

        try:

            report = service.get_report(report_id)

        except ValueError as e:
            return jsonify({"error":str(e)}),404

        return jsonify(report), 200
    
    @staticmethod
    def get_feed(db):
        service = ReportService(db)

        try:
            lat = float(request.args.get("lat"))
            lng = float(request.args.get("lng"))
            radius = int(request.args.get("radius", 5000))
            limit = int(request.args.get("limit", 20))
            offset = int(request.args.get("offset", 0))
        except (TypeError, ValueError):
            return jsonify({"error": "Invalid parameters format"}), 400

        pet_type = request.args.get("pet_type")

        reports = service.get_feed(
            lat,
            lng,
            radius,
            limit,
            offset,
            pet_type
        )

        return jsonify(reports), 200
    
    
    
    @staticmethod
    def get_my_reports(db):

        service = ReportService(db)

        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))

        try:

            reports = service.get_user_reports(g.user_id, page, limit)

        except ValueError as e:
            return jsonify({"error":str(e)}),404
        
        return jsonify(reports),200
    
    

    

