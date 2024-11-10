// ============= CONFIGURACIÓN DE SUPABASE Y AUTENTICACIÓN =============
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://itrtgoozuuygamciugrk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0cnRnb296dXV5Z2FtY2l1Z3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYyNzYzNTIsImV4cCI6MjA0MTg1MjM1Mn0.sGWSOYHfflAXDmQUJp4ngx4Z0K4_YUhYU_hku77-B1Q';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Prevenir redirecciones múltiples
let isRedirecting = false;

// Función helper para redirección segura
function safeRedirect(url) {
    if (isRedirecting) return;
    isRedirecting = true;
    window.location.href = url;
}

// Botones de autenticación
const googleLoginButton = document.querySelector('#googleLogin');
const githubLoginButton = document.querySelector('#githubLogin');
const googleSignupButton = document.querySelector('#googleLoginSignup');
const githubSignupButton = document.querySelector('#githubLoginSignup');

// Variables para manejo de autenticación
const urlParams = new URLSearchParams(window.location.search);
const accessToken = urlParams.get('access_token');
const currentPath = window.location.pathname.replace(/\/$/, ''); // Elimina la barra final si existe

// Funciones de autenticación
function isProtectedRoute() {
    const protectedRoutes = ['/dashboard', '/dashboard.html'];
    return protectedRoutes.some(route => currentPath.includes(route));
}

function isTokenExpired(token) {
    if (!token) return true;
    try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = tokenPayload.exp * 1000;
        return Date.now() >= expirationTime;
    } catch (error) {
        console.error('Error al verificar el token:', error);
        return true;
    }
}

async function verificarAutenticacion() {
    const token = localStorage.getItem('supabaseAccessToken');
    if (!token || isTokenExpired(token)) {
        localStorage.removeItem('supabaseAccessToken');
        if (isProtectedRoute()) {
            safeRedirect('/index.html');
        }
        return false;
    }
    return true;
}

async function hacerPeticionProtegida() {
    const token = localStorage.getItem('supabaseAccessToken');
    if (!token) {
        console.error('No hay token de autenticación');
        safeRedirect('/index.html');
        return;
    }

    try {
        const response = await fetch('/api/protected-route', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.status === 401) {
            localStorage.removeItem('supabaseAccessToken');
            safeRedirect('/index.html');
            return;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en la petición:', error);
        throw error;
    }
}

// Event Listeners para botones de autenticación
googleLoginButton.addEventListener('click', async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
    });
    if (error) {
        console.error('Error durante el inicio de sesión con Google:', error.message);
    } else {
        console.log('Sesión iniciada con Google:', data);
    }
});

googleSignupButton.addEventListener('click', async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
    });
    if (error) {
        console.error('Error durante el signup con Google:', error.message);
    } else {
        console.log('Registro y sesión iniciada con Google:', data);
    }
});

githubLoginButton.addEventListener('click', async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
    });
    if (error) {
        console.error('Error durante el inicio de sesión con GitHub:', error.message);
    } else {
        console.log('Sesión iniciada con GitHub:', data);
    }
});

githubSignupButton.addEventListener('click', async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
    });
    if (error) {
        console.error('Error durante el signup con GitHub:', error.message);
    } else {
        console.log('Registro y sesión iniciada con GitHub:', data);
    }
});

// Manejo de la autenticación
async function handleAuth() {
    console.log('Current path:', currentPath); // Para debugging

    // Si estamos en la página de login
    if (currentPath === '' || currentPath === '/' || currentPath === '/index' || currentPath === '/index.html') {
        const storedToken = localStorage.getItem('supabaseAccessToken');
        if (storedToken && !isTokenExpired(storedToken)) {
            console.log('Token válido encontrado en página de login, redirigiendo a dashboard');
            safeRedirect("/dashboard.html");
            return;
        }
        // Si no hay token o está expirado, nos quedamos en la página de login
        return;
    }

    // Si estamos en una ruta protegida
    if (isProtectedRoute()) {
        // Si hay token en la URL
        if (accessToken) {
            console.log('Token encontrado en URL');
            localStorage.setItem('supabaseAccessToken', accessToken);
            // Limpiamos la URL solo si no estamos ya en dashboard
            if (!currentPath.includes('dashboard')) {
                safeRedirect("/dashboard.html");
            }
            return;
        }

        // Verificar token almacenado
        const storedToken = localStorage.getItem('supabaseAccessToken');
        if (!storedToken || isTokenExpired(storedToken)) {
            console.log('No hay token válido para ruta protegida');
            localStorage.removeItem('supabaseAccessToken');
            safeRedirect("/index.html");
            return;
        }
    }
}

// Ejecutar el manejo de autenticación
handleAuth();

// Verificación periódica de autenticación
setInterval(verificarAutenticacion, 300000); // Cada 5 minutos
// ============= CÓDIGO DE RECONOCIMIENTO DE VOZ Y MANEJO DE APARTADOS =============
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
const apartados = document.querySelectorAll('.apartado');
const apartadoLista = document.getElementById('apartadoLista');
const apartadoItems = document.querySelectorAll('.apartado h3');

let currentField = null;
let currentSection = null;

// Apartados y campos esperados
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

// Event Listeners y funciones para reconocimiento de voz
recordButton.addEventListener('click', () => {
    apartadoLista.style.display = 'block';
    apartados.forEach(apartado => {
        apartado.style.display = 'block';
    });
    recognition.start();
    resultText.innerText = 'Apartados desplegados. Ahora menciona el apartado que deseas llenar.';
});

function hideAllFields(section) {
    const fields = section.querySelectorAll('.campo');
    fields.forEach(field => {
        field.style.display = 'none';
    });
}

function showFields(section) {
    const fields = section.querySelectorAll('.campo');
    fields.forEach(field => {
        field.style.display = 'block';
    });
}

apartadoItems.forEach(item => {
    item.addEventListener('click', (e) => {
        const section = e.target.parentElement;
        hideAllFields(section);
        showFields(section);
    });
});

recognition.onresult = (event) => {
    let transcript = event.results[0][0].transcript.toLowerCase();
    resultText.innerText = `Dijiste: "${transcript}"`;

    Object.keys(sections).forEach(section => {
        if (transcript.includes(section)) {
            const sectionId = sectionToId(section);
            const sectionDiv = document.getElementById(sectionId);
            if (sectionDiv) {
                hideAllFields(sectionDiv);
                showFields(sectionDiv);
                resultText.innerText = `Apartado "${section}" seleccionado. Ahora menciona los campos.`;
                currentSection = section;
            }
        }
    });

    if (currentSection) {
        sections[currentSection].forEach(field => {
            if (transcript.includes(field)) {
                currentField = field;
                resultText.innerText = `Campo detectado: ${field}. Ahora menciona el valor.`;
            }
        });

        if (currentField) {
            let value = transcript.replace(currentField, '').trim();
            const fieldElement = document.getElementById(currentField);
            if (fieldElement) {
                fieldElement.innerText = value;
                resultText.innerText = `Campo "${currentField}" actualizado con el valor: ${value}`;
                currentField = null;
            }
        }
    }
};

// Manejo de errores del reconocimiento de voz
recognition.onerror = (event) => {
    console.error('Error en el reconocimiento de voz:', event.error);
    resultText.innerText = `Error en el reconocimiento de voz: ${event.error}`;
};

recognition.onend = () => {
    console.log('El reconocimiento de voz ha terminado');
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

function sectionToId(section) {
    return section.replace(/\s+/g, '').toLowerCase();
}
Last edited just now



