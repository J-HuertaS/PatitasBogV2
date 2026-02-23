"""
Servicio para envío de emails
"""
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import current_app

class EmailService:
    """Servicio para envío de emails"""
    
    @staticmethod
    def get_smtp_config():
        """Obtener configuración SMTP desde variables de entorno"""
        return {
            'smtp_server': os.getenv('SMTP_SERVER', 'smtp.gmail.com'),
            'smtp_port': int(os.getenv('SMTP_PORT', 587)),
            'smtp_username': os.getenv('SMTP_USERNAME'),
            'smtp_password': os.getenv('SMTP_PASSWORD'),
            'from_email': os.getenv('FROM_EMAIL', os.getenv('SMTP_USERNAME'))
        }
    
    @staticmethod
    def send_email(to_email, subject, html_content, text_content=None):
        """
        Enviar email con contenido HTML y texto plano
        
        Args:
            to_email (str): Email del destinatario
            subject (str): Asunto del email
            html_content (str): Contenido HTML del email
            text_content (str): Contenido en texto plano (opcional)
        
        Returns:
            bool: True si se envió exitosamente, False en caso contrario
        """
        try:
            config = EmailService.get_smtp_config()
            
            # Verificar configuración requerida
            if not config['smtp_username'] or not config['smtp_password']:
                print("❌ Configuración SMTP incompleta. Simulando envío de email...")
                print(f"📧 Email simulado a: {to_email}")
                print(f"📧 Asunto: {subject}")
                print(f"📧 Contenido: {text_content or html_content}")
                return True  # Simular éxito para desarrollo
            
            # Crear mensaje
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = config['from_email']
            message["To"] = to_email
            
            # Agregar contenido de texto plano
            if text_content:
                text_part = MIMEText(text_content, "plain")
                message.attach(text_part)
            
            # Agregar contenido HTML
            html_part = MIMEText(html_content, "html")
            message.attach(html_part)
            
            # Conectar y enviar
            with smtplib.SMTP(config['smtp_server'], config['smtp_port']) as server:
                server.starttls()
                server.login(config['smtp_username'], config['smtp_password'])
                server.send_message(message)
            
            print(f"✅ Email enviado exitosamente a: {to_email}")
            return True
            
        except Exception as e:
            print(f"❌ Error enviando email: {e}")
            return False
    
    @staticmethod
    def send_password_reset_email(user_email, user_name, reset_code):
        """
        Enviar email con código de restablecimiento de contraseña

        Args:
            user_email (str): Email del destinatario
            user_name (str): Nombre del usuario
            reset_code (str): Código de restablecimiento (sin hash)
        
        Returns:
            bool: True si se envió exitosamente, False en caso contrario
        """
        subject = "Código de Restablecimiento de Contraseña"
        
        # Contenido HTML del email
        html_content = f"""
        <html>
            <head></head>
            <body>
                <h2>Hola {user_name},</h2>
                <p>Has solicitado restablecer tu contraseña.</p>
                <p>Usa el siguiente código para continuar con el proceso:</p>
                <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 20px 0; text-align: center;">
                    {reset_code}
                </p>
                <p>Este código expirará en 1 hora.</p>
                <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
                <br>
                <p>Saludos,</p>
                <p>Mascotas Bogota <3 </p>
            </body>
        </html>
        """
        
        # Contenido en texto plano (opcional pero recomendado)
        text_content = f"""
        Hola {user_name},

        Has solicitado restablecer tu contraseña.
        Usa el siguiente código para continuar con el proceso: {reset_code}

        Este código expirará en 1 hora.

        Si no solicitaste este cambio, puedes ignorar este correo.

        Saludos,
        Mascotas Bogota <3
        """
        
        print(f"🔑 Preparando email de reset con CÓDIGO para: {user_email}, Código: {reset_code}")
        return EmailService.send_email(user_email, subject, html_content, text_content)

    @staticmethod
    def send_welcome_email(user_email, user_name):
        """
        Enviar email de bienvenida

        Args:
            user_email (str): Email del destinatario
            user_name (str): Nombre del usuario

        Returns:
            bool: True si se envió exitosamente, False en caso contrario
        """
        subject = "Bienvenido a Mascotas App"
        
        # Contenido HTML del email
        html_content = f"""
        <html>
            <head></head>
            <body>
                <h2>Hola {user_name},</h2>
                <p>¡Bienvenido a Mascotas App!</p>
                <p>Estamos emocionados de tenerte con nosotros. Ahora puedes disfrutar de todas las funcionalidades de nuestra aplicación.</p>
                <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
                <br>
                <p>Saludos,</p>
                <p>El equipo de Mascotas App</p>
            </body>
        </html>
        """
        
        # Contenido en texto plano (opcional pero recomendado)
        text_content = f"""
        Hola {user_name},

        ¡Bienvenido a Mascotas App!
        Estamos emocionados de tenerte con nosotros. Ahora puedes disfrutar de todas las funcionalidades de nuestra aplicación.

        Si tienes alguna pregunta, no dudes en contactarnos.

        Saludos,
        El equipo de Mascotas App
        """
        
        return EmailService.send_email(user_email, subject, html_content, text_content)
