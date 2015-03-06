# encoding=utf-8
from app import db
from app.config import Config
from app.model.tag import arttag
from app.model.category import artcate
from datetime import datetime

from flask.ext.sqlalchemy import SQLAlchemy, BaseQuery
from app.model import User

class Article(db.Model):
    __tablename__="article"

    class ArticleQuery(BaseQuery):

        def getart(self, id):
            article = self.get(id)
            user = User.query.get(article.user_id)
            data = {
                'id': article.id,
                'title': article.title,
                'content': article.content,
                'image': article.image,
                'time': article.time,
                'view': article.view,
                'user': user.full_name
            }
            return data

        def getall(self):
            data = []
            articles = self.all()
            for article in articles:
                user = User.query.get(article.user_id)
                temp = {
                    'id': article.id,
                    'title': article.title,
                    'content': article.content,
                    'image': article.image,
                    'time': article.time,
                    'view': article.view,
                    'user': user.full_name
                }
                data.append(temp)

            return data

    query_class = ArticleQuery

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    category = db.relationship('Category', secondary=artcate,
        backref=db.backref('articles', lazy='dynamic'))
    tags = db.relationship('Tag', secondary=arttag,
        backref=db.backref('pages', lazy='dynamic'))

    title = db.Column(db.String(30))
    content = db.Column(db.Text)
    image = db.Column(db.String(100))
    video = db.Column(db.Text)
    song = db.Column(db.String(100))
    time = db.Column(db.DateTime)
    view = db.Column(db.Integer)

    def __init__(self, user_id, title, content, time, view):
        self.user_id = user_id
        self.title = title
        self.content = content
        self.time = time
        self.view = view

    def as_dict(self):
        jsondata = dict()
        for c in self.__table__.columns:
            if c.name == "time":
                value = datetime.strftime(
                    getattr(self, c.name), '%b %d %Y, %H:%M')
                jsondata.update({c.name: value})
            else:
                jsondata.update({c.name: getattr(self, c.name)})
        return jsondata