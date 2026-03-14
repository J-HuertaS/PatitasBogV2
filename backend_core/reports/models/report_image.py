from sqlalchemy import Column, Integer, ForeignKey, Text, Boolean
from config.database import Base


class ReportImage(Base):

    __tablename__ = "report_images"

    id = Column(Integer, primary_key=True)

    report_id = Column(
        Integer,
        ForeignKey("reports.id"),
        nullable=False
    )

    url = Column(Text, nullable=False)

    thumbnail_url = Column(Text, nullable=False)

    path = Column(Text, nullable=False)

    is_primary = Column(Boolean, default=False)