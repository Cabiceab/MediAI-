const recordButton = document.getElementById('startListening');
const clearButton = document.querySelector('.btn.clear');
const downloadButton = document.querySelector('.btn.download');
const resultText = document.querySelector('.resultText');
const classificationDiv = document.getElementById('classification');
const languageSelect = document.getElementById('language');
const instructionsToggle = document.getElementById('instructionsToggle');
const instructions = document.getElementById('instructions');

let currentField = null; // Variable para capturar el campo activo

// Verifica la compatibilidad del navegador
if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    alert('Tu navegador no soporta reconocimiento de voz. Usa Google Chrome o un navegador compatible.');
} else {
    // Configuración del reconocimiento de voz
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Cambié a false para capturar el discurso una vez por clic
    recognition.interimResults = false; // Para obtener solo los resultados finales
    recognition.lang = 'es-ES'; // Idioma por defecto es español

    // Evento para el botón "Start Listening"
    recordButton.addEventListener('click', () => {
        recognition.lang = languageSelect.value; // Configura el idioma seleccionado
        recognition.start(); // Inicia el reconocimiento de voz
        console.log('Reconocimiento de voz iniciado...');
        recordButton.querySelector('p').innerText = 'Escuchando...';
    });

    // Cuando se reconoce un resultado
    recognition.onresult = (event) => {
        let transcript = ''; 
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        resultText.innerText = transcript;

        // Si se está esperando un valor para un campo, captúralo
        if (currentField) {
            classificationDiv.innerHTML += `<p><strong>${fields[currentField]}:</strong> ${transcript}</p>`;
            currentField = null; // Reinicia el campo actual
        } else {
            Object.keys(fields).forEach((field) => {
                if (transcript.toLowerCase().includes(field)) {
                    currentField = field;
                    resultText.innerText = `Campo detectado: ${fields[field]}. Ahora, di el valor.`;
                }
            });
        }

        downloadButton.disabled = false; // Habilita el botón de descargar
        recordButton.querySelector('p').innerText = 'Start Listening'; // Restablece el texto del botón
    };

    // En caso de error
    recognition.onerror = (event) => {
        console.error('Error en el reconocimiento de voz:', event.error);
        resultText.innerText = `Error: ${event.error}`;
        recordButton.querySelector('p

