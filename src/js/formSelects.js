
const initFormSelects = () => {
    const form = document.querySelector('#form--inputs');
        if (!form) return;
    const containerPhrase= document.querySelector('#form__phraseType');
    const containerFont= document.querySelector('#form__phraseFont');
    const containerPosition= document.querySelector('#form__phrasePosition');
    const containerColor= document.querySelector('#form__color');
    const phrase= document.querySelector('#phraseType');
    const font= document.querySelector('#font');
    const position= document.querySelector('#phrasePosition');
    const color= document.querySelector('#color');

        if (
        ! containerPhrase ||
        ! containerFont ||
        ! containerPosition ||
        ! containerColor ||
        ! phrase ||
        ! font ||
        ! position ||
        ! color
        ) return;


  const clicksDetected = (container, hiddenInput, buttonSelector) => {
    container.addEventListener('click', (ev) => {
      const clickedButton = ev.target.closest(buttonSelector);
      if (!clickedButton) return;

      container.querySelectorAll(buttonSelector).forEach((button) => {
        button.classList.remove('is-selected');
      });

      clickedButton.classList.add('is-selected');

      hiddenInput.value = clickedButton.dataset.value;
    });
  };

  clicksDetected(containerPhrase, phrase, '.form__option');
  clicksDetected(containerFont, font, '.form__option');
  clicksDetected(containerPosition, position, '.form__option');
  clicksDetected(containerColor, color, '.form__colorOption');

};


export default initFormSelects;



