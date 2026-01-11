'use strict';

const bindAccordion = () => {
  const buttons = document.querySelectorAll('.accordion__header');
  if (!buttons.length) return;

  buttons.forEach((button) => {
    // Avoid double-binding if init runs more than once
    if (button.dataset.accordionBound === 'true') return;
    button.dataset.accordionBound = 'true';

    button.addEventListener('click', (ev) => {
      ev.preventDefault();

      const content = button.nextElementSibling;
      if (!content) return;

      const isOpen = button.classList.contains('is-open');

      // Close all
      buttons.forEach((btn) => {
        btn.classList.remove('is-open');
        const c = btn.nextElementSibling;
        if (c) c.classList.add('hidden');
      });

      // Toggle current
      if (!isOpen) {
        button.classList.add('is-open');
        content.classList.remove('hidden');
      } else {
        // If it was open, keep it closed (toggle)
        button.classList.remove('is-open');
        content.classList.add('hidden');
      }
    });
  });
};

const initAccordion = () => {
  // If called before the HTML is rendered (partials), wait for DOM.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindAccordion, { once: true });
    return;
  }
  bindAccordion();
};

export default initAccordion;
