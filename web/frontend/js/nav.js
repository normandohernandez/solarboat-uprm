// Shared desktop dropdown and mobile navigation behavior.
// Solar Boat UPRM — js/nav.js
(function () {
  'use strict';

  const toggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const desktopDropdown = document.querySelector('[data-nav-dropdown]');
  const desktopTeamToggle = desktopDropdown && desktopDropdown.querySelector('.nav-dropdown-toggle');
  const mobileDropdown = document.querySelector('[data-mobile-team-dropdown]');
  const mobileTeamToggle = mobileDropdown && mobileDropdown.querySelector('.mobile-team-toggle');
  const mobileTeamMenu = mobileDropdown && mobileDropdown.querySelector('.mobile-team-menu');

  const setDesktopDropdown = open => {
    if (!desktopDropdown || !desktopTeamToggle) return;
    desktopDropdown.classList.toggle('is-open', open);
    desktopTeamToggle.setAttribute('aria-expanded', String(open));
  };

  const setMobileDropdown = open => {
    if (!mobileDropdown || !mobileTeamToggle || !mobileTeamMenu) return;
    mobileDropdown.classList.toggle('is-open', open);
    mobileTeamMenu.hidden = !open;
    mobileTeamToggle.setAttribute('aria-expanded', String(open));
  };

  const setMobileMenu = open => {
    if (!toggle || !mobileMenu) return;
    mobileMenu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('mobile-menu-open', open);
    if (!open) setMobileDropdown(false);
  };

  if (toggle && mobileMenu) {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'mobileMenu');
    toggle.addEventListener('click', () => setMobileMenu(!mobileMenu.classList.contains('open')));
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => setMobileMenu(false));
    });
  }

  if (desktopDropdown && desktopTeamToggle) {
    desktopTeamToggle.addEventListener('click', () => {
      setDesktopDropdown(!desktopDropdown.classList.contains('is-open'));
    });
    desktopDropdown.addEventListener('focusout', event => {
      if (!desktopDropdown.contains(event.relatedTarget)) setDesktopDropdown(false);
    });
  }

  if (mobileDropdown && mobileTeamToggle) {
    mobileTeamToggle.addEventListener('click', () => {
      setMobileDropdown(!mobileDropdown.classList.contains('is-open'));
    });
  }

  document.addEventListener('click', event => {
    if (desktopDropdown && !desktopDropdown.contains(event.target)) setDesktopDropdown(false);
    if (toggle && mobileMenu && !toggle.contains(event.target) && !mobileMenu.contains(event.target)) setMobileMenu(false);
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const desktopWasOpen = desktopDropdown && desktopDropdown.classList.contains('is-open');
    const mobileDropdownWasOpen = mobileDropdown && mobileDropdown.classList.contains('is-open');
    if (desktopWasOpen) {
      setDesktopDropdown(false);
      desktopTeamToggle.focus();
    } else if (mobileDropdownWasOpen) {
      setMobileDropdown(false);
      mobileTeamToggle.focus();
    } else if (mobileMenu && mobileMenu.classList.contains('open')) {
      setMobileMenu(false);
      toggle.focus();
    }
  });
})();
