
const initAccordion = () => {
  const buttons = document.querySelectorAll('.accordion__header');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const content = button.nextElementSibling;
      const isOpen = button.classList.contains('is-open');

      buttons.forEach((btn) => {
        btn.classList.remove('is-open');
        btn.nextElementSibling.classList.add('hidden');
      });

      if (!isOpen) {
        button.classList.add('is-open');
        content.classList.remove('hidden');
      }
    });
  });
};


export default initAccordion;


