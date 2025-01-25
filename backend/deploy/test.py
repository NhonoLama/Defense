import tensorflow_decision_forests as tfdf
import tensorflow as tf

# Print versions
print("TensorFlow version:", tf.__version__)
print("TensorFlow Decision Forests version:", tfdf.__version__)

# Try creating a TF-DF model
try:
    model = tfdf.keras.RandomForestModel()
    print("TF-DF works successfully with TensorFlow 2.18!")
except Exception as e:
    print("Error:", str(e))
