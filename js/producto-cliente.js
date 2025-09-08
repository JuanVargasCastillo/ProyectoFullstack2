// js/producto-cliente.js

const btnAgregar = document.getElementById('btn-agregar');
const btnFavorito = document.getElementById('btn-favorito');

const params = new URLSearchParams(window.location.search);
const idProducto = params.get('id');

async function cargarProducto() {
  try {
    const res = await fetch("http://localhost:3000/productos");
    const productos = await res.json();
    const producto = productos.find(p => p.id == idProducto);

    if (!producto) {
      document.querySelector('.container').innerHTML = '<p class="text-center">Producto no encontrado</p>';
      return;
    }

    document.getElementById('producto-img').src = producto.imagen;
    document.getElementById('producto-nombre').textContent = producto.nombre;
    document.getElementById('producto-precio').textContent = '$' + formatearPrecio(producto.precio);
    document.getElementById('producto-descripcion').textContent = producto.descripcion || 'Sin descripción disponible';

    // --- AGREGAR AL CARRITO ---
    btnAgregar.addEventListener('click', () => {
      const prodCarrito = productosCarrito.find(p => p.nombre === producto.nombre);
      if (prodCarrito) prodCarrito.cantidad++;
      else productosCarrito.push({ nombre: producto.nombre, precio: producto.precio, img: producto.imagen, cantidad: 1 });

      actualizarCarrito();
      carritoLateral.style.right = '0';
      fondoCarrito.style.display = 'block';

      btnAgregar.innerHTML = `<i class="bi bi-check-circle me-1"></i> Agregado`;
      setTimeout(() => {
        btnAgregar.innerHTML = `<i class="bi bi-cart3 me-1"></i> Agregar`;
      }, 1000);
    });

    // --- AGREGAR A FAVORITOS ---
    btnFavorito.addEventListener('click', () => {
      let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
      const existe = favoritos.some(p => p.nombre === producto.nombre);

      if (!existe) {
        favoritos.push({ nombre: producto.nombre, precio: producto.precio, imagen: producto.imagen });
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
        alert(`${producto.nombre} agregado a favoritos 🐰💖`);
      } else {
        alert(`${producto.nombre} ya está en favoritos`);
      }

      actualizarContadorFav();
    });

    // --- Hover efecto corazón ---
    btnFavorito.addEventListener('mouseenter', () => {
      btnFavorito.classList.replace('bi-heart', 'bi-heart-fill');
      btnFavorito.style.color = '#ff5c8d';
    });

    btnFavorito.addEventListener('mouseleave', () => {
      const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
      if (!favoritos.some(p => p.nombre === producto.nombre)) {
        btnFavorito.classList.replace('bi-heart-fill', 'bi-heart');
        btnFavorito.style.color = '#f8a9c4'; 
      }
    });

  } catch (error) {
    console.error("Error al cargar el producto:", error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  cargarProducto();
  actualizarContadorFav(); // Inicializa contador favoritos en navbar
});
