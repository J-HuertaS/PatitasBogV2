from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from geoalchemy2 import Geography
from config.base import Base


class Response(Base):
    __tablename__ = "responses"

    id = Column(Integer, primary_key=True)

    report_id = Column(
        Integer,
        ForeignKey("reports.id"),
        nullable=False
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    type = Column(String(20), nullable=False)

    comment = Column(Text, nullable=False)

    location = Column(
        Geography(geometry_type="POINT", srid=4326)
    )

    created_at = Column(DateTime, default=datetime.utcnow)

    status = Column(String(20), default="pending")