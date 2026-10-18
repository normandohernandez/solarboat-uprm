(function () {
  'use strict';

  const system = window.SolarBoatEventSystem;
  const events = Array.isArray(window.SOLAR_BOAT_EVENTS) ? window.SOLAR_BOAT_EVENTS : [];
  const script = document.currentScript;
  const shouldAutoOpen = script && script.dataset.autoOpen === 'true';
  const manualTriggers = [...document.querySelectorAll('[data-event-popup-open]')];
  if (!system) return;

  const featuredEvent = system.selectEvent(events, { respectCooldown: false });
  const automaticEvent = shouldAutoOpen
    ? system.selectEvent(events, { respectCooldown: true })
    : null;

  manualTriggers.forEach(trigger => { trigger.hidden = !featuredEvent; });
  if (!featuredEvent && !automaticEvent) return;

  let lastFocused = null;
  let previousOverflow = '';
  let currentEvent = null;
  let automaticOpening = false;
  let closeTimer = null;

  const create = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };

  const overlay = create('div', 'event-popup-overlay');
  overlay.hidden = true;
  overlay.setAttribute('aria-hidden', 'true');

  const dialog = create('section', 'event-popup');
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'event-popup-title');
  dialog.setAttribute('aria-describedby', 'event-popup-description');
  dialog.setAttribute('tabindex', '-1');
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  const buildPlaceholder = media => {
    media.classList.add('event-popup-media-placeholder');
    media.innerHTML = '<div class="event-popup-mark" aria-hidden="true"><span></span><span></span><span></span></div><p>Solar Boat UPRM</p>';
  };

  const buildMedia = event => {
    const media = create('div', 'event-popup-media');
    if (!event.image) {
      buildPlaceholder(media);
      return media;
    }
    const image = create('img');
    image.src = event.image;
    image.alt = event.imageAlt || '';
    image.addEventListener('error', () => {
      media.replaceChildren();
      buildPlaceholder(media);
    }, { once: true });
    media.appendChild(image);
    return media;
  };

  const buildContent = event => {
    const content = create('div', 'event-popup-content');
    content.appendChild(create('span', 'event-popup-eyebrow', system.getCategory(event)));

    const title = create('h2', 'event-popup-title', event.title);
    title.id = 'event-popup-title';
    content.appendChild(title);

    const description = create('p', 'event-popup-description', event.description);
    description.id = 'event-popup-description';
    content.appendChild(description);

    const detailsData = system.getDetails(event);
    if (detailsData.length) {
      const details = create('dl', 'event-popup-details');
      detailsData.forEach(detailData => {
        const item = create('div', 'event-popup-detail');
        item.appendChild(create('dt', '', detailData.label));
        item.appendChild(create('dd', '', detailData.value));
        details.appendChild(item);
      });
      content.appendChild(details);
    }

    if (event.buttonText) {
      if (system.isValidActionUrl(event.buttonUrl, window.location.href)) {
        const action = create('a', 'btn btn-primary event-popup-action', event.buttonText);
        action.href = event.buttonUrl;
        content.appendChild(action);
      } else {
        const action = create('button', 'btn btn-primary event-popup-action', event.buttonText);
        action.type = 'button';
        action.disabled = true;
        action.setAttribute('aria-disabled', 'true');
        content.appendChild(action);
      }
    }
    return content;
  };

  const render = event => {
    dialog.replaceChildren();
    const closeButton = create('button', 'event-popup-close');
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', 'Close event announcement');
    closeButton.innerHTML = '<span aria-hidden="true">&times;</span>';
    closeButton.addEventListener('click', close);
    dialog.append(closeButton, buildMedia(event), buildContent(event));
    return closeButton;
  };

  const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function close() {
    if (overlay.hidden || !currentEvent) return;
    if (automaticOpening) system.dismiss(currentEvent, window.localStorage);
    overlay.classList.remove('is-visible');
    overlay.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = previousOverflow;
    document.removeEventListener('keydown', handleKeydown);
    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(() => { overlay.hidden = true; }, 220);
    if (lastFocused && document.contains(lastFocused)) lastFocused.focus();
    currentEvent = null;
    automaticOpening = false;
  }

  function handleKeydown(eventObject) {
    if (eventObject.key === 'Escape') {
      eventObject.preventDefault();
      close();
      return;
    }
    if (eventObject.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll(focusableSelector)];
    if (!focusable.length) {
      eventObject.preventDefault();
      dialog.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (eventObject.shiftKey && document.activeElement === first) {
      eventObject.preventDefault();
      last.focus();
    } else if (!eventObject.shiftKey && document.activeElement === last) {
      eventObject.preventDefault();
      first.focus();
    }
  }

  const open = (event, options) => {
    if (!event || currentEvent) return;
    window.clearTimeout(closeTimer);
    currentEvent = event;
    automaticOpening = Boolean(options && options.automatic);
    lastFocused = document.activeElement;
    previousOverflow = document.documentElement.style.overflow;
    const closeButton = render(event);
    overlay.hidden = false;
    overlay.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeydown);
    requestAnimationFrame(() => {
      overlay.classList.add('is-visible');
      closeButton.focus();
    });
  };

  overlay.addEventListener('click', eventObject => {
    if (eventObject.target === overlay) close();
  });

  manualTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => open(featuredEvent, { automatic: false }));
  });

  // Evaluated and scheduled only once during initial page execution. A cooldown
  // expiring while someone browses never causes a surprise mid-session popup.
  if (automaticEvent) window.setTimeout(() => open(automaticEvent, { automatic: true }), 1000);
})();
