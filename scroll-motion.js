/* Progressive enhancement: content is visible even if JS is unavailable. */
(() => {
  'use strict';
  if (!('IntersectionObserver' in window) || !Element.prototype.animate || !window.matchMedia) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches) return;
  const selectors = [
    '.section-heading > h2', '.section-heading > p:not(.eyebrow)',
    '.photo-ribbon > figure', '.about-grid > img', '.about-card > p', '.about-card > ul',
    '.service-strip > a', '.case-grid > article', '.article-list > a', '.social-grid > a',
    '.partners > div', '.contact-panel > h2', '.contact-panel > p:not(.eyebrow):not(.copy-status)',
    '.article-body > section > h2', '.article-body > section > p',
    '.article-body > h2', '.article-body > p', '.article-body > figure', '.article-body > ul',
    '.related', '.article-cta'
  ];
  const targets = Array.from(document.querySelectorAll(selectors.join(',')));
  const active = new Map();
  const seen = new WeakSet();
  function cancelAll() {
    active.forEach(animation => animation.cancel());
    active.clear();
  }
  function show(target) {
    seen.add(target);
    observer.unobserve(target);
    const animation = active.get(target);
    if (animation) { animation.cancel(); active.delete(target); }
  }
  const observer = new IntersectionObserver(entries => {
    const entering = entries.filter(entry => entry.isIntersecting && !seen.has(entry.target));
    entering.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left);
    entering.forEach((entry, index) => {
      const element = entry.target;
      show(element);
      if (reduced.matches || document.hidden || element.contains(document.activeElement)) return;
      try {
        const animation = element.animate([
          { opacity: 0.18, translate: '0 16px' },
          { opacity: 1, translate: '0 0' }
        ], { duration: 520, delay: Math.min(index * 65, 195), easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
        active.set(element, animation);
        animation.onfinish = () => active.delete(element);
      } catch (_) { /* Unsupported animations never hide content. */ }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
  targets.forEach(element => {
    // Keep the initial viewport, including restored scroll positions, fully readable.
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) seen.add(element);
    else observer.observe(element);
  });
  document.addEventListener('focusin', event => {
    targets.forEach(element => { if (element.contains(event.target)) show(element); });
  });
  const stop = () => { observer.disconnect(); cancelAll(); };
  if (reduced.addEventListener) reduced.addEventListener('change', event => { if (event.matches) stop(); });
  else if (reduced.addListener) reduced.addListener(event => { if (event.matches) stop(); });
  window.addEventListener('beforeprint', cancelAll);
  window.addEventListener('pagehide', cancelAll);
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancelAll(); });
})();
