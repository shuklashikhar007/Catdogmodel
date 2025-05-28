from bottle import route, run, request, app
from PIL import Image
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications.mobilenet import preprocess_input
from tensorflow.keras.models import load_model
import os
from bottle_cors_plugin import cors_plugin

app = app()
app.install(cors_plugin("*"))

MODEL_PATH = os.path.join(os.getcwd(), "model", "cat_dog_classifier.h5")

@route('/predict', method='POST')
def upload():
    file = request.files.get('image_file')
    if file and file.content_type.startswith('image/'):
        try:
            # Open the uploaded image
            img = Image.open(file.file).convert('RGB')  # Ensure 3 channels (RGB)
            img = img.resize((224, 224))  # Resize to 224x224

            img_array = np.array(img, dtype=np.float32)
            img_array = np.expand_dims(img_array, axis=0)
            preprocessed_img = preprocess_input(img_array)

            model = load_model(MODEL_PATH)
            y_pred = model.predict(preprocessed_img)[0][0] # 1->dog, 0->cat

            return {"cat": str(round(1-y_pred, 2)), "dog": str(round(y_pred, 2))}

        except Exception as e:
            return f'Error processing image: {str(e)}'
    else:
        return 'Invalid image file'

@route('/', method='GET')
def home():
    return 'helloworld'

if __name__ == '__main__':
    run(host='0.0.0.0', port=3000)