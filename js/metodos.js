let cartCount = 0;
let favCount = 0;

// Navbar botones
document.getElementById('carrito').addEventListener('click', () => {
    alert('Viendo carrito con ' + cartCount + ' productos');
});
document.getElementById('favoritos').addEventListener('click', () => {
    alert('Viendo favoritos con ' + favCount + ' productos');
});

// Botones en productos
document.querySelectorAll('.add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
        cartCount++;
        document.getElementById('cart-count').textContent = cartCount;
        alert('Producto agregado al carrito!');
    });
});

document.querySelectorAll('.add-fav').forEach(btn => {
    btn.addEventListener('click', () => {
        favCount++;
        document.getElementById('fav-count').textContent = favCount;
        alert('Producto agregado a favoritos!');
    });
});
