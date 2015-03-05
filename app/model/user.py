# encoding=utf-8
from app import db, bcrypt
from app.config import Config

from werkzeug.security import generate_password_hash, \
     check_password_hash

from itsdangerous import (
    JSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired)

from wtforms.validators import Email

class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    nickname = db.Column(db.String(20))
    email = db.Column(db.String(120), unique=True, nullable=False, info={'validators': Email()})
    first_name = db.Column(db.String(60))
    last_name = db.Column(db.String(120))
    passwd = db.Column(db.String(60), nullable=False)
    icon = db.Column(db.String(40))
    sex = db.Column(db.String(2))
    articles = db.relationship('Article', backref='user', lazy='dynamic')

    def __init__(self, nickname, email, first_name, last_name, passwd):
        self.nickname = nickname
        self.email = email
        self.first_name = first_name
        self.last_name = last_name
        self.passwd = generate_password_hash(passwd)


    def as_dict(self):
        jsondata = dict()
        for c in self.__table__.columns:
            jsondata.update({c.name: getattr(self, c.name)})
        return jsondata


    def verify_passwd(self, passwd):
        return check_password_hash(self.passwd, passwd)

    def create_auth_token(self):
        s = Serializer(Config.SECRET_KEY)
        return s.dumps({'id': self.id})

    @staticmethod
    def verify_auth_token(token):
        token = bytes(token, encoding='utf-8')
        s = Serializer(Config.SECRET_KEY)
        try:
            data = s.loads(token)
        except SignatureExpired as e:
            return None
        except BadSignature as e:
            return None

        user = User.query.get(data['id'])
        if user:
            return True
        else:
            return False

    @property
    def full_name(self):
        return "{0} {1}".format(self.first_name, self.last_name)