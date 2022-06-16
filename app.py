#!/usr/bin/env python

import re
import sqlite3, datetime, mistune, os
from zipapp import get_interpreter
from flask import Flask, request, session, g, redirect, url_for, \
     abort, render_template, flash

this_dir = os.path.dirname(__file__)
template_path = os.path.join(this_dir, 'templates')

app = Flask(__name__, template_folder=template_path)
app.config.from_pyfile('config_file.cfg')
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY') #Check config vars for provider
app.config['DATABASE'] = os.path.join(this_dir, 'content.db')

#Looks for the SQL file in the config block above -- blogPosts.db
def connect_db():
    return sqlite3.connect(app.config['DATABASE'])

def get_sql_records(table):
    if table == "articles":
        cursor = g.db.execute('select title, publishDate, link, text, interactive from articles order by id asc')
        articles = [dict(title=row[0], date=row[1], link=row[2], text=row[3], interactive=row[4]) for row in cursor.fetchall()]
        return articles
    elif table == "entries":
        cursor = g.db.execute('select title, entryDate, text from entries order by id asc')
        entries = [dict(title=row[0], date=row[1], text=row[2]) for row in cursor.fetchall()]
        return entries
    else:
        raise sqlite3.DatabaseError
    #Entries entered as a param into the show_current.html template.

def sort_articles(articles):
    interactive_articles = []
    non_interactive_articles = []
    for i, article in enumerate(articles):
        article["db_order"] = i
        if article["interactive"] == 1:
            interactive_articles.append(article)
        elif article["interactive"] == 0:
            non_interactive_articles.append(article)
        else:
            raise AttributeError("The database doesn't have interactive flag")
    return interactive_articles, non_interactive_articles

@app.before_request
def before_request():
    g.db = connect_db()
#    if 'https' not in request.url:
#        return redirect(request.url.replace('http', 'https')) #forcing https for all connections

@app.teardown_request
def teardown_request(exception):
    db = getattr(g, 'db', None)
    if db is not None:
        db.close()

@app.after_request
def after_request(response):
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'SAMEORIGIN')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Strict-Transport-Security', 'max-age=63072000')
    #response.headers.set('Content-Security-Policy', 'default-src self')
    return response

@app.route('/')
def show_current():
    session.pop('logged_in', None)
    entries = get_sql_records("entries")
    showPost = len(entries)-1
    return render_template('show_current.html', entries=entries, postNum=showPost)

postNum = 0
@app.route('/post', methods=['GET','POST'])
def show_post():
    qString = request.args.get('postNum')
    global postNum
    if qString != None:
        postNum = int(qString)
    session.pop('logged_in', None)
    entries = get_sql_records("entries")
    return render_template('show_current.html', entries=entries, postNum=postNum)

@app.route('/article', methods=['GET','POST'])
def show_article():
    qString = request.args.get('articleNum')
    global articleNum
    if qString != None:
        articleNum = int(qString)
    session.pop('logged_in', None)
    articles = get_sql_records("articles")
    return render_template('show_article.html', articles=articles, articleNum=articleNum)

@app.route('/about')
def about():
    session.pop('logged_in', None)
    return render_template('about.html')

@app.route('/my_work')
def my_work():
    session.pop('logged_in', None)
    return render_template('my_work.html')

@app.route('/add', methods=['POST'])
def add_entry():
    table = request.form['tableSelect']

    if len(request.form['title']) <= 0:
        flash('Add a title, dummy')
    if len(request.form['text']) <= 0:
        flash('Um, you don\'t have any text. Try harder.')    
    if not session.get('logged_in'):
        abort(401)

    title = request.form['title']
    formattedText = mistune.markdown(request.form['text'], escape=False)
    #You need to have escape=False for Mistune to leave HTML tags alone. You will need to turn this off if you provide untrusted users with a text box
    if table == 'articles':
        publishDate = request.form['published']
        formattedLink = mistune.markdown(request.form['link'], escape=False)
        g.db.execute('insert into articles (title, publishDate, link, text) values (?, ?, ?, ?)',
                    [title, publishDate, formattedLink, formattedText])
    elif table == 'entries':
        timeNow = datetime.datetime.now()
        readTime = datetime.datetime.strptime(str(timeNow),'%Y-%m-%d %H:%M:%S.%f')
        formattedTime = datetime.datetime.strftime(readTime,'%B %d, %Y @ %H:%M')
        g.db.execute('insert into entries (title, entryDate, text) values (?, ?, ?)',
                    [title, formattedTime, formattedText])
    else:
        raise sqlite3.DatabaseError

    g.db.commit()
    flash('Check it updated')

    return redirect(url_for('cms'))

@app.route('/archive')
def show_archive():
    session.pop('logged_in', None)
    entries = get_sql_records("entries")
    return render_template('show_archive.html', entries=entries)

@app.route('/articles')
def show_articles():
    session.pop('logged_in', None)
    articles = get_sql_records("articles")
    interactive_articles, non_interactive_articles = sort_articles(articles)
    print(non_interactive_articles[1]["db_order"])
    return render_template('show_articles.html',
                            interactive_articles=interactive_articles,
                            non_interactive_articles=non_interactive_articles)

@app.route('/cms')
def cms():
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    return render_template('cms.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        #Checks user credentials against the variables defined initially
        if request.form['password'] == 'password':
            flash('You can\'t be told can you? Ok, my password isn\'t "abcd1234".')
        elif request.form['password'] == 'abcd1234':
            flash('Um, OK, I can tell you\'re clever, so I\'ll tell you the password. It\'s the last 15 digits of pi.')
        elif request.form['username'] != app.config['USERNAME']:
            error = 'Invalid username'
        elif request.form['password'] != app.config['PASSWORD']:
            error = 'Invalid password'
        else:
            session['logged_in'] = True
            return redirect(url_for('cms'))
    else:
        flash('My password totally isn\'t "password"')
    return render_template('login.html', error=error)

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    flash('You were logged out')
    return redirect(url_for('show_current'))

#@app.route('/favicon.ico')
#def favicon():
#    return send_from_directory(os.path.join(app.root_path, 'static'),
#                               'favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.errorhandler(404)
def pageNotFound(error):
    session.pop('logged_in', None)
    return render_template('404.html')

@app.errorhandler(Exception)
def all_exceptions(error):
    print(error)

if __name__ == '__main__':
    app.run() # THis doesn't get called in PRD, see wsgi.py file 
