// Los tres formularios: reclutamiento, avisos de eventos y contacto.
// Se comprueba que cada formulario exista en la página antes de inicializarlo.
// Solar Boat UPRM — js/forms.js

// ── Recruitment form ──
async function handleRecruit(btn) {
  const input = document.getElementById('recruitEmail');
  const email = input.value.trim();
  if (!email || !email.includes('@')) {
    input.style.borderColor = '#e53e3e';
    return;
  }
  input.style.borderColor = '';
  const original = btn.textContent;
  btn.textContent = 'Enviando…';
  btn.disabled = true;
  try {
    const website = document.getElementById('recruitWebsite').value;
    await postForm('/api/recruit', { email, website });
    btn.textContent = '¡Recibido! ✓';
  } catch (err) {
    btn.textContent = 'Error — reintenta';
    btn.disabled = false;
    setTimeout(() => { btn.textContent = original; }, 2500);
  }
}

// ── Events notify form ──
async function handleNotify(btn) {
  const wrap = btn.closest('.sidebar-notify-form');
  const nombre = wrap.querySelector('input[type="text"]:not(.hp-field)').value.trim();
  const emailInput = wrap.querySelector('input[type="email"]');
  const email = emailInput.value.trim();
  const website = wrap.querySelector('.notify-hp').value;
  if (!email || !email.includes('@')) {
    emailInput.style.borderColor = '#e53e3e';
    return;
  }
  emailInput.style.borderColor = '';
  const original = btn.textContent;
  btn.textContent = 'Enviando…';
  btn.disabled = true;
  try {
    await postForm('/api/notify', { nombre, email, website, intereses: ['Eventos y fundraisers'] });
    btn.textContent = '¡Listo! ✓';
  } catch (err) {
    btn.textContent = 'Error — reintenta';
    btn.disabled = false;
    setTimeout(() => { btn.textContent = original; }, 2500);
  }
}

// ── Contact form ──
document.getElementById('contactForm')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  const original = btn.textContent;
  btn.textContent = 'Enviando…';
  btn.disabled = true;

  const data = Object.fromEntries(new FormData(this));
  try {
    await postForm('/api/contact', data);
    btn.textContent = '¡Mensaje enviado! ✓';
    this.reset();
  } catch (err) {
    btn.textContent = 'Error — intenta de nuevo';
    btn.disabled = false;
    setTimeout(() => { btn.textContent = original; }, 2500);
  }
});
