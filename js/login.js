// Tomar elementos del DOM
const formLogin = document.getElementById('formLogin');
const correoLogin = document.getElementById('correoLogin');
const passLogin = document.getElementById('passLogin');
const mensajeLogin = document.getElementById('mensajeLogin');

// Escuchar el submit
formLogin.addEventListener('submit', function(e) {
    e.preventDefault();

    // Obtener datos guardados en localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Buscar usuario registrado
    const usuario = usuarios.find(u => u.correo === correoLogin.value);

    if (!usuario) {
        mensajeLogin.textContent = "Usuario no encontrado ❌";
        mensajeLogin.classList.add('text-danger');
        return;
    }

    if (usuario.pass !== passLogin.value) {
        mensajeLogin.textContent = "Contraseña incorrecta ❌";
        mensajeLogin.classList.add('text-danger');
        return;
    }

    // Usuario correcto
    localStorage.setItem('usuarioLogueado', JSON.stringify(usuario)); // guardar sesión
    mensajeLogin.textContent = `¡Bienvenido, ${usuario.nombre}! ✅`;
    mensajeLogin.classList.remove('text-danger');
    mensajeLogin.classList.add('text-success');

    // Redirigir a index
    setTimeout(() => {
        window.location.href = "index.html";
    }, 1000);
});
