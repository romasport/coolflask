# encoding=utf-8
from app import db


class Tag(db.Model):
    __tablename__="tag"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(15))


    def __init__(self, name):

        self.name = name

    def as_dict(self):
        jsondata = dict()
        for c in self.__table__.columns:
            jsondata.update({c.name: getattr(self, c.name)})
        return jsondata

arttag = db.Table('arttag',
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.id')),
    db.Column('article_id', db.Integer, db.ForeignKey('article.id'))
)