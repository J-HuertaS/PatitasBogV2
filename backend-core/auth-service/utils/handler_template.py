"""
Template base para el patrón Chain of Responsibility
"""
from abc import ABC, abstractmethod

class Handler(ABC):
    """Clase base abstracta para handlers"""
    
    def __init__(self):
        self._next_handler = None
    
    def set_next(self, handler):
        """Establecer el siguiente handler en la cadena"""
        self._next_handler = handler
        return handler
    
    @abstractmethod
    async def handle(self, context, response_handler):
        """
        Método abstracto que debe implementar cada handler
        
        Args:
            context: Datos a validar
            response_handler: Función para enviar respuesta HTTP
            
        Returns:
            bool: True si la validación pasó, False si falló
        """
        if self._next_handler:
            return await self._next_handler.handle(context, response_handler)
        return True
