from flask import render_template, Blueprint
from app.model import Article, User, Category
from flask.ext.restful import Api, Resource, reqparse
from app import db

from app.lib import AuthToken

from datetime import datetime

blueprint = Blueprint('back', __name__, template_folder='templates')

auth = AuthToken()

@auth.verify_token
def verify_passwd(auth_token):
    user = User.verify_auth_token(auth_token)
    if user:
        return True
    else:
        return False

class articleParams:

    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument(
            'title', type=str, required=True, help="No title", location='json')
        self.reqparse.add_argument(
            'content', type=str, required=True, help="No content", location='json')
        self.reqparse.add_argument(
            'category', type=list, required=True, help="No category", location='json')


class userParams:

    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument('nickname', type=str, help="NO username")
        self.reqparse.add_argument('passwd', type=str, help="NO password")
        self.reqparse.add_argument('token', type=str, help='NO token')


class categoryParams:

    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument(
            'name', type=str, required=True, help="No title", location='json')
        self.reqparse.add_argument(
            'description', type=str, required=True, help="No content", location='json')


class articleAPI(Resource, articleParams):

    """docstring for articleApi"""

    def get(self, id):
        try:
            result = Article.query.filter(Article.id == id).first()
            art = dict()
            art.update(result.as_dict())

            categorys = list()
            for category in result.category:
                categorys.append(category.as_dict())
            art.update({'category': categorys})

            return art
            # return request.headers.get('Auth',"");
        except Exception as e:
            return False

    @auth.login_required
    def put(self, id):
        args = self.reqparse.parse_args()
        try:
            article = Article.query.get(id)
            article.title = args['title']
            article.content = args['content']
            article.category = []
            for cate in args['category']:
                category = Category.query.filter_by(id=cate).first()
                article.category.append(category)
            db.session.commit()
            return True
        except Exception as e:
            return False

    @auth.login_required
    def delete(self, id):
        a = Article.query.get(id)
        db.session.delete(a)
        try:
            db.session.commit()
            return True
        except Exception as e:
            return False


class articlesPageAPI(Resource, articleParams):

    def get(self, page, per_page):
        offset = (page - 1) * per_page
        try:
            articles = Article.query.offset(offset).limit(per_page)
            artList = []
            for article in articles:
                temp = article.as_dict()
               # temp.update({"author": article.user_id.nickname})
                artList.append(temp)
            return artList
        except Exception as e:
            return False

class articlesAPI(Resource, articleParams):

    @auth.login_required
    def post(self):
        args = self.reqparse.parse_args()
        now = datetime.now()
        a = Article(
            user_id=1, title=args['title'], content=args['content'], time=now, view=1)
        try:
            db.session.add(a)
            db.session.commit()
            return True
        except Exception as e:
            return False



class userAPI(Resource, userParams):

    """docstring for userAPI"""

    def post(self):
        args = self.reqparse.parse_args()
        return User.verify_auth_token(args["token"])

class usersAPI(Resource, userParams):

    """docstring for usersAPI"""

    def post(self):
        args = self.reqparse.parse_args()
        user = User.query.filter(User.nickname==args['nickname']).first()
        if user and user.verify_passwd(args['passwd']):
            # return json.dumps(user.create_auth_token())
            token = str(user.create_auth_token(), encoding='utf-8')
            return {"token": token}
        else:
            return {"error": "Incorrect login or password"}


class categoryAPI(Resource, categoryParams):

    """docstring for articleApi"""

    def get(self, id):
        try:
            if isinstance(id, int):
                result = Category.query.filter(Category.id == id).first()
                return result.as_dict()
            elif isinstance(id, str):
                result = Category.query.filter(Category.name == id).first()
                return result.as_dict()
        except Exception as e:
            return False

    @auth.login_required
    def put(self, id):
        args = self.reqparse.parse_args()
        try:
            category = Category.query.get(id)
            category.name = args['name']
            category.description = args['description']
            db.session.commit()
            return True
        except Exception as e:
            return False

    @auth.login_required
    def delete(self, id):
        a = Category.query.get(id)
        db.session.delete(a)
        try:
            db.session.commit()
            return True
        except Exception as e:
            return False

class categorysAPI(Resource, categoryParams):

    def get(self):
        try:
            cates = Category.query.all()
            cateList = []
            for cate in cates:
                cateList.append(cate.as_dict())
            return cateList
        except Exception as e:
            return False

    @auth.login_required
    def post(self):
        args = self.reqparse.parse_args()
        a = Category(
            name=args['name'], description=args['description'])
        try:
            db.session.add(a)
            db.session.commit()
            return True
        except Exception as e:
            return False


class categoryPageAPI(Resource, articleParams):

    def get(self, page, per_page):
        offset = (page - 1) * per_page
        try:
            categorys = Category.query.offset(offset).limit(per_page)
            catList = []
            for category in categorys:
                temp = category.as_dict()
               # temp.update({"author": article.user_id.nickname})
                catList.append(temp)
            return catList
        except Exception as e:
            return False



api = Api(blueprint)
api.add_resource(articleAPI, "/api/article/<int:id>", endpoint="article")
api.add_resource(articlesAPI, "/api/articles", endpoint="articles")
api.add_resource(
    articlesPageAPI, "/api/article/list/<int:page>/<int:per_page>", endpoint="articlesPage")

api.add_resource(categoryAPI, "/api/category/<id>", endpoint="category")
api.add_resource(categorysAPI, "/api/categorys", endpoint="categorys")
api.add_resource(
    categoryPageAPI, "/api/category/list/<int:page>/<int:per_page>", endpoint="categoryPage")

api.add_resource(userAPI, "/api/user/token", endpoint="userToken")
api.add_resource(usersAPI, "/api/users", endpoint="users")


@blueprint.route("/admin/")
def admin():
    return render_template("admin.html")