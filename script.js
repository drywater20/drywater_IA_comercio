// === CONFIGURACIÓN ===
const PUBLISHABLE_KEY = 'MjUwN2JjYjUtODgzNi00ZDg5LWI0ODktMDA2NGNjNmUwMjI4NjM4OTEzNjg4NzYyMTM1Mzcw'; // ⚠️ Cambia esto
const PRICE_ID = 'price_TU_PRICE_ID_AQUÍ';       // ⚠️ Cambia esto

// === ELEMENTOS ===
const stripe = Stripe(PUBLISHABLE_KEY);
const checkoutButton = document.getElementById('checkout-button');
const clickSound = document.getElementById('click-sound');

// === SONIDO AL HACER CLIC ===
checkoutButton.addEventListener('click', () => {
  clickSound.currentTime = 0;
  clickSound.play();
});

// === PASARELA DE PAGO ===
checkoutButton.addEventListener('click', async () => {
  checkoutButton.disabled = true;
  checkoutButton.textContent = 'INICIANDO...';

  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId: PRICE_ID }),
    });

    const session = await response.json();

    if (response.ok) {
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        alert('Error: ' + result.error.message);
      }
    } else {
      throw new Error(session.error || 'Error en el servidor');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('❌ Conexión fallida. Intenta más tarde.');
  } finally {
    checkoutButton.disabled = false;
    checkoutButton.textContent = 'PAGAR CON IA';
  }
});