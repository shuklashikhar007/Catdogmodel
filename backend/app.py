import os
from PIL import Image
import numpy as np
from bottle_cors_plugin import cors_plugin
from bottle import route, run, request, app
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.mobilenet import preprocess_input

app = app()
MODEL_PATH = os.path.join(os.getcwd(), "model", "cat_dog_classifier.h5")

cors_origin = os.environ.get("CORS_ORIGIN")
if cors_origin is None:
    raise EnvironmentError("CORS_ORIGIN environment variable not set")

if ',' in cors_origin:
    cors_origin = [origin.strip() for origin in cors_origin.split(',')]

app.install(cors_plugin(cors_origin))


# Receives an image, do some pre-processing, and then predict
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

            return {"cat": str(round(1-y_pred, 4)), "dog": str(round(y_pred, 4))}

        except Exception as e:
            return f'Error processing image: {str(e)}'
    else:
        return 'Invalid image file'
    

# Returns all the accessible origins
@app.route("/env", method='GET')
def show_env():
    return {"CORS_ORIGIN": os.environ.get("CORS_ORIGIN")}


# Super-Duper important function
@route('/', method='GET')
def home():
    return 'helloworld'

if __name__ == '__main__':
    run(host='0.0.0.0', port=3000)