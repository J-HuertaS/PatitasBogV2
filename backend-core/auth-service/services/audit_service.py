"""
Servicio de auditoría para cambios en el perfil de usuario
"""
import logging
from datetime import datetime
from flask import request
import json
import os

def ensure_logs_directory():
    """Asegurar que existe el directorio de logs"""
    os.makedirs('logs', exist_ok=True)

# Inicializar directorio de logs al importar el módulo
ensure_logs_directory()

class AuditLogger:
    """Servicio para registrar cambios en el perfil de usuario"""
    
    def __init__(self):
        # Ensure logs directory exists first
        ensure_logs_directory()
        
        # Configurar logger específico para auditoría
        self.logger = logging.getLogger('audit')
        self.logger.setLevel(logging.INFO)
        
        # Evitar duplicar handlers si ya están configurados
        if not self.logger.handlers:
            # Handler para archivo de auditoría
            file_handler = logging.FileHandler('logs/audit.log', encoding='utf-8')
            file_handler.setLevel(logging.INFO)
            
            # Formato para logs de auditoría
            formatter = logging.Formatter(
                '%(asctime)s | %(levelname)s | %(message)s',
                datefmt='%Y-%m-%d %H:%M:%S'
            )
            file_handler.setFormatter(formatter)
            
            self.logger.addHandler(file_handler)
            
            # También log a consola en desarrollo
            console_handler = logging.StreamHandler()
            console_handler.setLevel(logging.INFO)
            console_handler.setFormatter(formatter)
            self.logger.addHandler(console_handler)
    
    def _get_client_info(self):
        """Obtener información del cliente"""
        return {
            'ip': request.remote_addr if request else 'N/A',
            'user_agent': request.headers.get('User-Agent', 'N/A') if request else 'N/A',
            'method': request.method if request else 'N/A',
            'endpoint': request.endpoint if request else 'N/A'
        }
    
    def log_profile_view(self, user_id, user_email):
        """Registrar visualización de perfil"""
        client_info = self._get_client_info()
        
        log_entry = {
            'action': 'PROFILE_VIEW',
            'user_id': user_id,
            'user_email': user_email,
            'timestamp': datetime.utcnow().isoformat(),
            'client_info': client_info
        }
        
        self.logger.info(f"PROFILE_VIEW | User: {user_email} | IP: {client_info['ip']}")
    
    def log_profile_update(self, user_id, user_email, updated_fields, old_values=None):
        """Registrar actualización de perfil"""
        client_info = self._get_client_info()
        
        log_entry = {
            'action': 'PROFILE_UPDATE',
            'user_id': user_id,
            'user_email': user_email,
            'updated_fields': updated_fields,
            'old_values': old_values or {},
            'timestamp': datetime.utcnow().isoformat(),
            'client_info': client_info
        }
        
        fields_list = ', '.join(updated_fields.keys())
        self.logger.info(
            f"PROFILE_UPDATE | User: {user_email} | Fields: {fields_list} | IP: {client_info['ip']}"
        )
    
    def log_password_change(self, user_id, user_email, success=True, reason=None):
        """Registrar cambio de contraseña"""
        client_info = self._get_client_info()
        
        status = 'SUCCESS' if success else 'FAILED'
        log_entry = {
            'action': 'PASSWORD_CHANGE',
            'user_id': user_id,
            'user_email': user_email,
            'status': status,
            'reason': reason,
            'timestamp': datetime.utcnow().isoformat(),
            'client_info': client_info
        }
        
        log_message = f"PASSWORD_CHANGE | User: {user_email} | Status: {status} | IP: {client_info['ip']}"
        if reason and not success:
            log_message += f" | Reason: {reason}"
        
        self.logger.info(log_message)
    
    def log_profile_picture_upload(self, user_id, user_email, file_size=None, success=True, reason=None):
        """Registrar subida de foto de perfil"""
        client_info = self._get_client_info()
        
        status = 'SUCCESS' if success else 'FAILED'
        log_entry = {
            'action': 'PROFILE_PICTURE_UPLOAD',
            'user_id': user_id,
            'user_email': user_email,
            'status': status,
            'file_size': file_size,
            'reason': reason,
            'timestamp': datetime.utcnow().isoformat(),
            'client_info': client_info
        }
        
        log_message = f"PROFILE_PICTURE_UPLOAD | User: {user_email} | Status: {status} | IP: {client_info['ip']}"
        if file_size:
            log_message += f" | Size: {file_size} bytes"
        if reason and not success:
            log_message += f" | Reason: {reason}"
        
        self.logger.info(log_message)
    
    def log_security_event(self, user_id, user_email, event_type, details=None):
        """Registrar eventos de seguridad"""
        client_info = self._get_client_info()
        
        log_entry = {
            'action': 'SECURITY_EVENT',
            'event_type': event_type,
            'user_id': user_id,
            'user_email': user_email,
            'details': details or {},
            'timestamp': datetime.utcnow().isoformat(),
            'client_info': client_info
        }
        
        log_message = f"SECURITY_EVENT | Type: {event_type} | User: {user_email} | IP: {client_info['ip']}"
        if details:
            log_message += f" | Details: {json.dumps(details)}"
        
        self.logger.warning(log_message)
    
    def log_failed_authentication(self, user_email, reason):
        """Registrar fallos de autenticación"""
        client_info = self._get_client_info()
        
        log_entry = {
            'action': 'AUTH_FAILED',
            'user_email': user_email,
            'reason': reason,
            'timestamp': datetime.utcnow().isoformat(),
            'client_info': client_info
        }
        
        self.logger.warning(
            f"AUTH_FAILED | User: {user_email} | Reason: {reason} | IP: {client_info['ip']}"
        )

# Instancia global del logger de auditoría
audit_logger = AuditLogger()
