# -*- coding: utf-8 -*-
'''The app module, containing the app factory function.'''
from flask import Flask, render_template

from app.config import DevConfig
from app.extensions import (
    bcrypt,
    cache,
    db,
    login_manager,
    debug_toolbar,
    migrate
)

from app.model import User

def create_app(config_object=DevConfig):
    app = Flask(__name__)
    app.config.from_object(config_object)
    register_extensions(app)
    #register_blueprints(app)
    register_errorhandlers(app)
    return app

def register_extensions(app):
    bcrypt.init_app(app)
    cache.init_app(app)
    db.init_app(app)
    login_manager.init_app(app)
    debug_toolbar.init_app(app)
    migrate.init_app(app, db)
    return None

'''
def register_blueprints(app):
    app.register_blueprint(public.views.blueprint)
    app.register_blueprint(user.views.blueprint)
    return None
'''

def register_errorhandlers(app):
    def render_error(error):
        # If a HTTPException, pull the `code` attribute; default to 500
        error_code = getattr(error, 'code', 500)
        return render_template("error.html".format(error_code), error=error_code), error_code
    for errcode in [401, 404, 500]:
        app.errorhandler(errcode)(render_error)
    return None