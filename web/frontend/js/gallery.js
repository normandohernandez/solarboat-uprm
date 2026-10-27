// Filtros de la galería y visor de fotos a pantalla completa
// Solar Boat UPRM — js/gallery.js

// ── Gallery filter ──
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.hidden = filter !== 'all' && item.dataset.cat !== filter;
    });
  });
});

// ── Gallery lightbox ──
let galleryReturnFocus = null;

function openGallery(src, alt) {
  galleryReturnFocus = document.activeElement;
  const imageRegion = document.getElementById('galleryOverlayImg');
  const image = document.createElement('img');
  image.src = src;
  image.alt = alt;
  image.decoding = 'async';
  imageRegion.replaceChildren(image);

  const overlay = document.getElementById('galleryOverlay');
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  document.querySelector('.gallery-overlay-close').focus();
}
function closeGallery(e) {
  const overlay = document.getElementById('galleryOverlay');
  if (e && e.target !== overlay && !e.target.closest('.gallery-overlay-close')) return;

  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  document.getElementById('galleryOverlayImg').replaceChildren();
  if (galleryReturnFocus) galleryReturnFocus.focus();
}
document.addEventListener('keydown', e => {
  const overlay = document.getElementById('galleryOverlay');
  if (!overlay.classList.contains('open')) return;

  if (e.key === 'Escape') closeGallery();
  if (e.key === 'Tab') {
    e.preventDefault();
    document.querySelector('.gallery-overlay-close').focus();
  }
});

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const image = item.querySelector('img');
    openGallery(item.dataset.src, image.alt);
  });
});
