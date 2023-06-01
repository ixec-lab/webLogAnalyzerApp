from flask import Flask

app = Flask(__name__,template_folder='templates',static_folder='static')

app.config['SECRET_KEY'] = 'SimpleKeyForTesting'

DEBUG = True
HOST = '127.0.0.1'

from routes import *

if __name__ == '__main__':
   app.run(host=HOST,debug=DEBUG)