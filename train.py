# train.py
import os
import numpy as np
import tensorflow as tf
import cv2
from glob import glob
from ultralytics import YOLO
import shutil
from tensorflow.keras import layers

def setup_directories():
    """Crea y limpia los directorios necesarios"""
    directories = [
        'raw',
        'data/train',
        'data/test',
        'data/val'
    ]
    
    for directory in directories:
        if os.path.exists(directory):
            shutil.rmtree(directory)
        os.makedirs(directory)
        
        # Crear subdirectorios para cada clase
        for class_name in ['COVID19', 'NORMAL', 'PNEUMONIA', 'TURBERCULOSIS']:
            os.makedirs(os.path.join(directory, class_name), exist_ok=True)

def preprocess_images(input_dir):
    """Preprocesa y redimensiona las imágenes"""
    d_paths = glob(os.path.join(input_dir, '*'))
    
    for d_path in d_paths:
        current_dir = os.path.basename(d_path)
        print(f'Procesando {current_dir}...')
        
        i_paths = glob(os.path.join(d_path, '*'))
        
        for i_path in i_paths:
            current_img = os.path.basename(i_path)
            
            # Leer y procesar imagen
            img = cv2.imread(i_path)
            if img is None:
                print(f"Error al leer imagen: {i_path}")
                continue
                
            # Redimensionar manteniendo proporción
            edge = min(img.shape[0], img.shape[1])
            
            # Recortar al cuadrado
            start_y = (img.shape[0] - edge) // 2
            start_x = (img.shape[1] - edge) // 2
            img = img[start_y:start_y+edge, start_x:start_x+edge]
            
            # Redimensionar a tamaño objetivo
            img = cv2.resize(img, (128, 128))
            
            # Guardar imagen procesada
            output_path = os.path.join('raw', current_dir, current_img)
            cv2.imwrite(output_path, img)
        
        print(f'{current_dir} completado')

def split_dataset():
    """Divide el conjunto de datos en train, test y val"""
    d_paths = glob('raw/*')
    
    for d_path in d_paths:
        current_dir = os.path.basename(d_path)
        i_paths = glob(os.path.join(d_path, '*'))
        
        # Mezclar aleatoriamente
        np.random.shuffle(i_paths)
        
        # Calcular índices de división (20% para test y val cada uno)
        n_images = len(i_paths)
        n_test = n_images * 2 // 10
        
        # Dividir paths
        test_paths = i_paths[:n_test]
        val_paths = i_paths[n_test:2*n_test]
        train_paths = i_paths[2*n_test:]
        
        # Copiar imágenes a sus respectivos directorios
        for paths, split in [(test_paths, 'test'), (val_paths, 'val'), (train_paths, 'train')]:
            for path in paths:
                filename = os.path.basename(path)
                dst_path = os.path.join('data', split, current_dir, filename)
                shutil.copy2(path, dst_path)

def train_models():
    """Entrena los modelos CNN y YOLO"""
    # Entrenar YOLO
    print("Entrenando modelo YOLO...")
    yolo_model = YOLO('yolo11x-cls.pt')
    yolo_model.train(data='data', epochs=5, imgsz=128)
    
    # Preparar datos para CNN
    print("Preparando datos para CNN...")
    train_ds = tf.keras.preprocessing.image_dataset_from_directory(
        'data/train',
        labels='inferred',
        label_mode='int',
        batch_size=16,
        image_size=(128, 128),
        shuffle=True
    )
    
    val_ds = tf.keras.preprocessing.image_dataset_from_directory(
        'data/val',
        labels='inferred',
        label_mode='int',
        batch_size=16,
        image_size=(128, 128),
        shuffle=True
    )
    
    # Optimizar rendimiento del dataset
    AUTOTUNE = tf.data.AUTOTUNE
    train_ds = train_ds.cache().shuffle(1000).prefetch(buffer_size=AUTOTUNE)
    val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)
    
    # Crear y entrenar modelo CNN
    print("Entrenando modelo CNN...")
    model = tf.keras.Sequential([
        layers.Input(shape=[128, 128, 3]),
        layers.Rescaling(1./255),
        layers.Conv2D(16, 3, padding='same', activation='relu'),
        layers.MaxPooling2D(),
        layers.Conv2D(32, 3, padding='same', activation='relu'),
        layers.MaxPooling2D(),
        layers.Conv2D(64, 3, padding='same', activation='relu'),
        layers.MaxPooling2D(),
        layers.Flatten(),
        layers.Dense(128, activation='relu'),
        layers.Dense(4)  # 4 clases
    ])
    
    model.compile(
        optimizer='adam',
        loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
        metrics=['accuracy']
    )
    
    # Entrenar modelo
    history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=5
    )
    
    # Guardar modelo
    if not os.path.exists('model'):
        os.makedirs('model')
    model.save('model/medical_cnn.h5')
    
    print("Entrenamiento completado.")
    return history

if __name__ == '__main__':
    print("Iniciando preparación del dataset...")
    setup_directories()
    
    print("Preprocesando imágenes...")
    input_dir = input("Ingrese el directorio de las imágenes de entrada: ")
    preprocess_images(input_dir)
    
    print("Dividiendo dataset...")
    split_dataset()
    
    print("Iniciando entrenamiento de modelos...")
    history = train_models()
    
    print("Proceso completado.")
