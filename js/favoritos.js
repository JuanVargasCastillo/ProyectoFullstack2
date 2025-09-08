// Seleccionamos todos los botones de "Agregar a favoritos"
const botonesFav = document.querySelectorAll('.add-fav');

botonesFav.forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.card');
        const producto = {
            nombre: card.querySelector('.card-title').textContent,
            precio: card.querySelector('.card-text').textContent,
            imagen: card.querySelector('img').src
        };

        // Obtener favoritos desde localStorage
        let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

        // Evitar duplicados
        const existe = favoritos.some(p => p.nombre === producto.nombre);
        if(!existe){
            favoritos.push(producto);
            localStorage.setItem('favoritos', JSON.stringify(favoritos));
            alert(` ${producto.nombre} agregado a favoritos 🐰💖`);
        } else {
            alert(` ${producto.nombre} ya está en favoritos`);
        }

        // Actualizar contador de favoritos en la navbar
        actualizarContadorFav();
    });
});

// Función para actualizar el badge de favoritos
function actualizarContadorFav(){
    const favCount = document.getElementById('fav-count');
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    favCount.textContent = favoritos.length;
}

// Inicializar contador al cargar la página
actualizarContadorFav();
