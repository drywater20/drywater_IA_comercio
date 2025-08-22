// === Variables globales ===
let obras = [];
let currentImageIndex = 0;
let currentLang = 'es';

// === Cargar obras desde obras.json ===
async function cargarObras() {
  try {
    const response = await fetch('obras.json');
    if (!response.ok) {
      throw new Error('No se pudo cargar obras.json: ' + response.status);
    }
    obras = await response.json();
    console.log('✅ Obras cargadas:', obras);
    renderizarGaleria();
  } catch (error) {
    console.error('❌ Error al cargar las obras:', error);
    document.getElementById('gallery').innerHTML = `
      <p style="color: red; text-align: center; margin: 20px;">
        ⚠️ No se pudieron cargar las imágenes.<br>
        Revisa la consola para más detalles.
      </p>
    `;
  }
}

// === Cambiar idioma ===
function changeLanguage() {
  const langSelect = document.getElementById('lang-select');
  currentLang = langSelect.value;

  // Textos de la interfaz
  const translations = {
    es: { 
      title: "Galería de Arte", 
      subtitle: "Disfruta de una colección única de arte marino.", 
      filter: "Filtrar por estilo:", 
      comments: "Comentarios:", 
      send: "Enviar" 
    },
    en: { 
      title: "Art Gallery", 
      subtitle: "Enjoy a unique collection of marine art.", 
      filter: "Filter by style:", 
      comments: "Comments:", 
      send: "Send" 
    },
    fr: { 
      title: "Galerie d'Art", 
      subtitle: "Profitez d'une collection unique d'art marin.", 
      filter: "Filtrer par style :", 
      comments: "Commentaires :", 
      send: "Envoyer" 
    },
    ja: { 
      title: "アートギャラリー", 
      subtitle: "ユニークなマリンアートのコレクションをお楽しみください。", 
      filter: "スタイルでフィルター：", 
      comments: "コメント：", 
      send: "送信" 
    }
  };

  const t = translations[currentLang];
  document.getElementById('main-title').textContent = t.title;
  document.getElementById('main-subtitle').textContent = t.subtitle;
  document.getElementById('filter-label').textContent = t.filter;
  document.getElementById('comment-title').textContent = t.comments;
  document.getElementById('send-btn').textContent = t.send;

  // 💡 SAFE: Cambiar idioma de Snipcart solo si está cargado
  if (window.Snipcart && typeof Snipcart.api !== 'undefined') {
    try {
      Snipcart.api.state.locale.set(currentLang);
    } catch (error) {
      console.warn('⚠️ No se pudo cambiar el idioma de Snipcart aún:', error);
    }
  }

  // Guardar preferencia
  localStorage.setItem('selected-lang', currentLang);

  // Volver a renderizar galería (actualiza botones)
  renderizarGaleria();
}

// === Renderizar galería de productos ===
function renderizarGaleria() {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';

  obras.forEach((obra, index) => {
    const titulo = obra.titulo[currentLang];
    const descripcion = obra.descripcion[currentLang];

    // Texto del botón según idioma
    let buttonText;
    switch(currentLang) {
      case 'es': buttonText = 'Añadir al carrito'; break;
      case 'en': buttonText = 'Add to cart'; break;
      case 'fr': buttonText = 'Ajouter au panier'; break;
      case 'ja': buttonText = 'カートに追加'; break;
      default: buttonText = 'Añadir al carrito';
    }

    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-style', obra.estilo);

    card.innerHTML = `
      <img src="${obra.imagen}" alt="${titulo}" loading="lazy">
      <div class="product-info">
        <h3>${titulo}</h3>
        <p class="description">${descripcion}</p>
      </div>
      <button class="snipcart-add-item"
        data-item-id="${obra.id}"
        data-item-name="${titulo}"
        data-item-price="25.00"
        data-item-image="${obra.imagen}"
        data-item-url="/"
        data-item-description="${descripcion}">
        ${buttonText}
      </button>
    `;
    gallery.appendChild(card);

    card.querySelector('img').onclick = () => openLightbox(index);
  });
}

// === Lightbox: abrir, cambiar, actualizar ===
function openLightbox(index) {
  currentImageIndex = index;
  actualizarLightbox();
  document.getElementById('lightbox').style.display = 'flex';
}

function closeLightbox() {
  document.getElementById('lightbox').style.display = 'none';
}

function changeImage(direction) {
  currentImageIndex = (currentImageIndex + direction + obras.length) % obras.length;
  actualizarLightbox();
}

function actualizarLightbox() {
  const obra = obras[currentImageIndex];
  const titulo = obra.titulo[currentLang];
  const descripcion = obra.descripcion[currentLang];

  document.getElementById('lightbox-img').src = obra.imagen;
  document.getElementById('lightbox-title').textContent = titulo;
  document.getElementById('lightbox-desc').textContent = descripcion;

  const btn = document.querySelector('.lightbox-add');
  btn.textContent = 
    currentLang === 'es' ? 'Añadir al carrito' :
    currentLang === 'en' ? 'Add to cart' :
    currentLang === 'fr' ? 'Ajouter au panier' :
    'カートに追加';
  btn.setAttribute('data-item-id', obra.id);
  btn.setAttribute('data-item-name', titulo);
  btn.setAttribute('data-item-price', '25.00');
  btn.setAttribute('data-item-image', obra.imagen);
  btn.setAttribute('data-item-description', descripcion);
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

// === Inicialización al cargar ===
document.addEventListener('DOMContentLoaded', () => {
  // Cargar idioma guardado
  const savedLang = localStorage.getItem('selected-lang') || 'es';
  const langSelect = document.getElementById('lang-select');
  if (langSelect) langSelect.value = savedLang;
  currentLang = savedLang;

  // Cambiar idioma (seguro)
  if (typeof changeLanguage === 'function') {
    changeLanguage();
  }

  // Eventos
  const filterSelect = document.getElementById('style-filter');
  if (filterSelect) {
    filterSelect.addEventListener('change', filterProducts);
  }

  if (langSelect) {
    langSelect.addEventListener('change', changeLanguage);
  }

  // Cargar obras
  if (typeof cargarObras === 'function') {
    cargarObras();
  }

  // Navegación con teclado
  document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && (lightbox.style.display === 'flex' || lightbox.style.display === 'block')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') changeImage(1);
      if (e.key === 'ArrowLeft') changeImage(-1);
    }
  });

  // ✅ Snipcart: Cambiar idioma cuando esté listo
  document.addEventListener('snipcart.ready', () => {
    console.log('✅ Snipcart está listo y cargado');
    if (window.Snipcart) {
      try {
        Snipcart.api.state.locale.set(currentLang);
      } catch (error) {
        console.error('❌ Error al establecer idioma en Snipcart:', error);
      }
    }
  });

  // Diagnóstico de errores de Snipcart
  document.addEventListener('snipcart.error', (e) => {
    console.error('❌ Error de Snipcart:', e.detail);
  });
});