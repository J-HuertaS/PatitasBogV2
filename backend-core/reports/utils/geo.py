from sqlalchemy import func

def create_point(lat, lng):
    return func.ST_SetSRID(func.ST_MakePoint(lng, lat), 4326)