from reports.models.report import Report


class ReportRepository:

    def __init__(self, db):
        self.db = db

    def create(self, report):
        self.db.add(report)
        self.db.commit()
        self.db.refresh(report)
        return report

    def get_by_id(self, report_id):
        return self.db.query(Report).filter(Report.id == report_id).first()

    def get_open_reports(self):
        return self.db.query(Report).filter(Report.status == "open").all()

    def close_report(self, report):
        report.status = "closed"
        self.db.commit()

    def update(self, report):
        self.db.commit()
        self.db.refresh(report)
        return report

    def delete(self, report):
        self.db.delete(report)
        self.db.commit()