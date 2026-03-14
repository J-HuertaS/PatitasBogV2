from supabase import create_client
from flask import current_app
import uuid
import io
from PIL import Image


class StorageService:

    def __init__(self):

        url = current_app.config["SUPABASE_URL"]
        key = current_app.config["SUPABASE_SERVICE_ROLE_KEY"]

        self.supabase = create_client(url, key)
        self.bucket = current_app.config["SUPABASE_BUCKET"]


    # -------------------------------------------------
    # INTERNAL IMAGE PROCESSOR
    # -------------------------------------------------

    def _process_image(
            self, 
            file, 
            max_size_mb=5,
            max_dimension=1200,
            square=False
            ):

        max_size = max_size_mb * 1024 * 1024

        file_bytes = file.read()

        if len(file_bytes) > max_size:
            raise ValueError("File size exceeds limit")

        image = Image.open(io.BytesIO(file_bytes))

        if image.format not in ["JPEG", "PNG", "WEBP"]:
            raise ValueError("Invalid image format")
        
        if square:

            size = min(image.size)
            left = (image.width - size) // 2
            top = (image.height - size) // 2
            right = left + size
            bottom = top + size

            image = image.crop((left, top, right, bottom))

        image.thumbnail((max_dimension, max_dimension))

        buffer = io.BytesIO()

        image.convert("RGB").save(
            buffer,
            format="JPEG",
            quality=85
        )

        buffer.seek(0)

        return buffer
    

    def _create_thumbnail(self, file_bytes):

        image = Image.open(io.BytesIO(file_bytes))

        image.thumbnail((300, 300))

        buffer = io.BytesIO()

        image.convert("RGB").save(
            buffer,
            format="JPEG",
            quality=80
        )

        buffer.seek(0)

        return buffer


    # -------------------------------------------------
    # PROFILE PICTURE (AUTH)
    # -------------------------------------------------

    def upload_profile_picture(self, file, user_id):

        buffer = self._process_image(
            file,
            max_size_mb=2,
            max_dimension=256,
            square=True
        )


        filename = f"users/{user_id}/avatar.jpg"

        self.supabase.storage.from_(self.bucket).remove([filename])

        self.supabase.storage.from_(self.bucket).upload(
            filename,
            buffer.read(),
            {"content-type": "image/jpeg"}
        )

        public_url = self.supabase.storage.from_(self.bucket).get_public_url(filename)

        return public_url


    # -------------------------------------------------
    # REPORT IMAGES
    # -------------------------------------------------

    def upload_report_image(self, report_id, file):

        buffer = self._process_image(
            file,
            max_size_mb=5,
            max_dimension=1200,
            square=False
        )

        file.seek(0)

        # thumbnail
        thumb_buffer = self._process_image(
            file,
            max_size_mb=5,
            max_dimension=300
        )

        image_id = str(uuid.uuid4())

        path = f"reports/{report_id}/{image_id}.jpg"
        thumb_path = f"reports/{report_id}/{image_id}_thumb.jpg"


        # upload imagen grande
        self.supabase.storage.from_(self.bucket).upload(
            path,
            buffer.read(),
            {"content-type": "image/jpeg"}
        )

        # upload thumbnail
        self.supabase.storage.from_(self.bucket).upload(
            thumb_path,
            thumb_buffer.read(),
            {"content-type": "image/jpeg"}
        )

        public_url = self.supabase.storage.from_(self.bucket).get_public_url(path)
        thumb_url = self.supabase.storage.from_(self.bucket).get_public_url(thumb_path)

        return path, public_url, thumb_url


    # -------------------------------------------------
    # RESPONSE IMAGES
    # -------------------------------------------------

    def upload_response_image(self, response_id, file):

        buffer = self._process_image(
            file,
            max_size_mb=5,
            max_dimension=1200,
            square=False
        )

        file.seek(0)

        # thumbnail
        thumb_buffer = self._process_image(
            file,
            max_size_mb=5,
            max_dimension=300
        )

        image_id = str(uuid.uuid4())

        path = f"responses/{response_id}/{image_id}.jpg"
        thumb_path = f"reports/{response_id}/{image_id}_thumb.jpg"

        # upload imagen grande
        self.supabase.storage.from_(self.bucket).upload(
            path,
            buffer.read(),
            {"content-type": "image/jpeg"}
        )

        # upload thumbnail
        self.supabase.storage.from_(self.bucket).upload(
            thumb_path,
            thumb_buffer.read(),
            {"content-type": "image/jpeg"}
        )

        public_url = self.supabase.storage.from_(self.bucket).get_public_url(path)
        thumb_url = self.supabase.storage.from_(self.bucket).get_public_url(thumb_path)

        return path, public_url, thumb_url


    # -------------------------------------------------
    # DELETE FILE
    # -------------------------------------------------

    def delete_file(self, path):

        self.supabase.storage.from_(self.bucket).remove([path])