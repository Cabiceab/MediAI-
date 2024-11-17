# app.py
from flask import Flask, render_template, request, jsonify
import os
import numpy as np
import tensorflow as tf
import cv2
from glob import glob
import pandas as pd
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.models import Sequential
from ultralytics import YOLO
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MODEL_FOLDER'] = 'model'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max-limit
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'dicom', 'dcm'}

# Crear directorios necesarios
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['MODEL_FOLDER'], exist_ok=True)
os.makedirs('data/train', exist_ok=True)
os.makedirs('data/test', exist_ok=True)
os.makedirs('data/val', exist_ok=True)

# Configuración del modelo CNN
IMG_SIZE = 128
num_classes = 4
class_names = ['COVID19', 'NORMAL', 'PNEUMONIA', 'TURBERCULOSIS']

def create_cnn_model():
    model = Sequential([
        layers.Input(shape=[IMG_SIZE, IMG_SIZE, 3]),
        layers.Rescaling(1./255),
        layers.Conv2D(16, 3, padding='same', activation='relu'),
        layers.MaxPooling2D(),
        layers.Conv2D(32, 3, padding='same', activation='relu'),
        layers.MaxPooling2D(),
        layers.Conv2D(64, 3, padding='same', activation='relu'),
        layers.MaxPooling2D(),
        layers.Flatten(),
        layers.Dense(128, activation='relu'),
        layers.Dense(num_classes)
    ])
    
    model.compile(
        optimizer='adam',
        loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
        metrics=['accuracy']
    )
    
    return model

def load_or_create_models():
    # Cargar o crear modelo CNN
    cnn_model_path = os.path.join(app.config['MODEL_FOLDER'], 'medical_cnn.h5')
    if os.path.exists(cnn_model_path):
        cnn_model = tf.keras.models.load_model(cnn_model_path)
    else:
        cnn_model = create_cnn_model()
    
    # Cargar o descargar modelo YOLO
    try:
        yolo_model = YOLO('yolo11x-cls.pt')
    except:
        print("Error al cargar modelo YOLO, usando solo CNN")
        yolo_model = None
    
    return cnn_model, yolo_model

def preprocess_image(image_path):
    """Preprocesa la imagen para análisis"""
    # Leer y preprocesar para CNN
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    # Redimensionar
    img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
    
    # Normalizar
    img_normalized = img / 255.0
    
    # Preprocesamiento adicional
    img_gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    img_enhanced = cv2.equalizeHist(img_gray)
    img_denoised = cv2.GaussianBlur(img_enhanced, (5, 5), 0)
    
    # Preparar para CNN
    img_cnn = np.expand_dims(img_normalized, axis=0)
    
    return img_cnn, img_denoised

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Cargar modelos
cnn_model, yolo_model = load_or_create_models()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No se encontró archivo'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No se seleccionó archivo'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # Preprocesar imagen
            img_cnn, img_processed = preprocess_image(filepath)
            
            # Análisis CNN
            cnn_predictions = cnn_model.predict(img_cnn)
            cnn_class_idx = np.argmax(cnn_predictions[0])
            cnn_confidence = float(tf.nn.softmax(cnn_predictions[0])[cnn_class_idx])
            cnn_result = {
                'class': class_names[cnn_class_idx],
                'confidence': cnn_confidence,
            }
            
            # Análisis YOLO si está disponible
            yolo_result = None
            if yolo_model:
                yolo_predictions = yolo_model.predict(filepath)
                yolo_result = {
                    'class': yolo_predictions[0].names[int(yolo_predictions[0].probs.top1)],
                    'confidence': float(yolo_predictions[0].probs.top1conf)
                }
            
            # Análisis de imagen básico
            img_stats = {
                'mean_intensity': float(np.mean(img_processed)),
                'std_intensity': float(np.std(img_processed)),
            }
            
            # Preparar respuesta
            result = {
                'status': 'success',
                'filename': filename,
                'cnn_analysis': cnn_result,
                'yolo_analysis': yolo_result,
                'image_stats': img_stats
            }
            
            return jsonify(result)
            
        except Exception as e:
            return jsonify({'error': f'Error en el análisis: {str(e)}'}), 500
        finally:
            # Opcional: limpiar archivo después del análisis
            if os.path.exists(filepath):
                os.remove(filepath)
    
    return jsonify({'error': 'Tipo de archivo no permitido'}), 400

if __name__ == '__main__':
    app.run(debug=True)
