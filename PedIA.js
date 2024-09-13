// Variables de los botones e inputs
const recordButton = document.getElementById('startListening');
const clearButton = document.querySelector('.btn.clear');
const downloadButton = document.querySelector('.btn.download');
const resultText = document.querySelector('.resultText');
const classificationDiv = document.getElementById('classification');
const languageSelect = document.getElementById('language');
const instructionsToggle = document.getElementById('instructionsToggle');
const instructions = document.getElementById('instructions');

let currentField = null; // Variable para capturar el campo activo

// Verifica la compatibilidad del navegador para SpeechRecognition
if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    alert('Tu navegador no soporta reconocimiento de voz. Usa Google Chrome o un navegador compatible.');
} else {
    // Configuración del reconocimiento de voz
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Para que el reconocimiento se detenga después de la primera entrada
    recognition.interimResults = false; // Solo obtener los resultados finales
    recognition.lang = 'es-ES'; // Idioma por defecto

    // Evento para el botón "Start Listening"
    recordButton.addEventListener('click', () => {
        recognition.lang = languageSelect.value; // Configura el idioma seleccionado
        recognition.start(); // Inicia el reconocimiento de voz
        console.log('Reconocimiento de voz iniciado...');
        recordButton.querySelector('p').innerText = 'Escuchando...';
    });

    // Captura el resultado del reconocimiento
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

        downloadButton.disabled = false; // Habilita el botón de descarga
        recordButton.querySelector('p').innerText = 'Start Listening'; // Restablece el texto del botón
    };

    // En caso de error
    recognition.onerror = (event) => {
        console.error('Error en el reconocimiento de voz:', event.error);
        resultText.innerText = `Error: ${event.error}`;
        recordButton.querySelector('p').innerText = 'Start Listening';
    };

    // Finaliza el reconocimiento
    recognition.onend = () => {
        console.log('Reconocimiento de voz finalizado.');
        recordButton.querySelector('p').innerText = 'Start Listening'; // Restablece el texto del botón
    };
}

// Mostrar y ocultar el manual de instrucciones
instructionsToggle.addEventListener('click', () => {
    if (instructions.style.display === 'none' || instructions.style.display === '') {
        instructions.style.display = 'block';
        instructionsToggle.innerText = 'Ocultar Instrucciones';
    } else {
        instructions.style.display = 'none';
        instructionsToggle.innerText = 'Ver Instrucciones';
    }
});

// Limpiar el contenido de la transcripción y la clasificación
clearButton.addEventListener('click', () => {
    resultText.innerText = '';
    classificationDiv.innerHTML = '';
    currentField = null;
    downloadButton.disabled = true;
});


