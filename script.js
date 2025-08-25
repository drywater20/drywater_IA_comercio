// Reemplaza con tu clave pública de Stripe (empieza con pk_test_...)
const PUBLISHABLE_KEY = 'pk_test_MjUwN2JjYjUtODgzNi00ZDg5LWI0ODktMDA2NGNjNmUwMjI4NjM4OTEzNjg4NzYyMTM1Mzcw'; 

// Reemplaza con el Price ID de tu producto (en Products en Stripe)
const PRICE_ID = 'price_XXXXXXXXXXXXXXXXXXXXXXX';

const stripe = Stripe(PUBLISHABLE_KEY);
const checkoutButton = document.getElementById('checkout-button');

checkoutButton.addEventListener('click', async () => {
  checkoutButton.disabled = true;
  checkoutButton.textContent = 'Procesando...';

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
      throw new Error(session.error || 'Error al crear la sesión');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Hubo un problema. Intenta más tarde.');
  } finally {
    checkoutButton.disabled = false;
    checkoutButton.textContent = 'Acceder por $19.99/mes';
  }
});