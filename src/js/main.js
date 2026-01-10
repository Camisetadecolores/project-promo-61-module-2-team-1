'use strict';



console.log('>> Ready :)');
function initAccordions() {
  const accordions = document.querySelectorAll('.page__form .accordion');

  accordions.forEach((acc) => {
    const btn = acc.querySelector('.accordion__header');
    const content = acc.querySelector('.accordion__content');

    if (!btn || !content) return;

    // Estado inicial: cerrado (por si viene sin estilos)
    acc.classList.remove('is-open');
    content.style.height = '0px';

    btn.addEventListener('click', () => {
      const isOpen = acc.classList.contains('is-open');

      // Cerrar todos (solo 1 abierto)
      accordions.forEach((other) => {
        if (other === acc) return;
        closeAccordion(other);
      });

      // Toggle actual
      if (isOpen) {
        closeAccordion(acc);
      } else {
        openAccordion(acc);
      }
    });
  });

  function openAccordion(acc) {
    const content = acc.querySelector('.accordion__content');
    if (!content) return;

    acc.classList.add('is-open');

    // 1) poner height auto para medir
    content.style.height = 'auto';
    const fullHeight = content.scrollHeight;

    // 2) volver a 0 y en el siguiente frame animar a fullHeight
    content.style.height = '0px';
    requestAnimationFrame(() => {
      content.style.height = `${fullHeight}px`;
    });

    // 3) cuando termina la transición, dejar en auto (para que crezca si cambia contenido)
    const onEnd = (e) => {
      if (e.propertyName !== 'height') return;
      content.style.height = 'auto';
      content.removeEventListener('transitionend', onEnd);
    };
    content.addEventListener('transitionend', onEnd);
  }

  function closeAccordion(acc) {
    const content = acc.querySelector('.accordion__content');
    if (!content) return;

    // Si está en auto, fijamos su altura actual para poder animar a 0
    const currentHeight = content.scrollHeight;
    content.style.height = `${currentHeight}px`;

    requestAnimationFrame(() => {
      acc.classList.remove('is-open');
      content.style.height = '0px';
    });
  }
}

document.addEventListener('DOMContentLoaded', initAccordions);