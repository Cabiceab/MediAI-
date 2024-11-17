document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const analyzeButton = document.getElementById('analyzeButton');
    const previewContainer = document.getElementById('previewContainer');
    const loading = document.getElementById('loading');
    const result = document.getElementById('result');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    dropZone.addEventListener('drop', handleDrop, false);
    fileInput.addEventListener('change', handleFileSelect, false);

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight(e) {
        dropZone.classList.add('highlight');
    }

    function unhighlight(e) {
        dropZone.classList.remove('highlight');
    }

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
            if (validateFile(file)) {
                showPreview(file);
                analyzeButton.style.display = 'block';
            }
        }
    }

    function validateFile(file) {
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/dicom'];
        if (!validTypes.includes(file.type)) {
            alert('Por favor seleccione una imagen válida (JPEG, PNG o DICOM)');
            return false;
        }
        if (file.size > 16 * 1024 * 1024) {
            alert('El archivo es demasiado grande. El tamaño máximo es 16MB.');
            return false;
        }
        return true;
    }

    function showPreview(file) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewContainer.innerHTML = `
                    <img src="${e.target.result}" alt="Preview">
                `;
            }
            reader.readAsDataURL(file);
        } else {
            previewContainer.innerHTML = `
                <p>Archivo seleccionado: ${file.name}</p>
            `;
        }
    }
});

async function analyzeImage() {
    const fileInput = document.getElementById('fileInput');
    const loading = document.getElementById('loading');
    const result = document.getElementById('result');

    if (!fileInput.files[0]) {
        alert('Por favor seleccione un archivo primero');
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    loading.style.display = 'block';
    result.innerHTML = '';

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            let resultHtml = '<div class="analysis-results">';
            resultHtml += '<h3>Resultados del Análisis:</h3>';

            if (data.prediction) {
                resultHtml += `
                    <p><strong>Diagnóstico:</strong> ${data.prediction}</p>
                    <p><strong>Confianza:</strong> ${(data.confidence * 100).toFixed(2)}%</p>
                `;
            }

            if (data.details) {
                resultHtml += `
                    <div class="additional-info">
                        <h4>Detalles Adicionales:</h4>
                        <p>${data.details}</p>
                    </div>
                `;
            }

            resultHtml += '</div>';
            result.innerHTML = resultHtml;
        } else {
            throw new Error(data.error || 'Error en el análisis');
        }
    } catch (error) {
        result.innerHTML = `
            <div class="error-message">
                <p>Error: ${error.message}</p>
            </div>
        `;
    } finally {
        loading.style.display = 'none';
    }
}
