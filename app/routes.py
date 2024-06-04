from app import app
from flask import render_template

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/typing-test')
def typing_test():
    return render_template('index.html')

@app.route('/ml-typing-test')
def ml_typing_test():
    return render_template('ml_typing_test.html')
