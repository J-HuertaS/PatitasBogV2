from common.security.token_service import TokenService

token_service = None


def init_jwt(app):

    global token_service

    token_service = TokenService(app.config["JWT_SECRET"])