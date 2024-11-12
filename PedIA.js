// Elementos del DOM
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const previewImage = document.getElementById('previewImage');
const previewContainer = document.getElementById('previewContainer');
const annotationCanvas = document.getElementById('annotationCanvas');
const analyzeBtn = document.getElementById('analyzeBtn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const result = document.getElementById('result');

// Prevenir comportamiento por defecto del navegador
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Efectos visuales durante el arrastre
['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, unhighlight, false);
});

function highlight() {
    dropZone.classList.add('dragover');
}

function unhighlight() {
    dropZone.classList.remove('dragover');
}

// Manejar archivo subido
dropZone.addEventListener('drop', handleDrop, false);
fileInput.addEventListener('change', handleFileSelect, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles(files);
}

function handleFiles(files) {
    if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                previewContainer.style.display = 'block';
                previewImage.onload = function() {
                    // Configurar el canvas para las anotaciones
                    annotationCanvas.width = previewImage.clientWidth;
                    annotationCanvas.height = previewImage.clientHeight;
                };
                analyzeBtn.disabled = false;
                error.style.display = 'none';
                result.style.display = 'none';
            };
            reader.readAsDataURL(file);
        } else {
            showError('Por favor, selecciona un archivo de imagen válido.');
        }
    }
}

function showError(message) {
    error.textContent = message;
    error.style.display = 'block';
    analyzeBtn.disabled = true;
    result.style.display = 'none';
}

function analyzeImage() {
    loading.style.display = 'block';
    result.style.display = 'none';
    error.style.display = 'none';

    // Simular análisis de imagen
    setTimeout(() => {
        const ctx = annotationCanvas.getContext('2d');
        ctx.clearRect(0, 0, annotationCanvas.width, annotationCanvas.height);
        
        // Dibujar círculo rojo en una ubicación específica (simulado)
        ctx.beginPath();
        ctx.arc(annotationCanvas.width/2, annotationCanvas.height/2, 50, 0, 2 * Math.PI);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 3;
        ctx.stroke();

        loading.style.display = 'none';
        result.style.display = 'block';
        result.innerHTML = `
            <h3 class="finding-title">Resultados del análisis:</h3>
            <div class="finding-item">
                <div class="finding-title">Hallazgos principales:</div>
                <div class="finding-description">
                    - Opacidad focal en lóbulo superior derecho
                    - Patrón intersticial difuso
                    - Silueta cardíaca normal
                </div>
            </div>
            <div class="finding-item">
                <div class="finding-title">Interpretación:</div>
                <div class="finding-description">
                    Los hallazgos sugieren un proceso infeccioso/inflamatorio en evolución. 
                    Se recomienda correlación clínica y seguimiento radiológico.
                </div>
            </div>
            <div class="finding-item">
                <div class="finding-title">Recomendaciones:</div>
                <div class="finding-description">
                    - Control radiológico en 2 semanas
                    - Evaluación por neumología
                    - Considerar TC de tórax si no hay mejoría
                </div>
            </div>
        `;
    }, 2000);
}
