// --- LOGIN ---
const formLogin = document.getElementById('formLogin');
const correoLogin = document.getElementById('correoLogin');
const passLogin = document.getElementById('passLogin');
const mensajeLogin = document.getElementById('mensajeLogin');

formLogin.addEventListener('submit', function(e) {
    e.preventDefault();

    mensajeLogin.textContent = "";
    mensajeLogin.classList.remove('text-danger', 'text-success');

    if (correoLogin.value.trim() === "" || passLogin.value.trim() === "") {
        mensajeLogin.textContent = "Debes completar todos los campos ❌";
        mensajeLogin.classList.add('text-danger');
        return;
    }

    // Buscar usuario en localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuario = usuarios.find(u => u.correo === correoLogin.value.trim());

    if (!usuario) {
        mensajeLogin.textContent = "Usuario no encontrado ";
        mensajeLogin.classList.add('text-danger');
        return;
    }

    if (usuario.pass !== passLogin.value) {
        mensajeLogin.textContent = "Contraseña incorrecta ";
        mensajeLogin.classList.add('text-danger');
        return;
    }

    // ✅ Login correcto
    localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
    mensajeLogin.textContent = `¡Bienvenid@, ${usuario.nombre}! ✅`;
    mensajeLogin.classList.add('text-success');

    setTimeout(() => {
        window.location.href = "index.html";
    }, 1000);
});

// --- RECUPERAR CONTRASEÑA ---
document.getElementById("btnEnviarRecuperar").addEventListener("click", function() {
    const correo = document.getElementById("correoRecuperar").value.trim();
    const mensaje = document.getElementById("mensajeRecuperar");

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!correo) {
        mensaje.textContent = "Por favor, ingresa tu correo.";
        mensaje.className = "fw-bold text-danger";
    } else if (!gmailRegex.test(correo)) {
        mensaje.textContent = "Solo se permiten correos de Gmail ❌";
        mensaje.className = "fw-bold text-danger";
    } else {
        mensaje.textContent = "✅ Se ha enviado un enlace de recuperación a " + correo;
        mensaje.className = "fw-bold text-success";
    }
});
