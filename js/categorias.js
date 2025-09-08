// js/categorias.js
document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3000/productos"; // json-server devuelve array directo
  const contenedor = document.getElementById("contenedor-productos");
  const titulo = document.getElementById("tituloCategoria");

  if (typeof productosCarrito === 'undefined') {
    window.productosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
  }

  // Obtener categoría por query (?categoria=Mujer) o hash (#Mujer)
  const params = new URLSearchParams(window.location.search);
  let categoria = params.get("categoria");
  if (!categoria && window.location.hash) {
    categoria = decodeURIComponent(window.location.hash.substring(1));
  }
  if (categoria) categoria = categoria.trim();

  const normalize = s => s ? s.toString().toLowerCase() : s;

  async function cargarYFiltrar() {
    try {
      const res = await fetch(API_URL);
      const productos = await res.json(); // array directo
      let lista = productos;

      if (categoria) {
        lista = productos.filter(p => normalize(p.categoria) === normalize(categoria));
        titulo.textContent = `Categoría: ${categoria}`;
      } else {
        titulo.textContent = "Todos los productos";
      }

      renderProductos(lista);
    } catch (err) {
      console.error("Error cargando productos (categorias.js):", err);
      contenedor.innerHTML = `<div class="col-12"><p class="text-danger">Error cargando productos.</p></div>`;
    }
  }

  function renderProductos(productos) {
    contenedor.innerHTML = "";

    if (!productos || productos.length === 0) {
      contenedor.innerHTML = `<div class="col-12"><p>No hay productos en esta categoría.</p></div>`;
      if (typeof actualizarContadorFav === 'function') actualizarContadorFav();
      if (typeof actualizarCarrito === 'function') actualizarCarrito();
      return;
    }

    productos.forEach(prod => {
      const col = document.createElement("div");
      col.className = "col-md-3 col-sm-6 mb-4";

      col.innerHTML = `
        <div class="card h-100">
          <img src="${prod.imagen}" class="card-img-top producto-img" alt="${prod.nombre}" style="cursor:pointer;">
          <div class="card-body text-center d-flex flex-column">
            <h5 class="card-title">${prod.nombre}</h5>
            <p class="card-text mb-2">${prod.descripcion || ''}</p>
            <p class="fw-bold">$${(prod.precio).toLocaleString()}</p>
            ${prod.stock <= 1 ? '<span class="badge bg-danger mb-2">¡Últimas unidades!</span>' : ''}
            <p class="text-muted">Stock: ${prod.stock ?? 'N/A'}</p>
            <small class="text-muted">Categoría: ${prod.categoria}</small>
            <div class="d-flex gap-2 mt-auto">
              <button class="btn btn-sm btn-primary add-cart">Agregar</button>
              <button class="btn btn-sm btn-outline-danger add-fav"><i class="bi bi-heart"></i></button>
            </div>
          </div>
        </div>
      `;

      // Click en la imagen → página detalle
      col.querySelector('.producto-img').addEventListener('click', () => {
        window.location.href = `producto-cliente.html?id=${prod.id}`;
      });

      contenedor.appendChild(col);
    });

    // Inicializar botones carrito
    document.querySelectorAll('.add-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.card');
        const nombre = card.querySelector('.card-title').innerText;
        const precio = parseInt(card.querySelector('.fw-bold').innerText.replace(/\D/g, '')) || 0;
        const img = card.querySelector('img').src;

        const existente = productosCarrito.find(p => p.nombre === nombre);
        if (existente) {
          existente.cantidad++;
        } else {
          productosCarrito.push({ nombre, precio, img, cantidad: 1 });
        }

        localStorage.setItem('carrito', JSON.stringify(productosCarrito));
        if (typeof actualizarCarrito === 'function') actualizarCarrito();

        const carritoLateral = document.getElementById('carritoLateral');
        const fondoCarrito = document.getElementById('fondoCarrito');
        if (carritoLateral) carritoLateral.style.right = '0';
        if (fondoCarrito) fondoCarrito.style.display = 'block';
      });
    });

    // Inicializar favoritos
    if (typeof inicializarFavoritos === 'function') {
      inicializarFavoritos();
    } else if (typeof actualizarContadorFav === 'function') {
      actualizarContadorFav();
    }

    if (typeof actualizarCarrito === 'function') actualizarCarrito();
    if (typeof actualizarContadorFav === 'function') actualizarContadorFav();
  }

  cargarYFiltrar();
});
