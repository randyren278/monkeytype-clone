import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression

# Example data: each entry is a word and the time taken to type it
data = pd.DataFrame(mlWordTimings)

# Convert categorical data to numeric
data['word'] = data['word'].astype('category').cat.codes

# Features (word) and target (time)
X = data[['word']]
y = data['time']

# Train a simple linear regression model
model = LinearRegression()
model.fit(X, y)

# Predict the time for each word
predicted_times = model.predict(X)

# Find the words with the highest predicted times
worst_words = data.iloc[np.argsort(predicted_times)[-10:]]['word'].values
