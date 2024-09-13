// Variables de los botones e inputs
const recordButton = document.getElementById('startListening');
const resultText = document.querySelector('.resultText');
const instructionsToggle = document.getElementById('instructionsToggle');
const instructions = document.getElementById('instructions');
const apartados = document.querySelectorAll('.apartado'); // Todos los apartados

let currentField = null; // Campo actual que se llenará
let currentSection = null; // Apartado actual que se desplegará

// Apartados y campos esperados (coinciden con el HTML)
const sections = {
    "datos de identificación": ["nombre", "identificación", "edad", "fecha de nacimiento", "escolaridad", "eps", "natural", "residente", "procedente", "direccion", "telefono", "nombre del acompanante", "parentesco", "edad del acompanante", "ocupacion", "confiabilidad", "fecha de ingreso"],
    "motivo de consulta": ["motivo"],
    "enfermedad actual": ["enfermedad"],
    "antecedentes": ["personales", "prenatales", "patologicos", "hospitalizaciones", "farmacologicos", "quirurgicos", "transfusionales", "traumaticos", "alergicos"],
    "triángulo de aproximación pediátrico": ["neurologico", "circulatorio", "respiratorio"],
    "variables vitales": ["frecuencia cardiaca", "frecuencia respiratoria", "saturación de oxígeno", "temperatura", "tensión arterial"],
    "medidas antropométricas": ["peso", "talla"],
    "índices antropométricos": ["talla/edad", "imc/edad", "peso/talla", "peso/edad"],
    "examen físico": ["neurologico_examen", "cabeza", "cuello", "torax", "abdomen", "genitourinario", "extremidades", "piel"],
    "paraclínicos": ["laboratorios"],
    "análisis": ["diagnóstico nutricional"],
    "impresión diagnóstica": ["impresión diagnóstica"],
    "plan": ["estancia", "dieta", "farmacologicos_plan", "paraclinicos_plan", "cuidados_enfermeria"]
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

    // Iniciar el reconocimiento de voz al hacer clic en "Start Listening"
    recordButton.addEventListener('click', () => {
        recognition.start();
        resultText.innerText = 'Por favor, menciona un apartado para continuar.';
    });

    // Captura el resultado del reconocimiento de voz
    recognition.onresult = (event) => {
        let transcript = event.results[0][0].transcript.toLowerCase();
        resultText.innerText = transcript;

        // Si el usuario menciona un apartado, mostramos los campos de ese apartado
        Object.keys(sections).forEach(section => {
            if (transcript.includes(section)) {
                currentSection = section;
                const sectionDiv = document.getElementById(sectionToId(section));

                // Ocultamos todos los apartados y luego mostramos el seleccionado
                apartados.forEach(apartado => {
                    apartado.style.display = 'none';
                });
                sectionDiv.style.display = 'block'; // Mostrar solo el apartado mencionado

                resultText.innerText = `Apartado "${section}" seleccionado. Menciona los campos.`;
            }
        });

        // Si el usuario menciona un campo dentro del apartado, lo llenamos
        if (currentSection) {
            sections[currentSection].forEach(field => {
                if (transcript.includes(field)) {
                    currentField = field;
                    resultText.innerText = `Campo detectado: ${field}. Ahora menciona el valor.`;
                }
            });

            // Llenado del campo con el valor proporcionado por el usuario
            if (currentField) {
                let value = transcript.replace(currentField, '').trim();
                document.getElementById(currentField).innerText = value;
                resultText.innerText = `Campo "${currentField}" actualizado con el valor: ${value}`;
                currentField = null; // Reiniciar el campo
            }
        }
    };

    recognition.onerror = (event) => {
        console.error('Error en el reconocimiento de voz:', event.error);
        resultText.innerText = `Error: ${event.error}`;
    };

    recognition.onend = () => {
        console.log('Reconocimiento de voz finalizado.');
    };
}

// Mostrar/Ocultar instrucciones
instructionsToggle.addEventListener('click', () => {
    if (instructions.style.display === 'none') {
        instructions.style.display = 'block';
        instructionsToggle.innerText = 'Ocultar Instrucciones';
    } else {
        instructions.style.display = 'none';
        instructionsToggle.innerText = 'Ver Instrucciones';
    }
});

// Función auxiliar para convertir nombre de sección a ID
function sectionToId(section) {
    return section.replace(/\s+/g, '').toLowerCase(); // Convertir sección a ID en minúsculas
}

