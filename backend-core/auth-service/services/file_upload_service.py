"""
Servicio para manejo de subida de archivos
"""
import os
import uuid
from werkzeug.utils import secure_filename
from PIL import Image
import logging

class FileUploadService:
    """Servicio para manejo de subida de archivos de perfil"""
    
    # Configuración
    UPLOAD_FOLDER = 'uploads/profile_pictures'
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    MAX_IMAGE_SIZE = (800, 800)  # Redimensionar imágenes grandes
    
    @classmethod
    def init_upload_folder(cls):
        """Crear carpeta de uploads si no existe"""
        try:
            os.makedirs(cls.UPLOAD_FOLDER, exist_ok=True)
            return True
        except Exception as e:
            logging.error(f"Error creando carpeta de uploads: {e}")
            return False
    
    @classmethod
    def allowed_file(cls, filename):
        """Verificar si el archivo tiene una extensión permitida"""
        return '.' in filename and \
               filename.rsplit('.', 1)[1].lower() in cls.ALLOWED_EXTENSIONS
    
    @classmethod
    def validate_file(cls, file):
        """
        Validar archivo subido
        
        Returns:
            tuple: (is_valid, error_message)
        """
        if not file:
            return False, "No se seleccionó ningún archivo"
        
        if file.filename == '':
            return False, "No se seleccionó ningún archivo"
        
        if not cls.allowed_file(file.filename):
            return False, f"Tipo de archivo no permitido. Use: {', '.join(cls.ALLOWED_EXTENSIONS)}"
        
        # Verificar tamaño del archivo (aproximado)
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)  # Regresar al inicio
        
        if file_size > cls.MAX_FILE_SIZE:
            return False, f"Archivo muy grande. Máximo: {cls.MAX_FILE_SIZE // (1024*1024)}MB"
        
        return True, None
    
    @classmethod
    def process_and_save_image(cls, file, user_id):
        """
        Procesar y guardar imagen de perfil
        
        Args:
            file: Archivo subido
            user_id: ID del usuario
            
        Returns:
            tuple: (success, filename_or_error_message)
        """
        try:
            # Validar archivo
            is_valid, error_msg = cls.validate_file(file)
            if not is_valid:
                return False, error_msg
            
            # Crear carpeta si no existe
            if not cls.init_upload_folder():
                return False, "Error inicializando carpeta de uploads"
            
            # Generar nombre único para el archivo
            file_extension = file.filename.rsplit('.', 1)[1].lower()
            unique_filename = f"{user_id}_{uuid.uuid4().hex[:8]}.{file_extension}"
            secure_name = secure_filename(unique_filename)
            file_path = os.path.join(cls.UPLOAD_FOLDER, secure_name)
            
            # Procesar imagen con PIL
            try:
                image = Image.open(file)
                
                # Convertir a RGB si es necesario (para PNG con transparencia)
                if image.mode in ('RGBA', 'LA', 'P'):
                    # Crear fondo blanco para imágenes con transparencia
                    background = Image.new('RGB', image.size, (255, 255, 255))
                    if image.mode == 'P':
                        image = image.convert('RGBA')
                    background.paste(image, mask=image.split()[-1] if image.mode == 'RGBA' else None)
                    image = background
                
                # Redimensionar si es muy grande
                if image.size[0] > cls.MAX_IMAGE_SIZE[0] or image.size[1] > cls.MAX_IMAGE_SIZE[1]:
                    image.thumbnail(cls.MAX_IMAGE_SIZE, Image.Resampling.LANCZOS)
                
                # Guardar imagen optimizada
                image.save(file_path, 'JPEG', quality=85, optimize=True)
                
                # Generar URL relativa para la base de datos
                relative_url = f"/static/{cls.UPLOAD_FOLDER}/{secure_name}"
                
                return True, relative_url
                
            except Exception as e:
                logging.error(f"Error procesando imagen: {e}")
                return False, "Error procesando imagen. Asegúrese de que sea un archivo de imagen válido"
        
        except Exception as e:
            logging.error(f"Error general en upload: {e}")
            return False, "Error interno procesando archivo"
    
    @classmethod
    def delete_old_picture(cls, old_picture_url):
        """
        Eliminar imagen anterior del usuario (si existe)
        
        Args:
            old_picture_url: URL de la imagen anterior
        """
        if not old_picture_url or not old_picture_url.startswith('/static/'):
            return
        
        try:
            # Extraer path del archivo desde la URL
            file_path = old_picture_url.replace('/static/', '')
            full_path = os.path.join(file_path)
            
            if os.path.exists(full_path):
                os.remove(full_path)
                logging.info(f"Imagen anterior eliminada: {full_path}")
        except Exception as e:
            logging.warning(f"No se pudo eliminar imagen anterior: {e}")
