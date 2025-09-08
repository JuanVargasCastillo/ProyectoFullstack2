document.addEventListener("DOMContentLoaded", () => {

  // Mostrar la sección correspondiente
  window.mostrarSeccion = (seccion) => {
    const secciones = ["inicio"];
    secciones.forEach(s => {
      const elem = document.getElementById(`seccion${s.charAt(0).toUpperCase() + s.slice(1)}`);
      if(elem) elem.classList.add("d-none");
    });
    const mostrar = document.getElementById(`seccion${seccion.charAt(0).toUpperCase() + seccion.slice(1)}`);
    if(mostrar) mostrar.classList.remove("d-none");
  };

  // Botón cerrar sesión
  document.getElementById("cerrarSesion").addEventListener("click", () => {
    localStorage.removeItem("usuarioLogueado");
    alert("Sesión cerrada ✅");
    window.location.href = "index.html";
  });

  // Inicio visible al abrir
  mostrarSeccion('inicio');
});
