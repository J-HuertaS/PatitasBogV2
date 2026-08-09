from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from geoalchemy2 import Geography
from config.base import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    pet_type = Column(String(20), nullable=False, index=True)

    pet_name = Column(String(100), nullable=False)

    description = Column(Text, nullable=False)

    location = Column(
        Geography(geometry_type="POINT", srid=4326),
        nullable=False
    )

    last_seen_date = Column(DateTime)

    reward = Column(Integer)

    status = Column(String(20), default="open", index=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    updated_at = Column(DateTime, onupdate=datetime.utcnow)

    closed_at = Column(DateTime)

    responses = relationship(
        "Response",
        backref="report",
        cascade="all, delete-orphan"
    )

    images = relationship(
        "ReportImage",
        backref="report",
        cascade="all, delete-orphan"
    )