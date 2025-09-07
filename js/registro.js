document.addEventListener("DOMContentLoaded", () => {
    const regionSelect = document.getElementById("region");
    const comunaSelect = document.getElementById("comuna");
    const passInput = document.getElementById("pass");
    const confirmPassInput = document.getElementById("confirmPass");
    const passMessage = document.getElementById("mensajePassword");
    const form = document.getElementById("formRegistro");
    const erroresDiv = document.getElementById("errores");

    const regionesYComunas = {
        "Región Metropolitana": ["Santiago", "Maipú", "Ñuñoa", "Puente Alto", "Providencia"],
        "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "Concón"],
        "Biobío": ["Concepción", "Talcahuano", "Chiguayante", "San Pedro de la Paz"],
        "Antofagasta": ["Antofagasta", "Calama", "Tocopilla"]
    };

    Object.keys(regionesYComunas).forEach(region => {
        const option = document.createElement("option");
        option.value = region;
        option.textContent = region;
        regionSelect.appendChild(option);
    });

    regionSelect.addEventListener("change", () => {
        comunaSelect.innerHTML = "<option value=''>Seleccione comuna</option>";
        const comunas = regionesYComunas[regionSelect.value] || [];
        comunas.forEach(comuna => {
            const option = document.createElement("option");
            option.value = comuna;
            option.textContent = comuna;
            comunaSelect.appendChild(option);
        });
    });

    passInput.addEventListener("input", validarPassword);
    confirmPassInput.addEventListener("input", validarPassword);

    function validarPassword() {
        const pass = passInput.value;
        const confirm = confirmPassInput.value;
        const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.{8,})/;

        if (!regex.test(pass)) {
            passMessage.textContent = "⚠️ La contraseña debe tener al menos 8 caracteres, 1 mayúscula y 1 caracter especial.";
            passMessage.style.color = "red";
            return false;
        } else if (confirm && pass !== confirm) {
            passMessage.textContent = "❌ Las contraseñas no coinciden.";
            passMessage.style.color = "red";
            return false;
        } else if (confirm && pass === confirm) {
            passMessage.textContent = "✅ Contraseña válida.";
            passMessage.style.color = "green";
            return true;
        } else {
            passMessage.textContent = "";
            return false;
        }
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        erroresDiv.textContent = "";
        erroresDiv.style.color = "red";

        const nombre = document.getElementById("nombre").value.trim();
        const correo = document.getElementById("correo").value.trim();
        const telefono = document.getElementById("telefono").value.trim();

        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const regexTelefono = /^[0-9]{9}$/;

        if (nombre === "") {
            erroresDiv.textContent = "El nombre es obligatorio.";
            return;
        }
        if (!regexEmail.test(correo)) {
            erroresDiv.textContent = "Correo inválido.";
            return;
        }
        if (!validarPassword()) {
            erroresDiv.textContent = "Corrige los errores en la contraseña.";
            return;
        }
        if (!regexTelefono.test(telefono)) {
            erroresDiv.textContent = "Teléfono inválido (debe tener 9 dígitos).";
            return;
        }
        if (regionSelect.value === "" || comunaSelect.value === "") {
            erroresDiv.textContent = "Debe seleccionar región y comuna.";
            return;
        }

        // ✅ Todo correcto, guardar en localStorage
        const nuevoUsuario = {
            nombre,
            correo,
            pass: passInput.value,
            telefono,
            region: regionSelect.value,
            comuna: comunaSelect.value
        };

        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        usuarios.push(nuevoUsuario);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        // Guardar sesión automáticamente
        localStorage.setItem("usuarioLogueado", JSON.stringify(nuevoUsuario));

        // Mostrar mensaje y redirigir
        erroresDiv.style.color = "green";
        erroresDiv.textContent = "🎉 Usuario registrado correctamente. Redirigiendo...";

        // Redirigir a index
        window.location.href = "index.html";

        // Limpiar formulario
        form.reset();
        passMessage.textContent = "";
    });
});
