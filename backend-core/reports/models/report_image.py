from sqlalchemy import Column, Integer, Text, ForeignKey
from config.base import Base


class ReportImage(Base):
    __tablename__ = "report_images"

    id = Column(Integer, primary_key=True)

    report_id = Column(
        Integer,
        ForeignKey("reports.id"),
        nullable=False
    )

    url = Column(Text, nullable=False)