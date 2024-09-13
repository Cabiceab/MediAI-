const recordButton = document.querySelector('.btn.record');
const clearButton = document.querySelector('.btn.clear');
const downloadButton = document.querySelector('.btn.download');
const resultText = document.querySelector('.resultText');
const classificationDiv = document.getElementById('classification');
const languageSelect = document.getElementById('language');

// Setup for Speech Recognition API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = false;
recognition.lang = 'es-ES';  // Default language is set to Spanish

// Event listener for the start button
recordButton.addEventListener('click', () => {
    recognition.lang = languageSelect.value;
    recognition.start();
    console.log('Recognition started');
});

// When speech is recognized
recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
    }
    resultText.innerText = transcript;
    classifyMedicalData(transcript);  // Automatically classify the data
    downloadButton.disabled = false;
};

// Event listener for the clear button
clearButton.addEventListener('click', () => {
    resultText.innerText = '';
    classificationDiv.innerHTML = '';
    downloadButton.disabled = true;
});

// Event listener for download button
downloadButton.addEventListener('click', () => {
    const blob = new Blob([resultText.innerText], { type: 'text/plain' });
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = 'transcription.txt';
    anchor.click();
});

// Function to classify the recognized medical data
function classifyMedicalData(transcript) {
    let classificationHTML = '';

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
        // Add more fields as necessary
    };

    for (const field in fields) {
        if (transcript.toLowerCase().includes(field)) {
            const value = getFieldValue(transcript, field);
            classificationHTML += `<p><strong>${fields[field]}:</strong> ${value}</p>`;
        }
    }

    classificationDiv.innerHTML = classificationHTML;
}

// Function to extract the value following a keyword in the transcript
function getFieldValue(transcript, fieldName) {
    const regex = new RegExp(`${fieldName}\\s*:\\s*(.+?)(?=,|$)`, 'i');
    const match = transcript.match(regex);
    return match ? match[1].trim() : 'No encontrado';
}
