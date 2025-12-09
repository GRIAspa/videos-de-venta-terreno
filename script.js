// script.js - carga videos.json y maneja modal
const galleryEl = document.getElementById('gallery');
const modal = document.getElementById('videoModal');
const modalBody = document.getElementById('modalBody');
const modalMeta = document.getElementById('modalMeta');
const modalClose = document.getElementById('modalClose');

// Cargar JSON de videos (asegúrate de que videos.json esté disponible en el mismo directorio)
async function loadVideos() {
  try {
    const res = await fetch('videos.json', {cache: "no-store"});
    if (!res.ok) throw new Error('No se pudo cargar videos.json');
    const videos = await res.json();
    renderGallery(videos);
  } catch (err) {
    galleryEl.innerHTML = '<p style="padding:12px;color:#c00">Error cargando videos: ' + err.message + '</p>';
    console.error(err);
  }
}

function renderGallery(videos){
  galleryEl.innerHTML = '';
  videos.forEach((v, idx) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.tabIndex = 0;
    card.setAttribute('role','button');
    card.dataset.index = idx;

    const thumb = document.createElement(v.thumbnail ? 'img' : 'div');
    thumb.className = 'thumb';
    thumb.alt = v.title || 'Video';
    if (v.thumbnail) thumb.src = v.thumbnail;

    const body = document.createElement('div');
    body.className = 'card-body';
    const title = document.createElement('h3');
    title.className = 'title';
    title.textContent = v.title || 'Sin título';
    const desc = document.createElement('p');
    desc.className = 'desc';
    desc.textContent = v.description || '';

    body.appendChild(title);
    body.appendChild(desc);

    card.appendChild(thumb);
    card.appendChild(body);

    card.addEventListener('click', () => openModal(v));
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(v); } });

    galleryEl.appendChild(card);
  });
}

function openModal(video){
  // limpiar modal
  modalBody.innerHTML = '';
  modalMeta.innerHTML = '';

  if (video.sourceType === 'youtube') {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${video.src}?rel=0&autoplay=1`;
    iframe.title = video.title || 'Video de YouTube';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    modalBody.appendChild(iframe);
  } else {
    const vid = document.createElement('video');
    vid.src = video.src;
    vid.controls = true;
    vid.autoplay = true;
    modalBody.appendChild(vid);
  }

  modalMeta.innerHTML = `<strong>${escapeHtml(video.title || '')}</strong><div class="desc">${escapeHtml(video.description || '')}</div>`;

  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
}

function closeModal(){
  // detener video si es HTML5
  const media = modalBody.querySelector('video');
  if (media) { media.pause(); media.src = ''; }
  // eliminar iframe para detener YouTube
  modalBody.innerHTML = '';
  modal.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal(); });

// utilidad: escapar HTML simple
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]; }); }

loadVideos();