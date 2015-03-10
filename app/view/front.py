from flask import render_template, Blueprint
from app.model import Article, User, Category, Tag

blueprint = Blueprint('front', __name__, template_folder='templates')

@blueprint.route("/")
def index():
    result = Article.query.getall()
    categorys = Category.query.all()
    #tags = Tag.query.all()

    temp = Article.query.all()
    tags = list()
    dict = {}
    for t in temp:
        for tag in t.tag:
            count = dict.get(tag.name)
            if dict.get(tag.name):
                dict.update({
                    tag.name: count + 1
                })
            else:
                dict.update({
                    tag.name: 1
                })


    return render_template("index.html", articles=result, categorys=categorys, tags=dict)

@blueprint.route('/article/<int:pageid>')
def article(pageid=1):
    result = Article.query.getart(pageid)
    return render_template("article.html", article=result)

@blueprint.route('/contact/')
def contact():
    return render_template("contact.html")