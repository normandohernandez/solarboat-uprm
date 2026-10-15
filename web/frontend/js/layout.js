// Encabezado y pie de página compartidos por todas las páginas
// Solar Boat UPRM — js/layout.js
//
// Cada página lo carga dos veces, donde va cada parte:
//   <script src="js/layout.js" data-part="header"></script>
//   <script src="js/layout.js" data-part="footer"></script>
// Así el menú se edita en un solo sitio. Para añadir o quitar un tab,
// cambia la lista PAGES y crea (o borra) el .html correspondiente.

(function () {
  // ================================================
  //  TABS — el orden aquí es el orden en el menú
  // ================================================
  const PAGES = [
    { href: 'sobre.html',    label: 'Sobre nosotros' },
    { href: 'logros.html',   label: 'Logros' },
    { href: 'noticias.html', label: 'Noticias' },
    { href: 'eventos.html',  label: 'Eventos' },
    { href: 'donar.html',    label: 'Donar' },
    { href: 'unete.html',    label: 'Únete', mobileLabel: 'Únete al equipo' },
    { href: 'fotos.html',    label: 'Fotos' },
  ];
  const CONTACT = { href: 'contacto.html', label: 'Contacto' };

  // ================================================
  //  PATROCINADORES — sale en el pie de página de todo el sitio
  //  Añade, quita o cambia lo de abajo. De cada uno:
  //    name  — cómo se llama (obligatorio; es lo que se lee si no hay logo)
  //    url   — su página web ('' si no tiene: se muestra sin enlace)
  //    logo  — imagen en fotos/sponsors/ ('' si no hay: se muestra el nombre)
  // ================================================
  const SPONSORS = [
    { name: 'Nombre del patrocinador 1', url: '', logo: '' },
    { name: 'Nombre del patrocinador 2', url: '', logo: '' },
    { name: 'Nombre del patrocinador 3', url: '', logo: '' },
    { name: 'Nombre del patrocinador 4', url: '', logo: '' },
  ];

  const current = location.pathname.split('/').pop() || 'index.html';

  // Marca el tab de la página abierta
  const activeAttrs = href =>
    href === current ? ' class="active" aria-current="page"' : '';

  const header = `
  <header>
    <nav class="nav" role="navigation" aria-label="Main navigation">
      <div class="container">
        <div class="nav-logo">
          <!-- ── SWAP with your real logo image ── -->
          <div class="nav-logo-img">
            <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
              <path d="M1 12 Q11 5 21 12 L21 15 Q11 19 1 15Z" fill="#1a7c35"/>
              <path d="M4 8 Q11 2 18 8 L17 12 H5Z" fill="#4ac26a" opacity="0.9"/>
            </svg>
          </div>
          <span class="nav-brand">Solar<span>Boat</span> UPRM</span>
        </div>
        <div class="nav-links" role="list">
          ${PAGES.map(p => `<a href="${p.href}" role="listitem"${activeAttrs(p.href)}>${p.label}</a>`).join('\n          ')}
        </div>
        <a href="${CONTACT.href}" class="nav-cta"${CONTACT.href === current ? ' aria-current="page"' : ''}>${CONTACT.label}</a>
        <div class="nav-toggle" id="navToggle" aria-label="Abrir menú" role="button" tabindex="0">
          <span></span><span></span><span></span>
        </div>
      </div>
      <div class="nav-waves" aria-hidden="true">
        <svg class="nav-wave nav-wave-back" viewBox="0 0 200 8" preserveAspectRatio="none" focusable="false">
          <path d="M0 5 C3 1.2 9.5 1.2 12.5 5 S22 8.8 25 5 S34.5 1.2 37.5 5 S47 8.8 50 5 S59.5 1.2 62.5 5 S72 8.8 75 5 S84.5 1.2 87.5 5 S97 8.8 100 5 S109.5 1.2 112.5 5 S122 8.8 125 5 S134.5 1.2 137.5 5 S147 8.8 150 5 S159.5 1.2 162.5 5 S172 8.8 175 5 S184.5 1.2 187.5 5 S197 8.8 200 5 L200 8 L0 8 Z" />
        </svg>
        <svg class="nav-wave nav-wave-front" viewBox="0 0 200 8" preserveAspectRatio="none" focusable="false">
          <path d="M0 4 C5 0.8 15 0.8 20 4 S35 7.2 40 4 S55 0.8 60 4 S75 7.2 80 4 S95 0.8 100 4 S115 7.2 120 4 S135 0.8 140 4 S155 7.2 160 4 S175 0.8 180 4 S195 7.2 200 4 L200 8 L0 8 Z" />
        </svg>
      </div>
    </nav>
    <div class="mobile-menu" id="mobileMenu" role="menu">
      <a href="index.html" role="menuitem"${activeAttrs('index.html')}>Inicio</a>
      ${[...PAGES, CONTACT].map(p => `<a href="${p.href}" role="menuitem"${activeAttrs(p.href)}>${p.mobileLabel || p.label}</a>`).join('\n      ')}
    </div>
  </header>`;

  const footer = `
  <footer role="contentinfo">
    <div class="footer-inner">
      <div class="footer-top">
        <div>
          <div class="footer-brand">Solar<span>Boat</span> UPRM</div>
          <p class="footer-tagline">
            Universidad de Puerto Rico · Recinto de Mayagüez<br>
            Colegio de Ingeniería
          </p>
        </div>
        <div class="footer-col">
          <h4>Navegación</h4>
          <ul>
            <li><a href="index.html">Inicio</a></li>
            ${PAGES.map(p => `<li><a href="${p.href}">${p.label}</a></li>`).join('\n            ')}
          </ul>
        </div>
        <div class="footer-col">
          <h4>Redes sociales</h4>
          <ul>
            <li><a href="https://www.instagram.com/uprm_solar_boat/" target="_blank" rel="noopener">Instagram</a></li>
            <li><a href="https://www.facebook.com/UPRMSolarBoat/" target="_blank" rel="noopener">Facebook</a></li>
            <!-- ADD more ── -->
          </ul>
        </div>
        <div class="footer-col">
          <h4>Contacto</h4>
          <ul>
            <!-- ── EDIT email ── -->
            <li><a href="mailto:solarboat@uprm.edu">solarboat@uprm.edu</a></li>
            <li><a href="https://www.uprm.edu" target="_blank" rel="noopener">uprm.edu</a></li>
          </ul>
        </div>
        ${SPONSORS.length ? `<div class="footer-col footer-sponsors">
          <h4>Patrocinadores</h4>
          <div class="footer-sponsor-grid">
            ${SPONSORS.map(sp => {
              const inner = `
              <div class="footer-sponsor-logo">${sp.logo
                ? `<img src="${sp.logo}" alt="Logo ${sp.name}" loading="lazy">`
                : `<span class="footer-sponsor-text">${sp.name}</span>`}</div>
              <p class="footer-sponsor-name">${sp.logo ? sp.name : ''}</p>`;
              return sp.url
                ? `<a class="footer-sponsor-card" href="${sp.url}" target="_blank" rel="noopener noreferrer">${inner}</a>`
                : `<div class="footer-sponsor-card">${inner}</div>`;
            }).join('\n            ')}
          </div>
          <a href="donar.html" class="footer-sponsor-cta">Sé patrocinador →</a>
        </div>` : ''}
      </div>
      <div class="footer-bottom">
        <p>© 2024 UPRM Solar Boat Team · Todos los derechos reservados</p>
        <a href="#">Volver arriba ↑</a>
      </div>
    </div>
  </footer>`;

  const script = document.currentScript;
  const part = script.dataset.part;
  script.insertAdjacentHTML('afterend', part === 'footer' ? footer : header);
})();
