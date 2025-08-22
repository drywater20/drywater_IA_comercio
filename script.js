// === Variables globales ===
let obras = [];
let currentImageIndex = 0;
let currentLang = 'es';

// === Función para leer texto en voz alta ===
function leerTexto(texto) {
  if (!texto || typeof texto !== 'string') return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(texto);
  
  const voices = window.speechSynthesis.getVoices();
  const langVoice = {
    es: voices.find(v => v.lang.includes('es')),
    en: voices.find(v => v.lang.includes('en')),
    fr: voices.find(v => v.lang.includes('fr')),
    ja: voices.find(v => v.lang.includes('ja'))
  };
  
  if (langVoice[currentLang]) {
    utterance.voice = langVoice[currentLang];
  }
  
  utterance.rate = 0.9;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

// === Hacer que un elemento sea leído al hacer clic ===
function hacerClicable(element, texto) {
  if (!element || !texto) return;
  element.style.cursor = 'pointer';
  element.addEventListener('click', (e) => {
    e.stopPropagation();
    leerTexto(texto);
  });
}

// === Cargar obras desde obras.json ===
async function cargarObras() {
  try {
    const response = await fetch('obras.json');
    if (!response.ok) throw new Error('No se pudo cargar obras.json: ' + response.status);
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
  if (!langSelect) return;
  currentLang = langSelect.value;

  // Textos de la interfaz por idioma
  const translations = {
    es: {
      title: "Galería de Arte",
      subtitle: "Disfruta de una colección única de arte marino.",
      filterLabel: "Filtrar por estilo:",
      optionAll: "todos",
      optionPeces: "peces",
      optionCalamares: "calamares",
      optionVarios: "varios",
      optionOtros: "otros",
      comments: "Comentarios:",
      send: "Enviar",
      speak: "Escuchar"
    },
    en: {
      title: "Art Gallery",
      subtitle: "Enjoy a unique collection of marine art.",
      filterLabel: "Filter by style:",
      optionAll: "all",
      optionPeces: "fish",
      optionCalamares: "squid",
      optionVarios: "various",
      optionOtros: "others",
      comments: "Comments:",
      send: "Send",
      speak: "Listen"
    },
    fr: {
      title: "Galerie d'Art",
      subtitle: "Profitez d'une collection unique d'art marin.",
      filterLabel: "Filtrer par style :",
      optionAll: "tous",
      optionPeces: "poissons",
      optionCalamares: "calmars",
      optionVarios: "divers",
      optionOtros: "autres",
      comments: "Commentaires :",
      send: "Envoyer",
      speak: "Écouter"
    },
    ja: {
      title: "アートギャラリー",
      subtitle: "ユニークなマリンアートのコレクションをお楽しみください。",
      filterLabel: "スタイルでフィルター：",
      optionAll: "すべて",
      optionPeces: "魚",
      optionCalamares: "イカ",
      optionVarios: "その他",
      optionOtros: "その他",
      comments: "コメント：",
      send: "送信",
      speak: "聞く"
    }
  };

  const t = translations[currentLang];
  // Actualizar textos
  if (document.getElementById('main-title')) document.getElementById('main-title').textContent = t.title;
  if (document.getElementById('main-subtitle')) document.getElementById('main-subtitle').textContent = t.subtitle;
  if (document.getElementById('filter-label')) document.getElementById('filter-label').textContent = t.filterLabel;
  if (document.getElementById('comment-title')) document.getElementById('comment-title').textContent = t.comments;
  if (document.getElementById('send-btn')) document.getElementById('send-btn').textContent = t.send;
  // 🔥 Traducir el botón "Escuchar"
  if (document.getElementById('speak-all')) document.getElementById('speak-all').textContent = t.speak;

  // Actualizar opciones del filtro
  if (document.getElementById('option-all')) document.getElementById('option-all').textContent = t.optionAll;
  if (document.getElementById('option-peces')) document.getElementById('option-peces').textContent = t.optionPeces;
  if (document.getElementById('option-calamares')) document.getElementById('option-calamares').textContent = t.optionCalamares;
  if (document.getElementById('option-varios')) document.getElementById('option-varios').textContent = t.optionVarios;
  if (document.getElementById('option-otros')) document.getElementById('option-otros').textContent = t.optionOtros;

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

  // Volver a renderizar galería
  if (typeof renderizarGaleria === 'function') {
    renderizarGaleria();
  }
}

// === Renderizar galería de productos ===
function renderizarGaleria() {
  const gallery = document.getElementById('gallery');
  if (!gallery) return;
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
        data-item-description="${descripcion}"
        data-item-open-cart="true">
        ${buttonText}
      </button>
    `;
    gallery.appendChild(card);

    // ✅ SOLO HACER CLICKEABLES: TÍTULO Y DESCRIPCIÓN
    hacerClicable(card.querySelector('h3'), titulo);
    hacerClicable(card.querySelector('.description'), descripcion);

    // Abrir lightbox al hacer clic en la imagen
    card.querySelector('img').onclick = () => openLightbox(index);
  });
}

// === Lightbox: abrir, cambiar, actualizar ===
function openLightbox(index) {
  currentImageIndex = index;
  actualizarLightbox();
  const lightbox = document.getElementById('lightbox');
  if (lightbox) lightbox.style.display = 'flex';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) lightbox.style.display = 'none';
}

function changeImage(direction) {
  currentImageIndex = (currentImageIndex + direction + obras.length) % obras.length;
  actualizarLightbox();
}

function actualizarLightbox() {
  const obra = obras[currentImageIndex];
  const titulo = obra.titulo[currentLang];
  const descripcion = obra.descripcion[currentLang];

  const img = document.getElementById('lightbox-img');
  const title = document.getElementById('lightbox-title');
  const desc = document.getElementById('lightbox-desc');
  const btn = document.querySelector('.lightbox-add');

  if (img) img.src = obra.imagen;
  if (title) title.textContent = titulo;
  if (desc) desc.textContent = descripcion;
  if (btn) {
    const buttonText = 
      currentLang === 'es' ? 'Añadir al carrito' :
      currentLang === 'en' ? 'Add to cart' :
      currentLang === 'fr' ? 'Ajouter au panier' :
      'カートに追加';
    btn.textContent = buttonText;
    btn.setAttribute('data-item-id', obra.id);
    btn.setAttribute('data-item-name', titulo);
    btn.setAttribute('data-item-price', '25.00');
    btn.setAttribute('data-item-image', obra.imagen);
    btn.setAttribute('data-item-description', descripcion);
    btn.setAttribute('data-item-open-cart', 'true');
  }

  // ✅ SOLO HACER CLICKEABLES: TÍTULO Y DESCRIPCIÓN EN EL LIGHTBOX
  if (title) hacerClicable(title, titulo);
  if (desc) hacerClicable(desc, descripcion);
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

// === Inicialización al cargar ===
document.addEventListener('DOMContentLoaded', () => {
  // Cargar idioma guardado
  const savedLang = localStorage.getItem('selected-lang') || 'es';
  const langSelect = document.getElementById('lang-select');
  if (langSelect) langSelect.value = savedLang;
  currentLang = savedLang;

  // Botón de escuchar todo
  const speakAllBtn = document.getElementById('speak-all');
  if (speakAllBtn) {
    speakAllBtn.addEventListener('click', () => {
      const textToSpeak = [
        document.getElementById('main-title')?.textContent || '',
        document.getElementById('main-subtitle')?.textContent || ''
      ].join('. ');
      leerTexto(textToSpeak);
    });
  }

  // Cambiar idioma
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

// === Cargar voces del sistema ===
let voicesLoaded = false;
function cargarVoces() {
  if (typeof speechSynthesis !== 'undefined' && !voicesLoaded) {
    speechSynthesis.getVoices();
    voicesLoaded = true;
  }
}
cargarVoces();
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = cargarVoces;
}