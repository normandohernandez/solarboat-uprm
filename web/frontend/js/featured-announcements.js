(function () {
  'use strict';

  const container = document.querySelector('[data-featured-announcements]');
  const system = window.SolarBoatEventSystem;
  const events = Array.isArray(window.SOLAR_BOAT_EVENTS) ? window.SOLAR_BOAT_EVENTS : [];
  if (!container || !system) return;

  const create = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };

  const buildPlaceholder = media => {
    media.classList.add('featured-announcement-media-placeholder');
    media.innerHTML = '<span class="featured-announcement-boat" aria-hidden="true"><i></i><i></i><i></i></span><span>Solar Boat UPRM</span>';
  };

  const buildMedia = event => {
    const media = create('div', 'featured-announcement-media');
    if (!event.image) {
      buildPlaceholder(media);
      return media;
    }

    const image = create('img');
    image.src = event.image;
    image.alt = event.imageAlt || '';
    image.loading = 'lazy';
    image.addEventListener('error', () => {
      media.replaceChildren();
      buildPlaceholder(media);
    }, { once: true });
    media.appendChild(image);
    return media;
  };

  const getDisplayDate = event => {
    if (event.eventDate) return { label: 'Event Date', value: event.eventDate };
    if (event.raffleDate) return { label: 'Raffle Date', value: event.raffleDate };
    return null;
  };

  const buildCard = event => {
    const article = create('article', 'featured-announcement-card reveal');
    article.appendChild(buildMedia(event));

    const content = create('div', 'featured-announcement-content');
    content.appendChild(create('span', 'featured-announcement-category', system.getCategory(event).toUpperCase()));
    content.appendChild(create('h3', 'featured-announcement-title', event.title));
    if (event.description) content.appendChild(create('p', 'featured-announcement-description', event.description));

    const displayDate = getDisplayDate(event);
    if (displayDate) {
      const date = create('p', 'featured-announcement-date');
      date.append(create('span', '', `${displayDate.label}: `), document.createTextNode(displayDate.value));
      content.appendChild(date);
    }

    if (system.isValidActionUrl(event.buttonUrl, window.location.href)) {
      const link = create('a', 'featured-announcement-link');
      link.href = event.buttonUrl;
      link.append(document.createTextNode('Learn More'), create('span', '', '↗'));
      link.lastElementChild.setAttribute('aria-hidden', 'true');
      content.appendChild(link);
    }

    article.appendChild(content);
    return article;
  };

  const eligibleEvents = system.getEligibleEvents(events, { respectCooldown: false }).slice(0, 3);
  if (!eligibleEvents.length) {
    const empty = create('div', 'featured-announcements-empty reveal');
    empty.appendChild(create('p', '', 'There are no active announcements at this time.'));
    container.appendChild(empty);
    return;
  }

  eligibleEvents.forEach(event => container.appendChild(buildCard(event)));
  container.classList.add(`has-${eligibleEvents.length}`);
})();
