// js/metodos.js
let favCount = 0;

// --- CARGA INICIAL DESDE LOCALSTORAGE ---
let productosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
let cartCount = productosCarrito.reduce((s, p) => s + (p.cantidad || 0), 0);

// --- FORMATO DE PRECIO ---
function formatearPrecio(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// --- NAVBAR ---
const carritoIcon = document.getElementById('carrito');
const carritoLateral = document.getElementById('carritoLateral');
const fondoCarrito = document.getElementById('fondoCarrito');
const listaCarrito = document.getElementById('listaCarrito');
const totalCarrito = document.getElementById('totalCarrito');
const btnCerrarCarrito = document.getElementById('cerrarCarrito');
const btnVolver = document.getElementById('volver');
const btnContinuar = document.getElementById('continuar');

// Pinta el badge inicial
document.getElementById('cart-count').textContent = cartCount;

// Abrir/cerrar carrito lateral
carritoIcon.addEventListener('click', (e) => {
  e.preventDefault();
  carritoLateral.style.right = '0';
  fondoCarrito.style.display = 'block';
});

btnCerrarCarrito.addEventListener('click', cerrarCarrito);
fondoCarrito.addEventListener('click', cerrarCarrito);
btnVolver.addEventListener('click', cerrarCarrito);

function cerrarCarrito() {
  carritoLateral.style.right = '-400px';
  fondoCarrito.style.display = 'none';
}

// Continuar a carrito completo
btnContinuar.addEventListener('click', () => {
  localStorage.setItem('carrito', JSON.stringify(productosCarrito));
  window.location.href = 'carrito.html';
});

// --- PRODUCTOS ---
// Botones "Comprar"
document.querySelectorAll('.add-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.card');
    const nombre = card.querySelector('.card-title').innerText;
    const precio = parseInt(card.querySelector('.card-text').innerText.replace(/\D/g, ''));
    const img = card.querySelector('img').src;

    const prod = productosCarrito.find(p => p.nombre === nombre);
    if (prod) {
      prod.cantidad++;
    } else {
      productosCarrito.push({ nombre, precio, img, cantidad: 1 });
    }

    actualizarCarrito();
    carritoLateral.style.right = '0';
    fondoCarrito.style.display = 'block';
  });
});



// --- ACTUALIZAR CARRITO ---
function actualizarCarrito() {
  listaCarrito.innerHTML = '';
  let total = 0;

  productosCarrito.forEach((producto, index) => {
    const li = document.createElement('li');
    li.classList.add('d-flex', 'align-items-center', 'mb-3');

    li.innerHTML = `
      <img src="${producto.img}" alt="${producto.nombre}" style="width:60px; height:60px; object-fit:cover; margin-right:10px;">
      <div class="flex-grow-1">
        <strong>${producto.nombre}</strong><br>
        $${formatearPrecio(producto.precio)}
      </div>
      <div class="d-flex align-items-center">
        <button class="btn btn-cantidad me-1" data-accion="menos" data-index="${index}">-</button>
        <span class="px-2">${producto.cantidad}</span>
        <button class="btn btn-cantidad ms-1" data-accion="mas" data-index="${index}">+</button>
        <button class="btn btn-eliminar ms-2" data-accion="eliminar" data-index="${index}">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `;
    listaCarrito.appendChild(li);

    total += producto.precio * producto.cantidad;
  });

  totalCarrito.textContent = `${formatearPrecio(total)}`;

  cartCount = productosCarrito.reduce((s, p) => s + p.cantidad, 0);
  document.getElementById('cart-count').textContent = cartCount;
  localStorage.setItem('carrito', JSON.stringify(productosCarrito));
}

// Delegación de eventos (+, -, eliminar)
listaCarrito.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const i = parseInt(btn.dataset.index, 10);
  const accion = btn.dataset.accion;
  if (accion === 'menos') cambiarCantidad(i, -1);
  if (accion === 'mas') cambiarCantidad(i, +1);
  if (accion === 'eliminar') eliminarProducto(i);
});

// --- ELIMINAR PRODUCTO ---
function eliminarProducto(index) {
  productosCarrito.splice(index, 1);
  actualizarCarrito();
}

// --- CAMBIAR CANTIDAD ---
function cambiarCantidad(index, delta) {
  productosCarrito[index].cantidad += delta;
  if (productosCarrito[index].cantidad <= 0) {
    eliminarProducto(index);
  } else {
    actualizarCarrito();
  }
}

// --- BLOQUEA LINKS VACÍOS ---
document.querySelectorAll('a[href="#"]').forEach(link => {
  link.addEventListener('click', e => e.preventDefault());
});

// --- USUARIO LOGUEADO ---
document.addEventListener("DOMContentLoaded", () => {
  if (productosCarrito.length) actualizarCarrito();

  const usuarioLog = JSON.parse(localStorage.getItem('usuarioLogueado'));
  const loginBtn = document.querySelector('a.btn-outline-primary');
  const registroBtn = document.querySelector('a.btn-success');

  if (usuarioLog) {
    if (loginBtn) loginBtn.style.display = "none";
    if (registroBtn) registroBtn.style.display = "none";

    const navbar = loginBtn.closest('ul.navbar-nav');
    const mensaje = document.createElement("li");
    mensaje.classList.add("nav-item", "me-3");
    mensaje.innerHTML = `<span class="nav-link">¡Bienvenid@, ${usuarioLog.nombre}!</span>`;
    navbar.insertBefore(mensaje, navbar.firstChild);

    const cerrar = document.createElement("li");
    cerrar.classList.add("nav-item");
    cerrar.innerHTML = `<button class="btn btn-cerrar-sesion" id="cerrarSesion">Cerrar Sesión</button>`;
    navbar.appendChild(cerrar);


    document.getElementById("cerrarSesion").addEventListener("click", () => {
      localStorage.removeItem("usuarioLogueado");
      location.reload();
    });
  }
});

// --- EFECTO FAVORITOS (corazón relleno al hover) ---
document.querySelectorAll('.add-fav').forEach(btn => {
  const icon = btn.querySelector('i');

  btn.addEventListener('mouseenter', () => {
    icon.classList.remove('bi-heart');
    icon.classList.add('bi-heart-fill');
    icon.style.color = '#ff5c8d';
  });

  btn.addEventListener('mouseleave', () => {
    icon.classList.remove('bi-heart-fill');
    icon.classList.add('bi-heart');
    icon.style.color = '#f8a9c4';
  });
});
