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
  btn.textContent = 'Sending…';
  btn.disabled = true;
  try {
    const website = document.getElementById('recruitWebsite').value;
    await postForm('/api/recruit', { email, website });
    btn.textContent = 'Received! ✓';
  } catch (err) {
    btn.textContent = 'Error — try again';
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
  btn.textContent = 'Sending…';
  btn.disabled = true;
  try {
    await postForm('/api/notify', { nombre, email, website, intereses: ['Events and fundraisers'] });
    btn.textContent = 'Done! ✓';
  } catch (err) {
    btn.textContent = 'Error — try again';
    btn.disabled = false;
    setTimeout(() => { btn.textContent = original; }, 2500);
  }
}

// ── Contact form ──
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(this));
  if (data.website) return;

  if (!this.checkValidity()) {
    this.reportValidity();
    return;
  }

  const subject = data.asunto.trim() || 'Solar Boat UPRM Website Inquiry';
  const body = [
    `Name: ${data.nombre.trim()}`,
    `Email: ${data.email.trim()}`,
    '',
    'Message:',
    data.mensaje.trim(),
  ].join('\n');

  window.location.href = `mailto:solarboat@uprm.edu?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
