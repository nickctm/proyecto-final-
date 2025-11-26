// Variables globales
let currentSection = 'login';
let recoveryEmail = '';

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    showSection('login');
});

// Inicializar event listeners
function initializeEventListeners() {
    // Navegación entre secciones
    document.getElementById('show-register').addEventListener('click', (e) => {
        e.preventDefault();
        showSection('register');
    });
    
    document.getElementById('show-login').addEventListener('click', (e) => {
        e.preventDefault();
        showSection('login');
    });
    
    document.getElementById('show-login-2').addEventListener('click', (e) => {
        e.preventDefault();
        showSection('login');
    });
    
    document.getElementById('show-login-3').addEventListener('click', (e) => {
        e.preventDefault();
        showSection('login');
    });
    
    document.getElementById('show-recover').addEventListener('click', (e) => {
        e.preventDefault();
        showSection('recover');
    });
    
    document.getElementById('resend-code').addEventListener('click', (e) => {
        e.preventDefault();
        sendRecoveryCode();
    });

    // Formularios
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    document.getElementById('recover-form').addEventListener('submit', handleRecovery);
    document.getElementById('verify-form').addEventListener('submit', handleVerification);
    document.getElementById('new-password-form').addEventListener('submit', handleNewPassword);

    // Modal
    document.getElementById('close-success-modal').addEventListener('click', closeSuccessModal);
    document.querySelector('.close-modal').addEventListener('click', closeSuccessModal);
    
    // Cerrar modal al hacer clic fuera
    document.getElementById('success-modal').addEventListener('click', (e) => {
        if (e.target.id === 'success-modal') {
            closeSuccessModal();
        }
    });
}

// Mostrar sección específica
function showSection(section) {
    // Ocultar todas las secciones
    document.querySelectorAll('.auth-section').forEach(sec => {
        sec.classList.remove('active');
    });
    
    // Mostrar la sección solicitada
    document.getElementById(`${section}-section`).classList.add('active');
    currentSection = section;
}

// Manejar login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Validación básica
    if (!validateEmail(email)) {
        showError('login-email', 'Por favor ingresa un email válido');
        return;
    }
    
    if (password.length < 6) {
        showError('login-password', 'La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    // Simular login exitoso
    showSuccess('Inicio de sesión exitoso. ¡Bienvenido!');
    
    // Aquí normalmente harías una petición al servidor
    console.log('Login attempt:', { email, password });
}

// Manejar registro
function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const lastname = document.getElementById('register-lastname').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    // Validaciones
    if (name.length < 2) {
        showError('register-name', 'El nombre debe tener al menos 2 caracteres');
        return;
    }
    
    if (lastname.length < 2) {
        showError('register-lastname', 'El apellido debe tener al menos 2 caracteres');
        return;
    }
    
    if (!validateEmail(email)) {
        showError('register-email', 'Por favor ingresa un email válido');
        return;
    }
    
    if (password.length < 6) {
        showError('register-password', 'La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    if (password !== confirmPassword) {
        showError('register-confirm-password', 'Las contraseñas no coinciden');
        return;
    }
    
    // Simular registro exitoso
    showSuccess('Registro exitoso. ¡Bienvenido a nuestra comunidad!');
    
    // Aquí normalmente harías una petición al servidor
    console.log('Register attempt:', { name, lastname, email, password });
}

// Manejar recuperación de contraseña
function handleRecovery(e) {
    e.preventDefault();
    
    const email = document.getElementById('recover-email').value;
    
    if (!validateEmail(email)) {
        showError('recover-email', 'Por favor ingresa un email válido');
        return;
    }
    
    recoveryEmail = email;
    sendRecoveryCode();
}

// Enviar código de recuperación
function sendRecoveryCode() {
    // Simular envío de código
    const code = generateRandomCode();
    
    showSuccess(`Se ha enviado un código de verificación a ${recoveryEmail}. El código es: ${code} (esto es solo una simulación)`);
    
    // Guardar código en localStorage para verificación
    localStorage.setItem('recoveryCode', code);
    localStorage.setItem('recoveryEmail', recoveryEmail);
    
    // Mostrar sección de verificación
    showSection('verify');
}

// Generar código aleatorio de 6 dígitos
function generateRandomCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Manejar verificación de código
function handleVerification(e) {
    e.preventDefault();
    
    const code = document.getElementById('verify-code').value;
    const storedCode = localStorage.getItem('recoveryCode');
    
    if (code !== storedCode) {
        showError('verify-code', 'El código de verificación es incorrecto');
        return;
    }
    
    // Código correcto, mostrar formulario de nueva contraseña
    showSection('new-password');
}

// Manejar nueva contraseña
function handleNewPassword(e) {
    e.preventDefault();
    
    const newPassword = document.getElementById('new-password').value;
    const confirmNewPassword = document.getElementById('confirm-new-password').value;
    
    if (newPassword.length < 6) {
        showError('new-password', 'La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    if (newPassword !== confirmNewPassword) {
        showError('confirm-new-password', 'Las contraseñas no coinciden');
        return;
    }
    
    // Simular cambio exitoso de contraseña
    showSuccess('Contraseña actualizada correctamente. Ya puedes iniciar sesión con tu nueva contraseña.');
    
    // Limpiar localStorage
    localStorage.removeItem('recoveryCode');
    localStorage.removeItem('recoveryEmail');
    
    // Volver al login después de 3 segundos
    setTimeout(() => {
        showSection('login');
        closeSuccessModal();
    }, 3000);
}

// Mostrar error en campo específico
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');
    
    // Remover estado de éxito si existe
    formGroup.classList.remove('success');
    
    // Agregar estado de error
    formGroup.classList.add('error');
    
    // Mostrar mensaje de error
    let errorElement = formGroup.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        formGroup.appendChild(errorElement);
    }
    errorElement.textContent = message;
    
    // Enfocar el campo con error
    field.focus();
}

// Mostrar éxito
function showSuccess(message) {
    document.getElementById('success-message').textContent = message;
    document.getElementById('success-modal').classList.add('active');
}

// Cerrar modal de éxito
function closeSuccessModal() {
    document.getElementById('success-modal').classList.remove('active');
}

// Validar email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Limpiar errores al escribir
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', function() {
        const formGroup = this.closest('.form-group');
        formGroup.classList.remove('error', 'success');
        
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
        
        // Marcar como éxito si tiene contenido válido
        if (this.value.trim() !== '') {
            if (this.type === 'email' && validateEmail(this.value)) {
                formGroup.classList.add('success');
            } else if (this.type !== 'email') {
                formGroup.classList.add('success');
            }
        }
    });
});