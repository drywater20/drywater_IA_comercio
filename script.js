// === Traducciones por idioma ===
const traducciones = {
  es: {
    title: "Galería de Arte",
    subtitle: "Disfruta de una colección única de arte marino.",
    langLabel: "Idioma:",
    filterLabel: "Filtrar por estilo:",
    commentTitle: "Comentarios:",
    sendButton: "Enviar"
  },
  en: {
    title: "Art Gallery",
    subtitle: "Enjoy a unique collection of marine art.",
    langLabel: "Language:",
    filterLabel: "Filter by style:",
    commentTitle: "Comments:",
    sendButton: "Send"
  },
  fr: {
    title: "Galerie d'Art",
    subtitle: "Profitez d'une collection unique d'art marin.",
    langLabel: "Langue:",
    filterLabel: "Filtrer par style:",
    commentTitle: "Commentaires:",
    sendButton: "Envoyer"
  },
  ja: {
    title: "アートギャラリー",
    subtitle: "ユニークなマリンアートのコレクションをお楽しみください。",
    langLabel: "言語:",
    filterLabel: "スタイルでフィルター：",
    commentTitle: "コメント：",
    sendButton: "送信"
  }
};

// === Cambiar idioma y guardar selección ===
function changeLanguage() {
  const lang = document.getElementById('lang-select').value;
  const t = traducciones[lang];

  if (!t) return;

  document.getElementById('main-title').textContent = t.title;
  document.getElementById('main-subtitle').textContent = t.subtitle;
  document.getElementById('lang-label').textContent = t.langLabel;
  document.getElementById('filter-label').textContent = t.filterLabel;
  document.getElementById('comment-title').textContent = t.commentTitle;
  document.getElementById('send-btn').textContent = t.sendButton;

  // Guardar preferencia
  localStorage.setItem('selected-lang', lang);
}

// === Cargar obras desde obras.json ===
let obras = [];
let currentImageIndex = 0;

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

    // Abrir lightbox al hacer clic
    card.querySelector('img').onclick = () => openLightbox(index);
  });
}

// === Lightbox: zoom y navegación ===
function openLightbox(index) {
  currentImageIndex = index;
  document.getElementById('lightbox-img').src = obras[currentImageIndex].imagen;
  document.getElementById('lightbox').style.display = 'block';
}

function closeLightbox() {
  document.getElementById('lightbox').style.display = 'none';
}

function changeImage(direction) {
  currentImageIndex = (currentImageIndex + direction + obras.length) % obras.length;
  document.getElementById('lightbox-img').src = obras[currentImageIndex].imagen;
}

// === Filtrar productos ===
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

// === Inicializar todo al cargar ===
document.addEventListener('DOMContentLoaded', () => {
  // Idioma guardado
  const savedLang = localStorage.getItem('selected-lang') || 'es';
  document.getElementById('lang-select').value = savedLang;
  changeLanguage();

  // Evento de cambio de idioma
  document.getElementById('lang-select').addEventListener('change', changeLanguage);
  document.getElementById('style-filter').addEventListener('change', filterProducts);

  // Cargar obras
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

  // Diagnóstico de Snipcart
  document.addEventListener('snipcart.ready', () => {
    console.log('✅ Snipcart está listo');
  });

  document.addEventListener('snipcart.error', (e) => {
    console.error('❌ Error de Snipcart:', e.detail);
  });
});