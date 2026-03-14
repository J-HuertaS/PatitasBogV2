import logging


class AuditService:
    """
    Servicio de auditoría desacoplado.
    Los services emiten eventos de dominio.
    La implementación decide cómo registrarlos.
    """

    def __init__(self):
        self.logger = logging.getLogger("audit")
        self.logger.setLevel(logging.INFO)

        if not self.logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter(
                "%(asctime)s | %(levelname)s | %(message)s",
                "%Y-%m-%d %H:%M:%S"
            )
            handler.setFormatter(formatter)
            self.logger.addHandler(handler)

    # -----------------------------
    # EVENT EMITTER (clave)
    # -----------------------------

    def emit_event(self, event_type, **data):
        """
        Punto único para registrar eventos.
        Mañana puede enviar a OpenTelemetry, Kafka, etc.
        """
        payload = " | ".join(f"{k}={v}" for k, v in data.items())
        self.logger.info(f"{event_type} | {payload}")

    # -----------------------------
    # AUTH EVENTS
    # -----------------------------

    def log_security_event(self, user_id, user_email, event_type):
        self.emit_event(
            "SECURITY_EVENT",
            type=event_type,
            user_id=user_id,
            email=user_email
        )

    def log_failed_authentication(self, identifier, reason):
        self.emit_event(
            "AUTH_FAILED",
            identifier=identifier,
            reason=reason
        )

    def log_password_change(self, user_id, user_email, success=True):
        status = "SUCCESS" if success else "FAILED"

        self.emit_event(
            "PASSWORD_CHANGE",
            user_id=user_id,
            email=user_email,
            status=status
        )

    # -----------------------------
    # PROFILE EVENTS
    # -----------------------------

    def log_profile_update(self, user_id, user_email, updated_fields):
        self.emit_event(
            "PROFILE_UPDATE",
            user_id=user_id,
            email=user_email,
            fields=",".join(updated_fields.keys())
        )

    def log_profile_picture_upload(self, user_id, user_email, success=True):
        status = "SUCCESS" if success else "FAILED"

        self.emit_event(
            "PROFILE_PICTURE_UPLOAD",
            user_id=user_id,
            email=user_email,
            status=status
        )