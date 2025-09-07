document.addEventListener("DOMContentLoaded", () => {
  // Simular datos dinámicos
  const totalUsuarios = 120;
  const totalProductos = 85;
  const totalPedidos = 45;
  const totalVentas = 1250000;

  document.getElementById("totalUsuarios").textContent = totalUsuarios;
  document.getElementById("totalProductos").textContent = totalProductos;
  document.getElementById("totalPedidos").textContent = totalPedidos;
  document.getElementById("totalVentas").textContent = "$" + totalVentas.toLocaleString();

  // Botón cerrar sesión
  document.getElementById("cerrarSesion").addEventListener("click", () => {
    localStorage.removeItem("usuarioLogueado");
    alert("Sesión cerrada ✅");
    window.location.href = "index.html";
  });
});
