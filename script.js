import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// =================== GUARDAR PRODUCTO ===================
async function guardarProducto(nombre, cantidad, foto) {
    const productosRef = collection(db, "productos");

    await addDoc(productosRef, {
        nombre: nombre,
        cantidad: cantidad,
        foto: foto
    });

    alert("Producto guardado ✔");
    cargarProductos();
}

// =================== CARGAR PRODUCTOS ===================
async function cargarProductos() {
    const productosRef = collection(db, "productos");
    const snapshot = await getDocs(productosRef);

    const contenedor = document.getElementById("listaProductos");
    contenedor.innerHTML = "";

    snapshot.forEach(doc => {
        const p = doc.data();

        contenedor.innerHTML += `
            <div class="producto">
                <h3>${p.nombre}</h3>
                <p>Cantidad: ${p.cantidad}</p>
                ${p.foto ? `<img src="${p.foto}">` : ""}
            </div>
        `;
    });
}

// =================== MANEJAR FORMULARIO ===================
document.getElementById("formInventario").addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const cantidad = document.getElementById("cantidad").value;
    const fotoInput = document.getElementById("foto");

    if (fotoInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = () => {
            const fotoBase64 = reader.result;
            guardarProducto(nombre, cantidad, fotoBase64);
        };
        reader.readAsDataURL(fotoInput.files[0]);
    } else {
        guardarProducto(nombre, cantidad, "");
    }
});

// =================== INICIO ===================
window.onload = cargarProductos;
