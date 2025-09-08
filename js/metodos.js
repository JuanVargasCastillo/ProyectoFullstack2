// js/metodos.js

// --- VARIABLES GLOBALES ---
let productosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
let cartCount = productosCarrito.reduce((s, p) => s + (p.cantidad || 0), 0);

// --- FORMATO DE PRECIO ---
function formatearPrecio(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// --- ELEMENTOS DEL DOM ---
const carritoIcon = document.getElementById('carrito');
const carritoLateral = document.getElementById('carritoLateral');
const fondoCarrito = document.getElementById('fondoCarrito');
const listaCarrito = document.getElementById('listaCarrito');
const totalCarrito = document.getElementById('totalCarrito');
const btnCerrarCarrito = document.getElementById('cerrarCarrito');
const btnVolver = document.getElementById('volver');
const btnContinuar = document.getElementById('continuar');

// Inicializa badge carrito
document.getElementById('cart-count').textContent = cartCount;

// --- FUNCIONES CARRITO ---
function cerrarCarrito() {
  carritoLateral.style.right = '-400px';
  fondoCarrito.style.display = 'none';
}

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

  totalCarrito.textContent = formatearPrecio(total);
  cartCount = productosCarrito.reduce((s, p) => s + p.cantidad, 0);
  document.getElementById('cart-count').textContent = cartCount;
  localStorage.setItem('carrito', JSON.stringify(productosCarrito));
}

// Cambiar cantidad y eliminar producto
listaCarrito.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const i = parseInt(btn.dataset.index, 10);
  const accion = btn.dataset.accion;
  if (accion === 'menos') cambiarCantidad(i, -1);
  if (accion === 'mas') cambiarCantidad(i, +1);
  if (accion === 'eliminar') eliminarProducto(i);
});

function eliminarProducto(index) {
  productosCarrito.splice(index, 1);
  actualizarCarrito();
}

function cambiarCantidad(index, delta) {
  productosCarrito[index].cantidad += delta;
  if (productosCarrito[index].cantidad <= 0) {
    eliminarProducto(index);
  } else {
    actualizarCarrito();
  }
}

// --- CARRITO LATERAL ---
carritoIcon.addEventListener('click', (e) => {
  e.preventDefault();
  carritoLateral.style.right = '0';
  fondoCarrito.style.display = 'block';
});
btnCerrarCarrito.addEventListener('click', cerrarCarrito);
fondoCarrito.addEventListener('click', cerrarCarrito);
btnVolver.addEventListener('click', cerrarCarrito);
btnContinuar.addEventListener('click', () => {
  localStorage.setItem('carrito', JSON.stringify(productosCarrito));
  window.location.href = 'carrito.html';
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

// --- FUNCIONES FAVORITOS ---
function inicializarFavoritos() {
  const botonesFav = document.querySelectorAll('.add-fav');

  botonesFav.forEach(btn => {
    const icon = btn.querySelector('i');

    // Hover efecto corazón
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

    // Click agregar a favoritos
    btn.addEventListener('click', () => {
      const card = btn.closest('.card');
      const producto = {
        nombre: card.querySelector('.card-title').textContent,
        precio: card.querySelector('.card-text').textContent,
        imagen: card.querySelector('img').src
      };

      let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
      const existe = favoritos.some(p => p.nombre === producto.nombre);

      if (!existe) {
        favoritos.push(producto);
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
        alert(` ${producto.nombre} agregado a favoritos 🐰💖`);
      } else {
        alert(` ${producto.nombre} ya está en favoritos`);
      }

      actualizarContadorFav();
    });
  });
}

function actualizarContadorFav() {
  const favCount = document.getElementById('fav-count');
  const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
  favCount.textContent = favoritos.length;
}

// Inicializa contador favoritos al cargar la página
document.addEventListener('DOMContentLoaded', actualizarContadorFav);

// --- CARGAR PRODUCTOS DESDE JSON-SERVER ---
async function cargarProductos() {
  try {
    const res = await fetch("http://localhost:3000/productos");
    const productos = await res.json();

    const contenedor = document.getElementById("contenedor-productos");
    contenedor.innerHTML = "";

    productos.forEach(prod => {
      const col = document.createElement("div");
      col.classList.add("col-md-3", "caja");

      // Botón más pequeño y corazón al lado
      col.innerHTML = `
        <div class="card h-100">
          <img src="${prod.imagen}" class="card-img-top" alt="${prod.nombre}">
          <div class="card-body text-center d-flex flex-column align-items-center">
            <h5 class="card-title">${prod.nombre}</h5>
            <p class="card-text mb-2">$${formatearPrecio(prod.precio)}</p>
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-primary add-cart">Agregar</button>
              <button class="btn btn-sm btn-outline-danger add-fav"><i class="bi bi-heart"></i></button>
            </div>
          </div>
        </div>
      `;

      contenedor.appendChild(col);
    });

    // Inicializar botones de carrito y favoritos
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

    // Inicializa favoritos en los botones recién creados
    inicializarFavoritos();

  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
}

// --- EJECUTAR AL CARGAR LA PÁGINA ---
document.addEventListener("DOMContentLoaded", () => {
  if (productosCarrito.length) actualizarCarrito();
  cargarProductos();
});
