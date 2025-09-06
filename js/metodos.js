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
