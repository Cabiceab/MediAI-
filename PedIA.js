const recordButton = document.querySelector('.btn.record');
const clearButton = document.querySelector('.btn.clear');
const downloadButton = document.querySelector('.btn.download');
const resultText = document.querySelector('.resultText');
const classificationDiv = document.getElementById('classification');
const languageSelect = document.getElementById('language');

// Speech Recognition Setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = false;

// Event listener for recording
recordButton.addEventListener('click', () => {
    recognition.lang = languageSelect.value;
    recognition.start();
});

recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
    }
    resultText.innerText = transcript;
    classifyMedicalData(transcript);
    downloadButton.disabled = false;
};

// Clear button functionality
clearButton.addEventListener('click', () => {
    resultText.innerText = '';
    classificationDiv.innerHTML = '';
    downloadButton.disabled = true;
});

// Download the result as a text file
downloadButton.addEventListener('click', () => {
    const blob = new Blob([resultText.innerText], { type: 'text/plain' });
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = 'transcription.txt';
    anchor.click();
});

// Function to classify medical data
function classifyMedicalData(transcript) {
    let classificationHTML = '';
    if (transcript.includes('nombre')) {
        classificationHTML += `<p><strong>Nombre:</strong> ${getFieldValue(transcript, 'nombre')}</p>`;
    }
    if (transcript.includes('edad')) {
        classificationHTML += `<p><strong>Edad:</strong> ${getFieldValue(transcript, 'edad')}</p>`;
    }
    // Add more classifications based on the fields you want
    classificationDiv.innerHTML = classificationHTML;
}

function getFieldValue(transcript, fieldName) {
    const regex = new RegExp(`${fieldName}\\s*:\\s*(\\w+)`, 'i');
    const match = transcript.match(regex);
    return match ? match[1] : 'No encontrado';
}
