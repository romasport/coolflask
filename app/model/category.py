# encoding=utf-8
from app import db

class Category(db.Model):
    __tablename__="category"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20))
    description = db.Column(db.Text)

    def __init__(self, name):
        self.name = name

    def as_dict(self):
        jsondata = dict()
        for c in self.__table__.columns:
            jsondata.update({c.name: getattr(self, c.name)})
        return jsondata

artcate = db.Table('artcate',
    db.Column('cate_id', db.Integer, db.ForeignKey('category.id')),
    db.Column('article_id', db.Integer, db.ForeignKey('article.id'))
)