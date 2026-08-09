import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from threading import Thread

from jinja2 import Environment, FileSystemLoader


class EmailService:

    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", 587))
        self.smtp_username = os.getenv("SMTP_USERNAME")
        self.smtp_password = os.getenv("SMTP_PASSWORD")
        self.from_email = os.getenv("FROM_EMAIL", self.smtp_username)

        # Configurar Jinja para templates
        self.env = Environment(
            loader=FileSystemLoader("templates/emails")
        )

    def send_email(self, to_email, subject, template_name, context):
        """
        Enviar email usando template HTML

        to_email -> destinatario
        subject -> asunto
        template_name -> archivo html
        context -> variables para el template
        """

        def _send_background():
            # enviar correo
            with smtplib.SMTP(self.smtp_server, self.smtp_port, timeout=10) as server:
                server.starttls()
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(message)

        # cargar template
        template = self.env.get_template(template_name)

        # renderizar html
        html_content = template.render(context)

        # crear mensaje
        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = self.from_email
        message["To"] = to_email

        html_part = MIMEText(html_content, "html")
        message.attach(html_part)

        thread = Thread(target=_send_background)
        thread.daemon = True
        thread.start()
        return



        

        

    def send_password_reset_email(self, user_email, reset_token):
        """
        Enviar correo de reset de contraseña
        """

        subject = "Reset your password"

        context = {
            "reset_token": reset_token
        }

        self.send_email(
            to_email=user_email,
            subject=subject,
            template_name="password_reset.html",
            context=context
        )

    def send_welcome_email(self, user_email, username):
        """
        Enviar correo de bienvenida
        """

        subject = "Welcome!"

        context = {
            "username": username
        }

        self.send_email(
            to_email=user_email,
            subject=subject,
            template_name="welcome.html",
            context=context
        )