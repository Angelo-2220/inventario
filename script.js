import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// =================== GUARDAR / UNIR PRODUCTO ===================
async function guardarProducto(nombre, cantidad, foto) {
    const productosRef = collection(db, "productos");

    // 1. Buscar si existe un producto con el mismo nombre
    const q = query(productosRef, where("nombre", "==", nombre));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
        // ===================
        // PRODUCTO YA EXISTE
        // ===================

        const docExistente = snapshot.docs[0];
        const datos = docExistente.data();

        const nuevaCantidad = Number(datos.cantidad) + Number(cantidad);

        await updateDoc(docExistente.ref, {
            cantidad: nuevaCantidad,
            // Si subes nueva foto, se actualiza
            foto: foto || datos.foto 
        });

        alert("Producto actualizado ✔ (cantidad sumada)");
    } else {
        // ===================
        // NO EXISTE → CREAR NUEVO
        // ===================

        await addDoc(productosRef, {
            nombre: nombre,
            cantidad: Number(cantidad),
            foto: foto || ""
        });

        alert("Producto agregado ✔");
    }

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


// =================== FORMULARIO ===================
document.getElementById("formInventario").addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
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

