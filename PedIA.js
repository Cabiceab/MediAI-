// Inicializar SpeechRecognition con soporte para diferentes navegadores
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.interimResults = false; // Solo obtener el resultado final
recognition.maxAlternatives = 1;    // Número máximo de resultados alternativos
recognition.lang = 'es-ES';         // Idioma predeterminado: Español

// Seleccionar los elementos de la interfaz de usuario
const recordButton = document.querySelector('.btn.record');
const resultText = document.querySelector('.resultText');
const classificationDiv = document.getElementById('classification');
const languageSelect = document.getElementById('language');

let listening = false; // Controlar si el reconocimiento está activo
let finalTranscript = ''; // Texto transcrito final

// Secciones para clasificar el texto
const sections = {
    "DATOS DE IDENTIFICACIÓN": [
        "NOMBRE", "IDENTIFICACIÓN", "EDAD", "FECHA DE NACIMIENTO", "ESCOLARIDAD", "EPS", "NATURAL", "RESIDENTE", "PROCEDENTE", "DIRECCIÓN", "TELÉFONO", "NOMBRE DEL ACOMPAÑANTE", "PARENTESCO", "OCUPACIÓN", "CONFIABILIDAD"
    ],
    "ANTECEDENTES": [
        "PRENATALES", "NATALES", "PATOLÓGICOS", "HOSPITALIZACIONES", "FARMACOLÓGICOS", "QUIRÚRGICOS", "TRANSFUSIONALES", "TRAUMÁTICOS", "ALÉRGICOS", "GRUPO SANGUÍNEO", "ALIMENTARIOS", "NEXO CONTAGIOSO", "NEXO EPIDEMIOLÓGICO", "NEURODESARROLLO"
    ],
    "MOTIVO DE CONSULTA": ["MOTIVO DE CONSULTA"],
    "ENFERMEDAD ACTUAL": ["ENFERMEDAD ACTUAL"],
    "EXAMEN FÍSICO": ["NEUROLÓGICO", "CABEZA", "CUELLO", "TÓRAX", "ABDOMEN", "GENITOURINARIO", "EXTREMIDADES", "PIEL"]
};

// Cambiar el idioma de reconocimiento de voz según el valor seleccionado
languageSelect.addEventListener('change', () => {
    recognition.lang = languageSelect.value;
});

// Función para iniciar/detener el reconocimiento de voz
recordButton.addEventListener('click', () => {
    if (!listening) {
        recognition.start(); // Iniciar reconocimiento de voz
        listening = true;
        recordButton.querySelector('p').textContent = 'Listening...'; // Cambiar el texto del botón
        recordButton.classList.add('active'); // Añadir una clase para estilizar cuando esté escuchando
    } else {
        recognition.stop(); // Detener reconocimiento de voz
        listening = false;
        recordButton.querySelector('p').textContent = 'Start Listening'; // Cambiar texto del botón de nuevo
        recordButton.classList.remove('active');
    }
});

// Al recibir el resultado del reconocimiento de voz
recognition.onresult = (event) => {
    finalTranscript = event.results[0][0].transcript; // Obtener el resultado de la transcripción
    resultText.textContent = finalTranscript; // Mostrar la transcripción en la interfaz

    classifyText(finalTranscript); // Clasificar el texto
};

// Manejo de errores en la API de reconocimiento de voz
recognition.onerror = (event) => {
    console.error('Speech recognition error detected: ' + event.error);
};

// Clasificar el texto transcrito en las secciones correspondientes
function classifyText(text) {
    const classifiedData = {};

    // Recorrer las secciones y clasificar los datos
    for (const section in sections) {
        classifiedData[section] = [];

        sections[section].forEach(key => {
            if (text.includes(key)) {
                const regex = new RegExp(`${key}: (.*)`, 'i');
                const match = text.match(regex);

                if (match && match[1]) {
                    classifiedData[section].push({ key, value: match[1].trim() });
                }
            }
        });
    }

    displayClassification(classifiedData); // Mostrar la clasificación en la interfaz
}

// Mostrar la clasificación en la interfaz
function displayClassification(data) {
    classificationDiv.innerHTML = ''; // Limpiar la clasificación anterior

    for (const section in data) {
        const sectionDiv = document.createElement('div');
        sectionDiv.classList.add('section');

        const title = document.createElement('h4');
        title.textContent = section;
        sectionDiv.appendChild(title);

        data[section].forEach(item => {
            const p = document.createElement('p');
            p.innerHTML = `<strong>${item.key}:</strong> ${item.value}`;
            sectionDiv.appendChild(p);
        });

        classificationDiv.appendChild(sectionDiv);
    }
}
