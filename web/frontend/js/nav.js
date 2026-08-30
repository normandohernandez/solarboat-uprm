// Menú móvil: abrir, cerrar al tocar un enlace y cerrar al tocar fuera
// Solar Boat UPRM — js/nav.js

// ── Mobile nav toggle ──
const toggle   = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
toggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
// close when a link is tapped
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ── Smooth close mobile menu on outside click ──
document.addEventListener('click', (e) => {
  if (!toggle.contains(e.target) && !mobileMenu.contains(e.target)) {
    mobileMenu.classList.remove('open');
  }
});
