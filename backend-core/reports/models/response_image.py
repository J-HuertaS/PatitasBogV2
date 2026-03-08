from sqlalchemy import Column, Integer, Text, ForeignKey
from config.base import Base


class ResponseImage(Base):
    __tablename__ = "response_images"

    id = Column(Integer, primary_key=True)

    response_id = Column(
        Integer,
        ForeignKey("responses.id"),
        nullable=False
    )

    url = Column(Text, nullable=False)