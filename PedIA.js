const recordButton = document.querySelector('.btn.record');
const clearButton = document.querySelector('.btn.clear');
const downloadButton = document.querySelector('.btn.download');
const resultText = document.querySelector('.resultText');
const classificationDiv = document.getElementById('classification');
const languageSelect = document.getElementById('language');
const instructionsToggle = document.getElementById('instructionsToggle');
const instructions = document.getElementById('instructions');

let currentField = null; // Variable para capturar el campo activo

// Toggle Instructions Visibility
instructionsToggle.addEventListener('click', () => {
    if (instructions.style.display === 'none') {
        instructions.style.display = 'block';
        instructionsToggle.innerText = 'Ocultar Instrucciones';
    } else {
        instructions.style.display = 'none';
        instructionsToggle.innerText = 'Ver Instrucciones';
    }
});

// Configuración del reconocimiento de voz
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = false;
recognition.lang = 'es-ES';

// Campos médicos
const fields = {
    'nombre': 'Nombre',
    'identificación': 'Identificación',
    'edad': 'Edad',
    'fecha de nacimiento': 'Fecha de Nacimiento',
    'escolaridad': 'Escolaridad',
    'EPS': 'EPS',
    'dirección': 'Dirección',
    'teléfono': 'Teléfono',
    'motivo de consulta': 'Motivo de Consulta',
    'enfermedad actual': 'Enfermedad Actual',
};

// Evento para el botón "Start Listening"
recordButton.addEventListener('click', () => {
    recognition.lang = languageSelect.value;
    recognition.start();
    console.log('Recognition started');
});

// Captura el resultado de la transcripción
recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
    }
    resultText.innerText = transcript;

    // Si se está esperando un valor para un campo, captúralo
    if (currentField) {
        classificationDiv.innerHTML += `<p><strong>${fields[currentField]}:</strong> ${transcript}</p>`;
        currentField = null;
    } else {
        Object.keys(fields).forEach((field) => {
            if (transcript.toLowerCase().includes(field)) {
                currentField = field;
                resultText.innerText = `Campo detectado: ${fields[field]}. Ahora, di el valor.`;
            }
        });
    }

    downloadButton.disabled = false;
};

// Botón para limpiar
clearButton.addEventListener('click', () => {
    resultText.innerText = '';
   
