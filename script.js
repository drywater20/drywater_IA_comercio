let obras = [];
let currentImageIndex = 0;

// === Cargar obras desde obras.json ===
async function cargarObras() {
  try {
    const response = await fetch('obras.json');
    if (!response.ok) throw new Error('No se pudo cargar obras.json');
    obras = await response.json();
    renderizarGaleria();
  } catch (error) {
    console.error('Error al cargar las obras:', error);
    document.getElementById('gallery').innerHTML = '<p>⚠️ Error al cargar las imágenes.</p>';
  }
}

// === Renderizar galería de productos ===
function renderizarGaleria() {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';

  obras.forEach((obra, index) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-style', obra.estilo);

    card.innerHTML = `
      <img src="${obra.imagen}" alt="${obra.titulo}" loading="lazy">
      <h3>${obra.titulo}</h3>
      <p class="price">Desde $${obra.precio?.toFixed(2) || '20.00'}</p>
      <button class="snipcart-add-item"
        data-item-id="${obra.id || obra.titulo}"
        data-item-name="${obra.titulo}"
        data-item-price="${obra.precio || 20}"
        data-item-image="${obra.imagen}"
        data-item-url="/"
        data-item-description="${obra.descripcion || 'Arte marino generado por IA'}">
        Añadir al carrito
      </button>
    `;
    gallery.appendChild(card);

    // Abrir lightbox al hacer clic en la imagen
    card.querySelector('img').onclick = () => openLightbox(index);
  });
}

// === Lightbox: abrir, cambiar, cerrar ===
function openLightbox(index) {
  currentImageIndex = index;
  const img = document.getElementById('lightbox-img');
  img.src = obras[currentImageIndex].imagen;
  document.getElementById('lightbox').style.display = 'block';
}

function closeLightbox() {
  document.getElementById('lightbox').style.display = 'none';
}

function changeImage(direction) {
  currentImageIndex = (currentImageIndex + direction + obras.length) % obras.length;
  document.getElementById('lightbox-img').src = obras[currentImageIndex].imagen;
}

// === Filtrar productos por estilo ===
function filterProducts() {
  const filter = document.getElementById('style-filter').value;
  const cards = document.querySelectorAll('.product-card');

  cards.forEach((card, index) => {
    const style = obras[index].estilo;
    if (filter === 'all' || style === filter) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// === Cambiar idioma ===
function changeLanguage() {
  const lang = document.getElementById('lang-select').value;
  const translations = {
    es: { title: "Galería de Arte", subtitle: "Disfruta de una colección única de arte marino.", comment: "Comentarios:", send: "Enviar" },
    en: { title: "Art Gallery", subtitle: "Enjoy a unique collection of marine art.", comment: "Comments:", send: "Send" },
    fr: { title: "Galerie d'Art", subtitle: "Profitez d'une collection unique d'art marin.", comment: "Commentaires :", send: "Envoyer" },
    ja: { title: "アートギャラリー", subtitle: "ユニークなマリンアートのコレクションをお楽しみください。", comment: "コメント：", send: "送信" }
  };

  const t = translations[lang];
  if (t) {
    document.querySelector('header h1').textContent = t.title;
    document.querySelector('header p').textContent = t.subtitle;
    document.querySelector('.comments-section h2').textContent = t.comment;
    document.querySelector('.comments-section button').textContent = t.send;
  }
}

// === Enviar comentario ===
function submitComment() {
  const comment = document.getElementById('comment').value;
  if (comment.trim()) {
    alert("Gracias por tu comentario. ¡Lo tendremos en cuenta!");
    document.getElementById('comment').value = '';
  } else {
    alert("Por favor, escribe un comentario.");
  }
}

// === Cargar todo al inicio ===
document.addEventListener('DOMContentLoaded', () => {
  cargarObras();

  // Navegación con teclado
  document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox.style.display === 'block') {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') changeImage(1);
      if (e.key === 'ArrowLeft') changeImage(-1);
    }
  });
});