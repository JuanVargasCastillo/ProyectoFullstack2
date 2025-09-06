let cartCount = 0;
let favCount = 0;

// --- NAVBAR ---
// Carrito
document.getElementById('carrito').addEventListener('click', (e) => {
    e.preventDefault();
    alert('Viendo carrito con ' + cartCount + ' productos');
});

// Favoritos
document.getElementById('favoritos').addEventListener('click', (e) => {
    e.preventDefault();
    alert('Viendo favoritos con ' + favCount + ' productos');
});

// --- PRODUCTOS ---
// Botones "Comprar"
document.querySelectorAll('.add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
        cartCount++;
        document.getElementById('cart-count').textContent = cartCount;
        alert('Producto agregado al carrito ✅');
    });
});

// Botones "Favorito"
document.querySelectorAll('.add-fav').forEach(btn => {
    btn.addEventListener('click', () => {
        favCount++;
        document.getElementById('fav-count').textContent = favCount;
        alert('Producto agregado a favoritos ❤️');
    });
});

// --- EXTRA ---
// Evitar que los <a href="#"> recarguen la página
document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', e => e.preventDefault());
});

// --- USUARIO LOGUEADO ---
document.addEventListener("DOMContentLoaded", () => {
    const usuarioLog = JSON.parse(localStorage.getItem('usuarioLogueado'));

    // Detectar botones de login y registro por clase
    const loginBtn = document.querySelector('a.btn-outline-primary');
    const registroBtn = document.querySelector('a.btn-success');

    if (usuarioLog) {
        // Ocultar botones Iniciar Sesión y Registrarse
        if (loginBtn) loginBtn.style.display = "none";
        if (registroBtn) registroBtn.style.display = "none";

        // Mostrar mensaje de bienvenida
        const navbar = loginBtn.closest('ul.navbar-nav');
        const mensaje = document.createElement("li");
        mensaje.classList.add("nav-item", "me-3");
        mensaje.innerHTML = `<span class="nav-link">¡Bienvenid@, ${usuarioLog.nombre}!</span>`;
        navbar.insertBefore(mensaje, navbar.firstChild);

        // Botón Cerrar Sesión
        const cerrar = document.createElement("li");
        cerrar.classList.add("nav-item");
        cerrar.innerHTML = `<button class="btn btn-danger" id="cerrarSesion">Cerrar Sesión</button>`;
        navbar.appendChild(cerrar);

        document.getElementById("cerrarSesion").addEventListener("click", () => {
            localStorage.removeItem("usuarioLogueado");
            location.reload();
        });
    }
});
