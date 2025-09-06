// Variables del formulario
const form = document.getElementById('formRegistro');
const nombre = document.getElementById('nombre');
const correo = document.getElementById('correo');
const pass = document.getElementById('pass');
const confirmPass = document.getElementById('confirmPass');
const telefono = document.getElementById('telefono');
const regionSelect = document.getElementById('region');
const comunaSelect = document.getElementById('comuna');
const errores = document.getElementById('errores');

// Expresiones regulares
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regexTelefono = /^[0-9]{9}$/; // teléfono chileno 9 dígitos

// Cargar regiones desde API
fetch('https://apis.digital.gob.cl/dpa/regiones')
  .then(response => response.json())
  .then(data => {
      data.forEach(region => {
          let option = document.createElement('option');
          option.value = region.codigo;
          option.textContent = region.nombre;
          regionSelect.appendChild(option);
      });
  })
  .catch(error => console.error('Error cargando regiones:', error));

// Cargar comunas según región
regionSelect.addEventListener('change', () => {
    let regionCodigo = regionSelect.value;
    comunaSelect.innerHTML = '<option value="">Seleccione comuna</option>'; // limpiar
    if(regionCodigo === '') return;

    fetch(`https://apis.digital.gob.cl/dpa/comunas`)
        .then(res => res.json())
        .then(data => {
            const comunasRegion = data.filter(c => c.codigo.substring(0,2) === regionCodigo);
            comunasRegion.forEach(comuna => {
                let option = document.createElement('option');
                option.value = comuna.codigo;
                option.textContent = comuna.nombre;
                comunaSelect.appendChild(option);
            });
        });
});

// Validar formulario al enviar
form.addEventListener('submit', function(e){
    e.preventDefault();
    errores.innerHTML = '';
    let mensajes = [];

    if(nombre.value.trim() === '') mensajes.push('El nombre es obligatorio.');
    if(!regexEmail.test(correo.value.trim())) mensajes.push('Correo inválido.');
    if(pass.value.length < 8) mensajes.push('La contraseña debe tener al menos 8 caracteres.');
    if(pass.value !== confirmPass.value) mensajes.push('Las contraseñas no coinciden.');
    if(!regexTelefono.test(telefono.value.trim())) mensajes.push('Teléfono inválido (9 dígitos).');
    if(regionSelect.value === '') mensajes.push('Debe seleccionar una región.');
    if(comunaSelect.value === '') mensajes.push('Debe seleccionar una comuna.');

    if(mensajes.length > 0){
        errores.innerHTML = mensajes.join('<br>');
    } else {
        alert('Registro exitoso ✔️');
        form.reset();
        comunaSelect.innerHTML = '<option value="">Seleccione comuna</option>'; // reset comunas
    }
});
