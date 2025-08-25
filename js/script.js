// Carrito de compras
let carrito = [];
const btnCarrito = document.getElementById('btn-carrito');
const modalCarrito = document.getElementById('modal-carrito');
const cerrarCarrito = document.getElementById('cerrar-carrito');
const listaCarrito = document.getElementById('lista-carrito');
const totalCarrito = document.getElementById('total-carrito');
const btnPagar = document.getElementById('btn-pagar');

// Abrir/cerrar modal
btnCarrito.addEventListener('click', () => {
  actualizarCarrito();
  modalCarrito.style.display = 'block';
});
cerrarCarrito.addEventListener('click', () => {
  modalCarrito.style.display = 'none';
});
window.addEventListener('click', (e) => {
  if (e.target === modalCarrito) {
    modalCarrito.style.display = 'none';
  }
});

// Agregar al carrito
document.querySelectorAll('.btn-add').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-id');
    const precio = parseFloat(btn.getAttribute('data-precio'));
    const nombre = btn.parentElement.querySelector('h3').textContent;

    const itemExistente = carrito.find(item => item.id === id);
    if (itemExistente) {
      alert('Este producto ya está en el carrito');
      return;
    }

    carrito.push({ id, nombre, precio });
    actualizarCarrito();
    alert(`${nombre} agregado al carrito`);
  });
});

// Actualizar vista del carrito
function actualizarCarrito() {
  listaCarrito.innerHTML = '';
  if (carrito.length === 0) {
    listaCarrito.innerHTML = '<p>Tu carrito está vacío</p>';
    btnPagar.disabled = true;
    totalCarrito.innerHTML = '<strong>Total: $0.00</strong>';
    return;
  }

  let total = 0;
  carrito.forEach(item => {
    const div = document.createElement('div');
    div.innerHTML = `
      <p>${item.nombre} - $${item.precio.toFixed(2)} 
      <button class="btn-eliminar" data-id="${item.id}">Eliminar</button></p>
    `;
    listaCarrito.appendChild(div);
    total += item.precio;
  });

  totalCarrito.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
  btnPagar.disabled = false;

  // Eliminar
  document.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      carrito = carrito.filter(item => item.id !== id);
      actualizarCarrito();
    });
  });
}

// Pagar con Stripe
btnPagar.addEventListener('click', async () => {
  const total = carrito.reduce((sum, item) => sum + item.precio, 0);
  try {
    const response = await fetch('/.netlify/functions/create-checkout', {
      method: 'POST',
      body: JSON.stringify({ price: total })
    });

    const { sessionId } = await response.json();
    const stripe = Stripe('MjUwN2JjYjUtODgzNi00ZDg5LWI0ODktMDA2NGNjNmUwMjI4NjM4OTEzNjg4NzYyMTM1Mzcw'); // ← Reemplaza con tu clave real
    stripe.redirectToCheckout({ sessionId });
  } catch (error) {
    alert('Error al procesar el pago: ' + error.message);
  }
});