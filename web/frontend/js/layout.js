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
    { href: 'index.html',    label: 'Home' },
    { href: 'logros.html',   label: 'Achievements' },
    { label: 'Team', divisions: TEAM_DIVISIONS },
    { href: 'eventos.html',  label: 'Events' },
    { href: 'donar.html',    label: 'Donate' },
    { href: 'unete.html',    label: 'Join Us', mobileLabel: 'Join the Team' },
    { href: 'fotos.html',    label: 'Photos' },
  ];
  // Footer navigation — kept separate from the main navigation order.
  const FOOTER_PAGES = [
    { href: 'team.html', label: 'Our Team' },
    { href: 'logros.html', label: 'Achievements' },
    { href: 'eventos.html', label: 'Events' },
    { href: 'donar.html', label: 'Donate' },
    { href: 'unete.html', label: 'Join Us' },
    { href: 'fotos.html', label: 'Photos' },
  ];
  const CONTACT = { href: 'contacto.html', label: 'Contact' };

  // ================================================
  //  PATROCINADORES — sale en el pie de página de todo el sitio
  //  Añade, quita o cambia lo de abajo. De cada uno:
  //    name  — cómo se llama (obligatorio; es lo que se lee si no hay logo)
  //    url   — su página web ('' si no tiene: se muestra sin enlace)
  //    logo  — imagen en fotos/sponsors/ ('' si no hay: se muestra el nombre)
  // ================================================
  const SPONSORS = [
    { name: 'Sponsor name 1', url: '', logo: '' },
    { name: 'Sponsor name 2', url: '', logo: '' },
    { name: 'Sponsor name 3', url: '', logo: '' },
    { name: 'Sponsor name 4', url: '', logo: '' },
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
        <a class="nav-logo" href="index.html" aria-label="Solar Boat UPRM — Home">
          <img class="nav-logo-img" src="fotos/solarboat-logo.png" alt="Solar Boat UPRM" />
          <span class="nav-brand"><span class="nav-brand-solar">Solar</span><span class="nav-brand-boat">Boat</span><span class="nav-brand-uprm">UPRM</span></span>
        </a>
        <div class="nav-links" role="list">
          ${PAGES.map(desktopNavItem).join('\n          ')}
        </div>
        <a href="${CONTACT.href}" class="nav-cta"${CONTACT.href === current ? ' aria-current="page"' : ''}>
          <span>${CONTACT.label}</span>
          <span class="nav-cta-arrow" aria-hidden="true">↗</span>
        </a>
        <div class="nav-toggle" id="navToggle" aria-label="Open menu" role="button" tabindex="0">
          <span></span><span></span><span></span>
        </div>
      </div>
      <div class="nav-waves" aria-hidden="true">
        <svg class="nav-wave nav-wave-back" viewBox="0 0 640 52" preserveAspectRatio="none" focusable="false">
          <path fill="#3AA7B8" d="M0 25 C40 5 80 5 120 25 S200 45 240 25 S280 5 320 25 S400 45 440 25 S520 5 560 25 S600 45 640 25 L640 52 L0 52 Z" />
        </svg>
        <svg class="nav-wave nav-wave-front" viewBox="0 0 640 52" preserveAspectRatio="none" focusable="false">
          <path fill="#79D3DF" d="M0 36 C40 50 80 50 120 36 S200 18 240 36 S280 50 320 36 S400 18 440 36 S520 50 560 36 S600 18 640 36 L640 52 L0 52 Z" />
        </svg>
      </div>
    </nav>
    <div class="mobile-menu" id="mobileMenu" role="menu">
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
            University of Puerto Rico · Mayagüez Campus<br>
            College of Engineering
          </p>
        </div>
        <div class="footer-col">
          <h4>Navigation</h4>
          <ul>
            <li><a href="index.html">Home</a></li>
            ${FOOTER_PAGES.map(p => `<li><a href="${p.href}">${p.label}</a></li>`).join('\n            ')}
          </ul>
        </div>
        <div class="footer-col footer-modern footer-social">
          <h4>Social Media</h4>
          <ul class="footer-social-list">
            <li>
              <a class="footer-social-link" href="https://www.instagram.com/uprm_solar_boat/" target="_blank" rel="noopener noreferrer" aria-label="SolarBoat UPRM on Instagram">
                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle class="icon-fill" cx="17.4" cy="6.7" r="1.15"/></svg>
              </a>
            </li>
            <li>
              <a class="footer-social-link" href="https://www.facebook.com/UPRMSolarBoat/" target="_blank" rel="noopener noreferrer" aria-label="SolarBoat UPRM on Facebook">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path class="icon-fill" d="M13.7 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5H17V3.6c-.7-.1-1.5-.2-2.4-.2-2.4 0-4 1.5-4 4.1v2.4H8V13h2.6v8h3.1Z"/></svg>
              </a>
            </li>
          </ul>
        </div>
        <div class="footer-col footer-modern footer-contact">
          <h4>Contact</h4>
          <ul class="footer-contact-list">
            <li>
              <a class="footer-contact-link" href="mailto:solarboat@uprm.edu">
                <span class="footer-contact-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg></span>
                <span class="footer-contact-copy"><strong>Email</strong><span>solarboat@uprm.edu</span></span>
              </a>
            </li>
          </ul>
        </div>
        ${SPONSORS.length ? `<div class="footer-col footer-sponsors">
          <h4>Sponsors</h4>
          <div class="footer-sponsor-grid">
            ${SPONSORS.map(sp => {
              const inner = `
              <div class="footer-sponsor-logo">${sp.logo
                ? `<img src="${sp.logo}" alt="${sp.name} logo" loading="lazy">`
                : `<span class="footer-sponsor-text">${sp.name}</span>`}</div>
              <p class="footer-sponsor-name">${sp.logo ? sp.name : ''}</p>`;
              return sp.url
                ? `<a class="footer-sponsor-card" href="${sp.url}" target="_blank" rel="noopener noreferrer">${inner}</a>`
                : `<div class="footer-sponsor-card">${inner}</div>`;
            }).join('\n            ')}
          </div>
          <a href="donar.html" class="footer-sponsor-cta">Become a Sponsor →</a>
        </div>` : ''}
      </div>
      <div class="footer-bottom">
        <p>© 2024 UPRM Solar Boat Team · All rights reserved</p>
        <a href="#">Back to top ↑</a>
      </div>
    </div>
  </footer>`;

  const script = document.currentScript;
  const part = script.dataset.part;
  script.insertAdjacentHTML('afterend', part === 'footer' ? footer : header);
})();
