"""
Validaciones de perfil de usuario
"""
import re

def validate_full_name(full_name):
    return bool(full_name and len(full_name.strip()) >= 3)

def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_username(username):
    if not username:
        return True
    pattern = r'^[a-zA-Z0-9_]{3,20}$'
    return re.match(pattern, username) is not None

def validate_gender(gender):
    if not gender:
        return True
    valid_genders = ['male', 'female', 'other', 'prefer_not_to_say']
    return gender.lower() in valid_genders

def validate_phone_number(phone_number):
    if not phone_number:
        return True
    pattern = r'^[\+]?[\d\s\-\(\)]{7,20}$'
    return re.match(pattern, phone_number) is not None

def validate_address(address):
    if not address:
        return True
    return 5 <= len(address.strip()) <= 200
