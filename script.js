const form = document.getElementById('formProducto');
const tabla = document.querySelector('#tabla tbody');
const buscar = document.getElementById('buscar');
const indiceEditar = document.getElementById('indiceEditar');

let inventario = JSON.parse(localStorage.getItem('inventario')) || [];

function guardarInventario() {
  localStorage.setItem('inventario', JSON.stringify(inventario));
}

function mostrarInventario(filtro = '') {
  tabla.innerHTML = '';
  inventario
    .filter(item => item.nombre.toLowerCase().includes(filtro.toLowerCase()))
    .forEach((item, index) => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${item.nombre}</td>
        <td>${item.cantidad}</td>
        <td>${item.foto ? `<img src="${item.foto}" alt="Foto">` : '—'}</td>
        <td class="acciones">
          <button onclick="editar(${index})">✏️ Editar</button>
          <button class="eliminar" onclick="eliminar(${index})">🗑️ Eliminar</button>
        </td>
      `;
      tabla.appendChild(fila);
    });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value;
  const cantidad = document.getElementById('cantidad').value;
  const fotoInput = document.getElementById('foto');
  const indice = indiceEditar.value;
  const reader = new FileReader();

  const guardarProducto = (fotoBase64) => {
    const producto = { nombre, cantidad, foto: fotoBase64 || '' };

    if (indice !== '') {
      inventario[indice] = producto;
      indiceEditar.value = '';
    } else {
      inventario.push(producto);
    }

    guardarInventario();
    mostrarInventario();
    form.reset();
  };

  if (fotoInput.files[0]) {
    reader.onload = function(event) {
      guardarProducto(event.target.result);
    };
    reader.readAsDataURL(fotoInput.files[0]);
  } else {
    guardarProducto(indice !== '' ? inventario[indice].foto : '');
  }
});

function editar(index) {
  const item = inventario[index];
  document.getElementById('nombre').value = item.nombre;
  document.getElementById('cantidad').value = item.cantidad;
  indiceEditar.value = index;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function eliminar(index) {
  if (confirm("¿Seguro que deseas eliminar este producto?")) {
    inventario.splice(index, 1);
    guardarInventario();
    mostrarInventario();
  }
}

buscar.addEventListener('input', () => {
  mostrarInventario(buscar.value);
});

mostrarInventario();
