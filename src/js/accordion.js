
const initAccordion = () => {
  const accordionButtons = document.querySelectorAll('.accordion__header');

  accordionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const content = button.nextElementSibling;

      // abre/cierra
      content.classList.toggle('hidden');

      // rota flecha (estado visual)
      button.classList.toggle('is-open');
    });
  });
};

export default initAccordion;