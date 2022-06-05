#!/usr/bin/env python3

from app import *
from contextlib import closing

#This is called once only, when you initialise the site. like this
####from flaskr import init_db
####init_db()
def init_db():
    with closing(connect_db()) as db:
        with app.open_resource('schema.sql', mode='r') as f:
            #Reading the file, nothing more
            db.cursor().executescript(f.read())
        #And this creates the file. Make sure you don't do this twice, or back it up now and then
        db.commit()
init_db()
