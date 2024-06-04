import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from joblib import dump, load

class TypingModel:
    def __init__(self):
        self.model = LinearRegression()

    def train(self, data):
        # Convert categorical data to numeric
        data['word'] = data['word'].astype('category').cat.codes

        # Features (word) and target (time)
        X = data[['word']]
        y = data['time']

        # Train a simple linear regression model
        self.model.fit(X, y)

    def predict(self, words):
        # Convert words to numeric
        words = pd.Series(words).astype('category').cat.codes
        X = pd.DataFrame(words, columns=['word'])

        # Predict the time for each word
        return self.model.predict(X)

    def save_model(self, filepath):
        dump(self.model, filepath)

    def load_model(self, filepath):
        self.model = load(filepath)
