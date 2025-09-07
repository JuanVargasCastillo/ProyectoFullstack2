document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("productosContainer");
  const formAgregar = document.getElementById("formAgregarProducto");
  const url = "http://localhost:3000/productos";

  const modalEditar = new bootstrap.Modal(document.getElementById("modalEditarProducto"));
  const formEditar = document.getElementById("formEditarProducto");

  function cargarProductos() {
    contenedor.innerHTML = "";
    fetch(url)
      .then(res => res.json())
      .then(productos => {
        productos.forEach(p => {
          const card = document.createElement("div");
          card.className = "col-sm-6 col-md-4 col-lg-3";
          card.innerHTML = `
            <div class="card h-100">
              <img src="${p.imagen}" class="card-img-top" alt="${p.nombre}" onerror="this.src='img/default.png'">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">${p.nombre}</h5>
                <p class="card-text">Precio: $${p.precio}</p>
                <p class="card-text">Categoría: ${p.categoria}</p>
                <div class="mt-auto d-flex justify-content-between">
                  <button class="btn btn-warning btn-sm btn-editar">Editar</button>
                  <button class="btn btn-danger btn-sm btn-eliminar">Eliminar</button>
                </div>
              </div>
            </div>
          `;

          card.querySelector(".btn-eliminar").addEventListener("click", () => {
            if (confirm(`¿Eliminar "${p.nombre}"?`)) {
              fetch(`${url}/${p.id}`, { method: "DELETE" })
                .then(() => cargarProductos())
                .catch(err => console.error(err));
            }
          });

          card.querySelector(".btn-editar").addEventListener("click", () => {
            document.getElementById("idEditarProducto").value = p.id;
            document.getElementById("nombreEditar").value = p.nombre;
            document.getElementById("precioEditar").value = p.precio;
            document.getElementById("categoriaEditar").value = p.categoria;
            document.getElementById("imagenEditar").value = p.imagen;
            modalEditar.show();
          });

          contenedor.appendChild(card);
        });
      })
      .catch(err => console.error("Error al cargar productos:", err));
  }

  // Agregar producto
  formAgregar.addEventListener("submit", e => {
    e.preventDefault();
    const nombre = document.getElementById("nombreProducto").value.trim();
    const precio = Number(document.getElementById("precioProducto").value);
    const categoria = document.getElementById("categoriaProducto").value.trim();
    const imagen = document.getElementById("imagenProducto").value.trim();

    if (!nombre || !precio || !categoria) return alert("Completa todos los campos.");

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, precio, categoria, imagen })
    })
    .then(() => {
      formAgregar.reset();
      cargarProductos();
    })
    .catch(err => console.error(err));
  });

  // Editar producto con modal
  formEditar.addEventListener("submit", e => {
    e.preventDefault();
    const id = document.getElementById("idEditarProducto").value;
    const nombre = document.getElementById("nombreEditar").value.trim();
    const precio = Number(document.getElementById("precioEditar").value);
    const categoria = document.getElementById("categoriaEditar").value.trim();
    const imagen = document.getElementById("imagenEditar").value.trim();

    fetch(`${url}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, precio, categoria, imagen })
    })
    .then(() => {
      modalEditar.hide();
      cargarProductos();
    })
    .catch(err => console.error(err));
  });

  cargarProductos();
});
