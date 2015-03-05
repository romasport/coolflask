from functools import wraps
from flask import request


class AuthToken(object):

    """docstring for AuthToken"""

    def __init__(self):
        pass

    def login_required(self, f):
        @wraps(f)
        def decorate(*args, **kwargs):
            token = request.headers.get('auth', "")
            if self.verify_token_callback(token):
                return f(*args, **kwargs)
            return "You should login first"
        return decorate

    def verify_token(self, f):
        self.verify_token_callback = f