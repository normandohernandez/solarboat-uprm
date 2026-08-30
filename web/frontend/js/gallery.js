// Filtros de la galería y visor de fotos a pantalla completa
// Solar Boat UPRM — js/gallery.js

// ── Gallery filter ──
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.gallery-item').forEach(item => {
      if (filter === 'all' || item.dataset.cat === filter) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// ── Gallery lightbox ──
function openGallery(title, desc) {
  document.getElementById('galleryOverlayTitle').textContent = title;
  document.getElementById('galleryOverlayDesc').textContent = desc;
  // If you have a real <img> you can swap it here
  document.getElementById('galleryOverlayImg').innerHTML =
    '<svg width="120" height="90" viewBox="0 0 120 90" fill="none" aria-hidden="true"><ellipse cx="60" cy="78" rx="52" ry="12" fill="#29b6f6" opacity="0.2"/><path d="M12 58 Q60 30 108 58 L105 72 Q60 84 15 72Z" fill="#4a7c58"/><rect x="18" y="48" width="54" height="14" rx="4" fill="#2d5c3e"/><line x1="18" y1="54" x2="72" y2="54" stroke="#4ac26a" stroke-width="1.6"/><path d="M28 28 Q60 8 92 28 L88 48 H32Z" fill="#1a7c35"/><path d="M36 28 Q60 14 84 28 L80 42 H40Z" fill="#22a045"/></svg>';
  document.getElementById('galleryOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeGallery(e) {
  if (!e || e.target === document.getElementById('galleryOverlay') || e.currentTarget.tagName === 'BUTTON') {
    document.getElementById('galleryOverlay').classList.remove('open');
    document.body.style.overflow = '';
  }
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeGallery({target: document.getElementById('galleryOverlay')}); });
