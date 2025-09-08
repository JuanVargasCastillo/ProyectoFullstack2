document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3000/productos";
  const tablaProductos = document.getElementById("tablaProductos");
  const formProducto = document.getElementById("formProducto");
  const modalProducto = new bootstrap.Modal(document.getElementById("modalProducto"));

  let editando = false;
  let productoEditandoId = null;

  // Mapeo de hash -> categoría real
  const hashToCategoria = {
    "Hombre": "Hombre",
    "Mujer": "Mujer",
    "Niños": "Niños",
    "Accesorios": "Accesorios"
  };

  // Detectar categoría inicial desde hash (decodificando caracteres especiales)
  let categoriaSeleccionada = hashToCategoria[decodeURIComponent(window.location.hash.substring(1))] || "all";

  // Cargar productos
  async function cargarProductos() {
    try {
      const res = await fetch(API_URL);
      let productos = await res.json();

      // Filtrar por categoría seleccionada
      if (categoriaSeleccionada !== "all") {
        productos = productos.filter(p => p.categoria === categoriaSeleccionada);
      }

      renderProductosCards(productos);
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  }

  // Renderizar productos como cards
  function renderProductosCards(productos) {
    tablaProductos.innerHTML = "";

    productos.forEach(prod => {
      const stockCritico = prod.stock <= 1;
      const cardDiv = document.createElement("div");
      cardDiv.className = "col-md-3 col-sm-6 mb-4";

      cardDiv.innerHTML = `
        <div class="card shadow-sm h-100">
          <img src="${prod.imagen}" class="card-img-top" alt="${prod.nombre}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${prod.nombre}</h5>
            <p class="card-text">${prod.descripcion}</p>
            <p class="fw-bold">$${prod.precio.toLocaleString()}</p>
            ${stockCritico ? '<span class="badge bg-danger mb-2">Stock Crítico</span>' : ''}
            <p>Stock: ${prod.stock}</p>
            <small class="text-muted">Categoría: ${prod.categoria}</small>
            <div class="mt-auto d-flex justify-content-between pt-3">
              <button class="btn btn-sm btn-warning btn-editar">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-danger btn-eliminar">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      `;

      // Asignar eventos
      cardDiv.querySelector(".btn-editar").addEventListener("click", () => {
        editarProducto(prod.id, prod.nombre, prod.precio, prod.descripcion, prod.imagen, prod.categoria, prod.stock);
      });
      cardDiv.querySelector(".btn-eliminar").addEventListener("click", () => {
        eliminarProducto(prod.id);
      });

      tablaProductos.appendChild(cardDiv);
    });
  }

  // Guardar producto
  formProducto.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nuevoProducto = {
      nombre: document.getElementById("nombre").value,
      precio: parseFloat(document.getElementById("precio").value),
      descripcion: document.getElementById("descripcion").value,
      imagen: document.getElementById("imagen").value,
      categoria: document.getElementById("categoria").value,
      stock: parseInt(document.getElementById("stock").value)
    };

    try {
      if (editando) {
        await fetch(`${API_URL}/${productoEditandoId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevoProducto)
        });
        editando = false;
        productoEditandoId = null;
      } else {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevoProducto)
        });
      }
      formProducto.reset();
      modalProducto.hide();
      cargarProductos();
    } catch (error) {
      console.error("Error guardando producto:", error);
    }
  });

  // Editar producto
  window.editarProducto = (id, nombre, precio, descripcion, imagen, categoria, stock) => {
    document.getElementById("productoId").value = id;
    document.getElementById("nombre").value = nombre;
    document.getElementById("precio").value = precio;
    document.getElementById("descripcion").value = descripcion;
    document.getElementById("imagen").value = imagen;
    document.getElementById("categoria").value = categoria;
    document.getElementById("stock").value = stock;

    editando = true;
    productoEditandoId = id;
    modalProducto.show();
  };

  // Eliminar producto
  window.eliminarProducto = async (id) => {
    if (confirm("¿Seguro que deseas eliminar este producto?")) {
      try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        cargarProductos();
      } catch (error) {
        console.error("Error eliminando producto:", error);
      }
    }
  };

  // Cerrar sesión
  document.getElementById("cerrarSesion").addEventListener("click", () => {
    localStorage.removeItem("usuarioLogueado");
    alert("Sesión cerrada ✅");
    window.location.href = "index.html";
  });

  // Detectar cambios en hash (categoría)
  window.addEventListener("hashchange", () => {
    const newHash = decodeURIComponent(window.location.hash.substring(1));
    categoriaSeleccionada = hashToCategoria[newHash] || "all";
    cargarProductos();
  });

  // Inicial
  cargarProductos();
});
