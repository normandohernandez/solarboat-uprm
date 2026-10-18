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
  const TEAM_DIVISIONS = [
    { href: 'team.html', label: 'All Divisions' },
    { href: 'team-icom-inso.html', label: 'ICOM / INSO' },
    { href: 'team-operations-logistics.html', label: 'Operations & Logistics' },
    { href: 'team-inme.html', label: 'INME' },
    { href: 'team-inel.html', label: 'INEL' },
  ];

  const PAGES = [
    { href: 'sobre.html',    label: 'Sobre nosotros' },
    { href: 'logros.html',   label: 'Logros' },
    { label: 'Team', divisions: TEAM_DIVISIONS },
    { href: 'eventos.html',  label: 'Eventos' },
    { href: 'donar.html',    label: 'Donar' },
    { href: 'unete.html',    label: 'Únete', mobileLabel: 'Únete al equipo' },
    { href: 'fotos.html',    label: 'Fotos' },
  ];
  // Keep the existing News page available from the footer.
  const FOOTER_PAGES = [
    { href: 'sobre.html', label: 'Sobre nosotros' },
    { href: 'logros.html', label: 'Logros' },
    { href: 'noticias.html', label: 'Noticias' },
    { href: 'eventos.html', label: 'Eventos' },
    { href: 'donar.html', label: 'Donar' },
    { href: 'unete.html', label: 'Únete' },
    { href: 'fotos.html', label: 'Fotos' },
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

  const teamIsActive = TEAM_DIVISIONS.some(item => item.href === current);
  const teamLinkAttrs = href =>
    href === current ? ' class="active" aria-current="page"' : '';

  const desktopNavItem = item => {
    if (!item.divisions) return `<a href="${item.href}" role="listitem"${activeAttrs(item.href)}>${item.label}</a>`;
    return `<div class="nav-dropdown${teamIsActive ? ' active' : ''}" role="listitem" data-nav-dropdown>
            <button class="nav-dropdown-toggle" type="button" aria-expanded="false" aria-controls="teamDropdownMenu">
              <span>${item.label}</span>
              <svg class="nav-dropdown-chevron" viewBox="0 0 12 8" aria-hidden="true"><path d="m1 1.5 5 5 5-5" /></svg>
            </button>
            <div class="nav-dropdown-menu" id="teamDropdownMenu" role="menu">
              ${item.divisions.map(division => `<a href="${division.href}" role="menuitem"${teamLinkAttrs(division.href)}>${division.label}</a>`).join('\n              ')}
            </div>
          </div>`;
  };

  const mobileNavItem = item => {
    if (!item.divisions) return `<a href="${item.href}" role="menuitem"${activeAttrs(item.href)}>${item.mobileLabel || item.label}</a>`;
    return `<div class="mobile-team-dropdown" data-mobile-team-dropdown role="none">
        <button class="mobile-team-toggle" type="button" aria-expanded="false" aria-controls="mobileTeamMenu">
          <span>${item.label}</span>
          <svg class="nav-dropdown-chevron" viewBox="0 0 12 8" aria-hidden="true"><path d="m1 1.5 5 5 5-5" /></svg>
        </button>
        <div class="mobile-team-menu" id="mobileTeamMenu" role="menu" hidden>
          ${item.divisions.map(division => `<a href="${division.href}" role="menuitem"${teamLinkAttrs(division.href)}>${division.label}</a>`).join('\n          ')}
        </div>
      </div>`;
  };

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
          ${PAGES.map(desktopNavItem).join('\n          ')}
        </div>
        <a href="${CONTACT.href}" class="nav-cta"${CONTACT.href === current ? ' aria-current="page"' : ''}>${CONTACT.label}</a>
        <div class="nav-toggle" id="navToggle" aria-label="Open menu" role="button" tabindex="0">
          <span></span><span></span><span></span>
        </div>
      </div>
      <div class="nav-waves" aria-hidden="true">
        <svg class="nav-wave nav-wave-back" viewBox="0 0 240 16" preserveAspectRatio="none" focusable="false">
          <defs>
            <linearGradient id="navWaveBackGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#4ca9e8" />
              <stop offset="50%" stop-color="#66c6ee" />
              <stop offset="100%" stop-color="#48b4df" />
            </linearGradient>
          </defs>
          <path fill="url(#navWaveBackGradient)" d="M0 7 C18 .5 42 .5 60 7 C78 12.5 102 12.5 120 7 C138 1.5 162 1.5 180 7 C198 12.5 222 12.5 240 7 L240 16 L0 16 Z" />
        </svg>
        <svg class="nav-wave nav-wave-middle" viewBox="0 0 240 16" preserveAspectRatio="none" focusable="false">
          <defs>
            <linearGradient id="navWaveMiddleGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#62d2eb" />
              <stop offset="50%" stop-color="#3dbce8" />
              <stop offset="100%" stop-color="#66d7e4" />
            </linearGradient>
          </defs>
          <path fill="url(#navWaveMiddleGradient)" d="M0 9 C20 14.5 40 14.5 60 9 C80 2.5 100 2.5 120 9 C140 14.5 160 14.5 180 9 C200 3.5 220 3.5 240 9 L240 16 L0 16 Z" />
        </svg>
        <svg class="nav-wave nav-wave-front" viewBox="0 0 240 16" preserveAspectRatio="none" focusable="false">
          <defs>
            <linearGradient id="navWaveFrontGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#47c8d8" />
              <stop offset="50%" stop-color="#5edbe0" />
              <stop offset="100%" stop-color="#42bddd" />
            </linearGradient>
          </defs>
          <path fill="url(#navWaveFrontGradient)" d="M0 10 C20 4 40 4 60 10 C80 15 100 15 120 10 C140 5 160 5 180 10 C200 15 220 15 240 10 L240 16 L0 16 Z" />
        </svg>
      </div>
    </nav>
    <div class="mobile-menu" id="mobileMenu" role="menu">
      <a href="index.html" role="menuitem"${activeAttrs('index.html')}>Inicio</a>
      ${PAGES.map(mobileNavItem).join('\n      ')}
      <a href="${CONTACT.href}" role="menuitem"${activeAttrs(CONTACT.href)}>${CONTACT.label}</a>
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
            ${FOOTER_PAGES.map(p => `<li><a href="${p.href}">${p.label}</a></li>`).join('\n            ')}
          </ul>
        </div>
        <div class="footer-col footer-modern footer-social">
          <h4>Redes sociales</h4>
          <ul class="footer-social-list">
            <li>
              <a class="footer-social-link" href="https://www.instagram.com/uprm_solar_boat/" target="_blank" rel="noopener noreferrer" aria-label="Instagram de SolarBoat UPRM">
                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle class="icon-fill" cx="17.4" cy="6.7" r="1.15"/></svg>
              </a>
            </li>
            <li>
              <a class="footer-social-link" href="https://www.facebook.com/UPRMSolarBoat/" target="_blank" rel="noopener noreferrer" aria-label="Facebook de SolarBoat UPRM">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path class="icon-fill" d="M13.7 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5H17V3.6c-.7-.1-1.5-.2-2.4-.2-2.4 0-4 1.5-4 4.1v2.4H8V13h2.6v8h3.1Z"/></svg>
              </a>
            </li>
          </ul>
        </div>
        <div class="footer-col footer-modern footer-contact">
          <h4>Contacto</h4>
          <ul class="footer-contact-list">
            <li>
              <a class="footer-contact-link" href="mailto:solarboat@uprm.edu">
                <span class="footer-contact-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg></span>
                <span class="footer-contact-copy"><strong>Email</strong><span>solarboat@uprm.edu</span></span>
              </a>
            </li>
            <li>
              <a class="footer-contact-link" href="https://www.uprm.edu/" target="_blank" rel="noopener noreferrer">
                <span class="footer-contact-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.3 2.5 3.5 5.5 3.5 9S14.3 18.5 12 21c-2.3-2.5-3.5-5.5-3.5-9S9.7 5.5 12 3Z"/></svg></span>
                <span class="footer-contact-copy"><strong>Website</strong><span>uprm.edu</span></span>
              </a>
            </li>
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
