// Los cuatro formularios: reclutamiento, avisos de eventos, suscripción y contacto
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

// ── Subscribe / notificaciones form ──
document.getElementById('subscribeForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const btn      = this.querySelector('button[type="submit"]');
  const emailEl  = document.getElementById('subEmail');
  const errorEl  = document.getElementById('subscribeError');
  const email    = emailEl.value.trim();
  const intereses = [...this.querySelectorAll('input[name="intereses"]:checked')]
    .map(cb => cb.value);

  const fail = (msg, el) => {
    errorEl.textContent = msg;
    errorEl.classList.add('show');
    if (el) el.style.borderColor = '#c53030';
  };
  errorEl.classList.remove('show');
  emailEl.style.borderColor = '';

  if (!email || !email.includes('@')) {
    return fail('Escribe un correo válido.', emailEl);
  }
  if (intereses.length === 0) {
    return fail('Marca al menos una cosa sobre la que quieras que te avisemos.');
  }

  const original = btn.textContent;
  btn.textContent = 'Enviando…';
  btn.disabled = true;
  try {
    await postForm('/api/notify', {
      nombre:  document.getElementById('subNombre').value.trim(),
      email,
      intereses,
      website: document.getElementById('subWebsite').value,
    });
    btn.textContent = '¡Listo! Te avisaremos ✓';
  } catch (err) {
    btn.textContent = original;
    btn.disabled = false;
    fail('No se pudo enviar. Intenta de nuevo en un momento.');
  }
});

// ── Contact form ──
document.getElementById('contactForm').addEventListener('submit', async function(e) {
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
