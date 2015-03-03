#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
from flask.ext.script import Manager, Shell, Server
from flask.ext.migrate import MigrateCommand

from app import create_app
from app.config import DevConfig, ProdConfig

app = create_app(DevConfig)

HERE = os.path.abspath(os.path.dirname(__file__))

manager = Manager(app)

manager.add_command('server', Server())
manager.add_command('db', MigrateCommand)

if __name__ == '__main__':
    manager.run()