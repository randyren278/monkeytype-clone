from flask import Blueprint, render_template

main = Blueprint('main', __name__)
print("Registering route...")

@main.route('/')
def index():
    print("Rendering index...")
    return render_template('index.html')