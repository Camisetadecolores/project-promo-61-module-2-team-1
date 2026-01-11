function initAccordion() {
  const accordions = document.querySelectorAll('.accordion');
  if (!accordions.length) return;

  accordions.forEach((accordion) => {

    if (accordion.tagName.toLowerCase() === 'details') {
      accordion.addEventListener('toggle', () => {

        if (accordion.open) {
          accordions.forEach((other) => {
            if (other !== accordion && other.tagName.toLowerCase() === 'details') {
              other.removeAttribute('open');
              other.classList.remove('is-open');
            }
          });
        }

  
        accordion.classList.toggle('is-open', accordion.open);
      });


      accordion.classList.toggle('is-open', accordion.open);
      return;
    }


    const header = accordion.querySelector('.accordion__header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isOpen = accordion.classList.contains('is-open');


      accordions.forEach((other) => other.classList.remove('is-open'));


      if (!isOpen) accordion.classList.add('is-open');
    });
  });
}

export default initAccordion;