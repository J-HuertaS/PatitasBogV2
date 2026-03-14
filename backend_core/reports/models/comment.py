from datetime import datetime
from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from config.base import Base


class Comment(Base):
    __tablename__ = "comments"

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

    content = Column(Text, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)