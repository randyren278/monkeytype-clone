from app import app
from flask import render_template, request, jsonify
from models.model import TypingModel
import pandas as pd

typing_model = TypingModel()

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/typing-test')
def typing_test():
    return render_template('index.html')

@app.route('/ml-typing-test')
def ml_typing_test():
    return render_template('ml_typing_test.html')

@app.route('/train-model', methods=['POST'])
def train_model():
    data = request.json
    df = pd.DataFrame(data)
    typing_model.train(df)
    typing_model.save_model('models/typing_model.joblib')
    return jsonify({'message': 'Model trained successfully'})

@app.route('/generate-test', methods=['POST'])
def generate_test():
    words = request.json['words']
    typing_model.load_model('models/typing_model.joblib')
    predicted_times = typing_model.predict(words)
    hardest_words = [word for _, word in sorted(zip(predicted_times, words), reverse=True)[:10]]
    return jsonify({'hardest_words': hardest_words})
