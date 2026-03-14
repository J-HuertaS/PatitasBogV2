from flask import g
from config.database import SessionLocal


def get_db():

    if "db" not in g:
        g.db = SessionLocal()

    return g.db


def close_db(e=None):

    db = g.pop("db", None)

    if db is not None:
        db.close()