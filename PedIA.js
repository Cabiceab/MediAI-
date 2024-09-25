import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase
const supabaseUrl = 'https://itrtgoozuuygamciugrk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0cnRnb296dXV5Z2FtY2l1Z3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYyNzYzNTIsImV4cCI6MjA0MTg1MjM1Mn0.sGWSOYHfflAXDmQUJp4ngx4Z0K4_YUhYU_hku77-B1Q'

// Crea el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Botones para iniciar sesión con Google y GitHub
const googleLoginButton = document.querySelector('#googleLogin');
const githubLoginButton = document.querySelector('#githubLogin');
const logoutButton = document.querySelector('#logout');

// Login con Google
googleLoginButton.addEventListener('click', async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/auth/callback`, // Redirige a esta ruta después del login
        },
    });
    if (error) {
        console.error('Error durante el inicio de sesión con Google:', error.message);
    } else {
        console.log('Sesión iniciada con Google:', data);
    }
});

// Login con GitHub
githubLoginButton.addEventListener('click', async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: `${window.location.origin}/auth/callback`, // Redirige a esta ruta después del login
        },
    });
    if (error) {
        console.error('Error durante el inicio de sesión con GitHub:', error.message);
    } else {
        console.log('Sesión iniciada con GitHub:', data);
    }
});
// Logout
logoutButton.addEventListener('click', async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error al cerrar sesión:', error.message);
  } else {
    console.log('Sesión cerrada');
  }
});

// Código para la interfaz de reconocimiento de voz y manejo de apartados
const container = document.querySelector('.container');
const signupButton = document.querySelector('.signup-section header');
const loginButton = document.querySelector('.login-section header');

// Alternar entre vista de login y registro
loginButton.addEventListener('click', () => {
    container.classList.add('active');
});

signupButton.addEventListener('click', () => {
    container.classList.remove('active');
});

// Verificar compatibilidad con SpeechRecognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = 'es-ES';

// Variables de los botones e inputs
const recordButton = document.getElementById('startListening');
const resultText = document.querySelector('.resultText');
const apartados = document.querySelectorAll('.apartado'); // Todos los apartados
const apartadoLista = document.getElementById('apartadoLista'); // Lista de apartados
const apartadoItems = document.querySelectorAll('.apartado h3'); // Títulos de los apartados (h3)

let currentField = null; // Campo actual que se llenará
let currentSection = null; // Apartado actual que se desplegará

// Apartados y campos esperados (coinciden con el HTML)
const sections = {
    "datos de identificación": ["nombre", "identificacion", "edad", "fecha_nacimiento", "escolaridad", "eps", "natural", "residente", "procedente", "direccion", "telefono", "nombre_acompanante", "parentesco", "edad_acompanante", "ocupacion", "confiabilidad", "fecha_ingreso"],
    "motivo de consulta": ["motivo"],
    "enfermedad actual": ["enfermedad"],
    "antecedentes": ["personales", "prenatales", "patologicos", "hospitalizaciones", "farmacologicos", "quirurgicos", "transfusionales", "traumaticos", "alergicos"],
    "triángulo de aproximación pediátrico": ["neurologico", "circulatorio", "respiratorio"],
    "variables vitales": ["frecuencia_cardiaca", "frecuencia_respiratoria", "saturacion_oxigeno", "temperatura", "tension_arterial"],
    "medidas antropométricas": ["peso", "talla"],
    "índices antropométricos": ["talla_edad", "imc_edad", "peso_talla", "peso_edad"],
    "examen físico": ["neurologico_examen", "cabeza", "cuello", "torax", "abdomen", "genitourinario", "extremidades", "piel"],
    "paraclínicos": ["laboratorios"],
    "análisis": ["diagnostico_nutricional"],
    "impresión diagnóstica": ["impresion_diagnostica"],
    "plan": ["estancia", "dieta", "farmacologicos_plan", "paraclinicos_plan", "cuidados_enfermeria"]
};

// Mostrar la lista de apartados y todos los apartados al hacer clic en "Start Listening"
recordButton.addEventListener('click', () => {
    apartadoLista.style.display = 'block'; // Mostrar la lista de apartados
    apartados.forEach(apartado => {
        apartado.style.display = 'block'; // Mostrar todos los apartados
    });
    recognition.start(); // Iniciar el reconocimiento de voz
    resultText.innerText = 'Apartados desplegados. Ahora menciona el apartado que deseas llenar.';
});

// Función para ocultar todos los campos dentro de un apartado
function hideAllFields(section) {
    const fields = section.querySelectorAll('.campo');
    fields.forEach(field => {
        field.style.display = 'none'; // Ocultar todos los campos dentro del apartado
    });
}

// Función para mostrar los campos de un apartado
function showFields(section) {
    const fields = section.querySelectorAll('.campo');
    fields.forEach(field => {
        field.style.display = 'block'; // Mostrar los campos dentro del apartado
    });
}

// Al hacer clic en un título de apartado, mostrar los campos correspondientes
apartadoItems.forEach(item => {
    item.addEventListener('click', (e) => {
        const section = e.target.parentElement; // Obtener el apartado correspondiente
        hideAllFields(section); // Ocultar todos los campos al inicio
        showFields(section); // Mostrar los campos del apartado seleccionado
    });
});

// Manejador de resultados del reconocimiento de voz
recognition.onresult = (event) => {
    let transcript = event.results[0][0].transcript.toLowerCase(); // Transcripción del reconocimiento de voz
    resultText.innerText = `Dijiste: "${transcript}"`;

    // Buscar el apartado mencionado
    Object.keys(sections).forEach(section => {
        if (transcript.includes(section)) {
            const sectionId = sectionToId(section);
            const sectionDiv = document.getElementById(sectionId);
            hideAllFields(sectionDiv); // Ocultar todos los campos dentro de ese apartado
            showFields(sectionDiv); // Mostrar los campos del apartado mencionado
            resultText.innerText = `Apartado "${section}" seleccionado. Ahora menciona los campos.`;
            currentSection = section; // Guardar el apartado actual
        }
    });

    // Si se menciona un campo dentro del apartado actual, llenar el valor
    if (currentSection) {
        sections[currentSection].forEach(field => {
            if (transcript.includes(field)) {
                currentField = field;
                resultText.innerText = `Campo detectado: ${field}. Ahora menciona el valor.`;
            }
        });

        // Llenado del campo con el valor proporcionado por el usuario
        if (currentField) {
            let value = transcript.replace(currentField, '').trim(); // Obtener el valor mencionado
            document.getElementById(currentField).innerText = value; // Actualizar el campo
            resultText.innerText = `Campo "${currentField}" actualizado con el valor: ${value}`;
            currentField = null; // Reiniciar el campo
        }
    }
};

// Mostrar/Ocultar instrucciones
const instructionsToggle = document.getElementById('instructionsToggle');
const instructions = document.getElementById('instructions');
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
    return section.replace(/\s+/g, '').toLowerCase(); // Convertir nombre de la sección a ID
}
