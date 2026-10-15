// Carrusel horizontal de fotos del equipo en la página Sobre nosotros.
(function () {
  const slideshow = document.querySelector('.about-slideshow');
  if (!slideshow) return;

  const track = slideshow.querySelector('.about-slides');
  const originals = [...track.querySelectorAll('.about-slide')];
  const dotsContainer = slideshow.querySelector('.about-slide-dots');
  const fallback = slideshow.querySelector('.about-slide-fallback');
  const previousButton = slideshow.querySelector('.about-slide-prev');
  const nextButton = slideshow.querySelector('.about-slide-next');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let position = 1;
  let current = 0;
  let timer = null;
  let pointerStart = null;
  let isAnimating = false;

  if (originals.length > 1) {
    const firstClone = originals[0].cloneNode(true);
    const lastClone = originals[originals.length - 1].cloneNode(true);
    firstClone.setAttribute('aria-hidden', 'true');
    lastClone.setAttribute('aria-hidden', 'true');
    track.prepend(lastClone);
    track.append(firstClone);
  }

  const updateTrack = animate => {
    const shouldAnimate = animate && !reducedMotion.matches;
    isAnimating = shouldAnimate;
    track.classList.toggle('is-jumping', !shouldAnimate);
    track.style.transform = `translate3d(-${position * 100}%, 0, 0)`;
  };

  const updateControls = () => {
    originals.forEach((slide, index) => {
      const active = index === current;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });
    [...dotsContainer.children].forEach((dot, index) => {
      const active = index === current;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-current', active ? 'true' : 'false');
    });
  };

  const goTo = (index, animate = true) => {
    current = ((index % originals.length) + originals.length) % originals.length;
    position = current + 1;
    updateTrack(animate);
    updateControls();
  };

  const next = () => {
    if (isAnimating) return;
    position += 1;
    current = (current + 1) % originals.length;
    updateTrack(true);
    updateControls();
  };

  const previous = () => {
    if (isAnimating) return;
    position -= 1;
    current = (current - 1 + originals.length) % originals.length;
    updateTrack(true);
    updateControls();
  };

  const stopAutoplay = () => {
    window.clearInterval(timer);
    timer = null;
  };

  const startAutoplay = () => {
    stopAutoplay();
    if (!reducedMotion.matches && originals.length > 1) {
      timer = window.setInterval(next, 5000);
    }
  };

  originals.forEach((slide, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'about-slide-dot';
    dot.setAttribute('aria-label', `Mostrar foto ${index + 1} de ${originals.length}`);
    dot.addEventListener('click', () => {
      goTo(index);
      startAutoplay();
    });
    dotsContainer.appendChild(dot);

    slide.addEventListener('error', () => {
      if (originals.every(image => image.complete && image.naturalWidth === 0)) {
        fallback.hidden = false;
        fallback.classList.add('is-visible');
        dotsContainer.hidden = true;
        previousButton.hidden = true;
        nextButton.hidden = true;
        stopAutoplay();
      }
    });
  });

  track.addEventListener('transitionend', event => {
    if (event.propertyName !== 'transform' || originals.length < 2) return;
    if (position === originals.length + 1) {
      position = 1;
      updateTrack(false);
    } else if (position === 0) {
      position = originals.length;
      updateTrack(false);
    } else {
      isAnimating = false;
    }
  });

  previousButton.addEventListener('click', () => { previous(); startAutoplay(); });
  nextButton.addEventListener('click', () => { next(); startAutoplay(); });

  track.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse') return;
    pointerStart = { x: event.clientX, y: event.clientY };
    stopAutoplay();
  });
  track.addEventListener('pointerup', event => {
    if (!pointerStart) return;
    const dx = event.clientX - pointerStart.x;
    const dy = event.clientY - pointerStart.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      dx < 0 ? next() : previous();
    }
    pointerStart = null;
    startAutoplay();
  });
  track.addEventListener('pointercancel', () => { pointerStart = null; startAutoplay(); });

  slideshow.addEventListener('mouseenter', stopAutoplay);
  slideshow.addEventListener('mouseleave', startAutoplay);
  slideshow.addEventListener('focusin', stopAutoplay);
  slideshow.addEventListener('focusout', event => {
    if (!slideshow.contains(event.relatedTarget)) startAutoplay();
  });
  reducedMotion.addEventListener?.('change', () => {
    updateTrack(false);
    startAutoplay();
  });

  goTo(0, false);
  startAutoplay();
})();
