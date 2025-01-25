from flask import Flask, request, jsonify
import tensorflow as tf
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
import numpy as np
import pickle
import re

app = Flask(__name__)

with open("stored.pickle", "rb") as handle:

    tokenizer = pickle.load(handle)

# Load the pre-trained sentiment analysis model (make sure the model is saved as 'sentiment_model.h5')
model = tf.keras.models.load_model("realDeal.keras")


# Retrieve the word index
word_index = tokenizer.word_index

cleaned_word_index = {key.strip("'"): value for key, value in word_index.items()}


@app.route("/")
def home():
    return "Sentiment Analysis API is running!"


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        if not data or "comment" not in data:
            return jsonify({"error": "Invalid input format"}), 400

        text = data["comment"]
        print("Original Text:", text)

        text_cleaned = re.sub(r"[^a-zA-Z\s]", "", text)
        comment_tokens = text_cleaned.lower().split()
        print("Tokenized Comment Tokens:", comment_tokens)

        comment_sequence = [cleaned_word_index.get(word, 0) for word in comment_tokens]
        print("Mapped Sequence:", comment_sequence)

        if np.count_nonzero(comment_sequence) <= 1:
            print("Skipping comment due to insufficient recognizable words.")
            return jsonify({"sentiment": "neutral", "score": 0.0})

        maxlen = 1000
        padded_sequence = pad_sequences([comment_sequence], maxlen=maxlen)
        print("Padded Sequence Shape:", padded_sequence.shape)

        prediction = model.predict(padded_sequence)
        prediction_score = float(prediction[0][0])
        sentiment = "positive" if prediction_score >= 0.5 else "negative"

        return jsonify(
            {"comment": text, "sentiment": sentiment, "score": prediction_score}
        )

    except Exception as e:
        import traceback

        print(f"Error: {e}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5001)  # Flask will run on port 5001
