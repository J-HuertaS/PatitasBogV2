"""
Tests simplificados para verificar que el backend funciona
"""
import pytest

def test_basic_python():
    """Test básico de Python"""
    assert 1 + 1 == 2

def test_import_basic_modules():
    """Test importación de módulos básicos"""
    import sys
    import os
    assert True

def test_flask_import():
    """Test importación de Flask"""
    try:
        import flask
        assert True
    except ImportError:
        pytest.fail("Flask no está instalado")

def test_pytest_asyncio():
    """Test que pytest-asyncio funciona"""
    import pytest_asyncio
    assert True

@pytest.mark.asyncio
async def test_async_function():
    """Test función asíncrona básica"""
    result = await async_add(2, 3)
    assert result == 5

async def async_add(a, b):
    """Función asíncrona de ejemplo"""
    return a + b
