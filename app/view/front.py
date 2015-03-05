from flask import render_template, Blueprint
from app.model import Article, User

blueprint = Blueprint('front', __name__, template_folder='templates')

@blueprint.route("/")
def index():
    result = Article.query.getall()
    return render_template("index.html", articles=result)

@blueprint.route('/article/<int:pageid>')
def article(pageid=1):
    result = Article.query.getart(pageid)
    return render_template("article.html", article=result)

@blueprint.route('/contact/')
def contact():
    return render_template("contact.html")