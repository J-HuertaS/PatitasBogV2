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


    def upload_profile_picture(self, file, user_id):

        # validar tamaño (2MB)
        max_size = 2 * 1024 * 1024

        file_bytes = file.read()

        if len(file_bytes) > max_size:
            raise ValueError("File size exceeds 2MB limit")
        
        # validar formato
        image = Image.open(io.BytesIO(file_bytes))

        
        if image.format not in ["JPEG", "PNG", "WEBP"]:
            raise ValueError("Invalid image format")
        
        # redimensionar
        image.thumbnail((512, 512))

        # convertir a JPEG
        buffer = io.BytesIO()
        image.save(buffer, format="JPEG", quality=85)

        buffer.seek(0)

        filename = f"{user_id}/avatar.jpg"

        # borrar foto anterior si existe
        self.supabase.storage.from_(self.bucket).remove([filename])


        self.supabase.storage.from_(self.bucket).upload(
            filename,
            buffer.read(),
            {"content-type": "image/jpeg"}
        )

        public_url = self.supabase.storage.from_(self.bucket).get_public_url(filename)

        return public_url