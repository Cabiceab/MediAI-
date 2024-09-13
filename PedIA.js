const recordButton = document.querySelector('.btn.record');
const clearButton = document.querySelector('.btn.clear');
const downloadButton = document.querySelector('.btn.download');
const resultText = document.querySelector('.resultText');
const classificationDiv = document.getElementById('classification');
const languageSelect = document.getElementById('language');

let currentField = null; // This variable will hold the current field we are trying to fill

// Setup for Speech Recognition API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = false;
recognition.lang = 'es-ES';  // Default language is set to Spanish

// Field mapping
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

// Event listener for the start button
recordButton.addEventListener('click', () => {
    recognition.lang = languageSelect.value;
    recognition.start();
    console.log('Recognition started');
});

// When speech is recognized
recognition.onresult =

