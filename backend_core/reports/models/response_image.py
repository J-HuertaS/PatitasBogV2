from sqlalchemy import Column, Integer, ForeignKey, Text
from config.database import Base


class ResponseImage(Base):

    __tablename__ = "response_images"

    id = Column(Integer, primary_key=True)

    response_id = Column(
        Integer,
        ForeignKey("responses.id"),
        nullable=False
    )

    url = Column(Text, nullable=False)

    thumbnail_url = Column(Text, nullable=False)

    path = Column(Text, nullable=False)