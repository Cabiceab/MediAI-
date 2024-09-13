// Variables de los botones e inputs
const recordButton = document.getElementById('startListening');
const clearButton = document.querySelector('.btn.clear');
const resultText = document.querySelector('.resultText');
const languageSelect = document.getElementById('language');
let currentField = null; // Campo actual que se llenará
let currentSection = null; // Apartado actual que se desplegará

// Apartados y campos esperados
const fields = {
    "datos de identificación": ["nombre", "identificación", "edad"],
    "motivo de consulta": ["motivo"],
    "enfermedad actual": ["enfermedad"]
};

// Verifica la compatibilidad del navegador para SpeechRecognition
if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    alert('Tu navegador no soporta reconocimiento de voz. Usa Google Chrome o un navegador compatible.');
} else {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'es-ES';

    // Iniciar el reconocimiento de voz
    recordButton.addEventListener('click', () => {
        recognition.lang = languageSelect.value;
        recognition.start();
        console.log('Reconocimiento de voz iniciado...');
        recordButton.querySelector('p').innerText = 'Escuchando...';
    });

    // Captura el resultado del reconocimiento
    recognition.onresult = (event) => {
        let transcript = event.results[0][0].transcript.toLowerCase();
        resultText.innerText = transcript;

        // Si el usuario menciona un apartado, lo desplegamos
        Object.keys(fields).forEach(section => {
            if (transcript.includes(section)) {
                currentSection = section;
               

