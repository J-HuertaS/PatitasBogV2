from reports.models.comment import Comment


class CommentRepository:

    def __init__(self, db):
        self.db = db

    def create(self, comment):
        self.db.add(comment)
        self.db.commit()
        self.db.refresh(comment)
        return comment

    def get_by_report(self, report_id):
        return (
            self.db.query(Comment)
            .filter(Comment.report_id == report_id)
            .all()
        )
    
    def update(self, comment):
        self.db.commit()
        self.db.refresh(comment)
        return comment
    
    def delete(self, comment):
        self.db.delete(comment)
        self.db.commit()