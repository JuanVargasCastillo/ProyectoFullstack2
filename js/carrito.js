// js/carrito.js
function formatearPrecio(num){return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g,".");}

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
const lista = document.getElementById('listaProductos');
const cantProd = document.getElementById('cantProd');
const totalBrutoEl = document.getElementById('totalBruto');
const ahorroEl = document.getElementById('ahorro');
const subtotalEl = document.getElementById('subtotal');

const inputCupon = document.getElementById('inputCupon');
const btnCupon = document.getElementById('btnCupon');
const msgCupon = document.getElementById('msgCupon');

// Mantener cupón aplicado entre visitas
let cuponActual = localStorage.getItem('cupon') || '';
if (cuponActual) inputCupon.value = cuponActual;

function guardar(){
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function totalSinDescuento(){
  return carrito.reduce((s,p)=>s + p.precio * p.cantidad, 0);
}

function calcularAhorro(total){
  const code = (inputCupon.value || '').trim().toUpperCase();
  if (!code) return 0;
  if (code === 'CLUB10') return Math.round(total * 0.10);
  if (code === 'BIENVENIDA5') return Math.round(total * 0.05);
  return 0;
}

function render(){
  lista.innerHTML = '';
  carrito.forEach((p, i) => {
    const div = document.createElement('div');
    div.className = 'card-producto';
    div.innerHTML = `
      <img src="${p.img}" alt="${p.nombre}" style="width:80px; height:80px; object-fit:cover;">
      <div class="flex-grow-1 ms-3">
        <strong>${p.nombre}</strong><br>
        <span class="precio">$${formatearPrecio(p.precio)} c/u</span>
      </div>
      <div class="d-flex align-items-center ms-auto">
        <button class="btn btn-cantidad btn-sm me-1" data-accion="menos" data-i="${i}">-</button>
        <span class="px-2">${p.cantidad}</span>
        <button class="btn btn-cantidad btn-sm ms-1 me-3" data-accion="mas" data-i="${i}">+</button>
        <span class="precio fw-bold me-3">$${formatearPrecio(p.precio * p.cantidad)}</span>
        <button class="btn btn-sm me-0 p-0 btn-trash" data-accion="eliminar" data-i="${i}">
          <i class="bi bi-trash fs-5"></i>
        </button>
      </div>
    `;

    lista.appendChild(div);
  });

  // Totales
  const total = totalSinDescuento();
  const ahorro = calcularAhorro(total);
  const subtotal = Math.max(total - ahorro, 0);
  const cantidad = carrito.reduce((s,p)=>s+p.cantidad,0);

  cantProd.textContent = cantidad;
  totalBrutoEl.textContent = `$${formatearPrecio(total)}`;
  ahorroEl.textContent = `$${formatearPrecio(ahorro)}`;
  subtotalEl.textContent = `$${formatearPrecio(subtotal)}`;

  // Persistir estado
  guardar();
  // Guardar cupón
  localStorage.setItem('cupon', (inputCupon.value || '').trim().toUpperCase());
}

// Delegación de eventos (+, -, eliminar)
lista.addEventListener('click', (e)=>{
  const btn = e.target.closest('button');
  if(!btn) return;
  const i = parseInt(btn.dataset.i,10);
  const accion = btn.dataset.accion;

  if (accion === 'menos'){
    carrito[i].cantidad--;
    if (carrito[i].cantidad <= 0) carrito.splice(i,1);
    render();
  }
  if (accion === 'mas'){
    carrito[i].cantidad++;
    render();
  }
  if (accion === 'eliminar'){
    carrito.splice(i,1);
    render();
  }
});

// Aplicar cupón
btnCupon.addEventListener('click', () => {
  const code = (inputCupon.value || '').trim().toUpperCase();
  if (code === 'CLUB10') {
    msgCupon.textContent = 'Cupón CLUB10 aplicado: 10% de descuento.';
    msgCupon.className = 'small mt-1 msg-cupon-rosado';  // <- tu clase
  } else if (code === 'BIENVENIDA5') {
    msgCupon.textContent = 'Cupón BIENVENIDA5 aplicado: 5% de descuento.';
    msgCupon.className = 'small mt-1 msg-cupon-rosado';  // <- tu clase
  } else if (code === '') {
    msgCupon.textContent = 'Se quitó el cupón.';
    msgCupon.className = 'small mt-1 text-muted';
  } else {
    msgCupon.textContent = 'Cupón inválido.';
    msgCupon.className = 'small mt-1 text-danger';
  }
  render();
});


// Botones de acción
document.getElementById('btnSeguir').addEventListener('click', ()=> {
  window.location.href = 'index.html';
});

document.getElementById('btnPagar').addEventListener('click', ()=>{
  // Aquí iría tu flujo real de pago
  alert('Simulación: ir a pagar');
});

// Render inicial
render();
