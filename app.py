#!/usr/bin/env python

# all the imports
import sqlite3, datetime, mistune, os
from flask import Flask, request, session, g, redirect, url_for, \
     abort, render_template, flash

this_dir = os.path.dirname(__file__)
template_path = os.path.join(this_dir, 'templates')

app = Flask(__name__, template_folder=template_path)
app.config.from_pyfile('config_file.cfg')
app.config['DATABASE'] = os.path.join(this_dir, 'blogPosts.db')

#Looks for the SQL file in the config block above -- blogPosts.db
def connect_db():
    return sqlite3.connect(app.config['DATABASE'])

def getSqlRecords():
    cursor = g.db.execute('select title, entryDate, text from entries order by id asc')
    #Entries entered as a param into the show_current.html template.
    entries = [dict(title=row[0], date=row[1], text=row[2]) for row in cursor.fetchall()]
    return entries

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
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Strict-Transport-Security', 'max-age=63072000')
    #response.headers.set('Content-Security-Policy', 'default-src self')
    return response

@app.route('/')
def show_current():
    session.pop('logged_in', None)
    entries = getSqlRecords()
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
    entries = getSqlRecords()
    return render_template('show_current.html', entries=entries, postNum=postNum)

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
    if len(request.form['title']) <= 0:
        flash('Add a title, dummy')
    elif len(request.form['text']) <= 0:
        flash('Um, you don\'t have any text. Try harder.')    
    else:
        if not session.get('logged_in'):
            abort(401)
        timeNow = datetime.datetime.now()
        readTime = datetime.datetime.strptime(str(timeNow),'%Y-%m-%d %H:%M:%S.%f')
        formattedTime = datetime.datetime.strftime(readTime,'%B %d, %Y @ %H:%M')
        formattedText = mistune.markdown(request.form['text'], escape=False)
        #You need to have escape=False for Mistune to leave HTML tags alone. You will need to turn this off if you provide untrusted users with a text box
        g.db.execute('insert into entries (title, entryDate, text) values (?, ?, ?)',
                     [request.form['title'], formattedTime, formattedText])
        g.db.commit()
        flash('New entry was successfully posted')
    return redirect(url_for('cms'))

@app.route('/archive')
def show_archive():
    session.pop('logged_in', None)
    entries = getSqlRecords()
    return render_template('show_archive.html', entries=entries)

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

if __name__ == '__main__':
    app.run() #debug should be False in production
