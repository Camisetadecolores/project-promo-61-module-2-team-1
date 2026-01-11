const initFormSelects = () => {
  const form = document.querySelector('#form--inputs');
  if (!form) return;

  const containerPhrase = document.querySelector('#form__phraseType');
  const containerFont = document.querySelector('#form__phraseFont');
  const containerPosition = document.querySelector('#form__phrasePosition');
  const containerColor = document.querySelector('#form__color');

  const phrase = document.querySelector('#phraseType');
  const font = document.querySelector('#font');
  const position = document.querySelector('#phrasePosition');
  const color = document.querySelector('#color');

  if (
    !containerPhrase ||
    !containerFont ||
    !containerPosition ||
    !containerColor ||
    !phrase ||
    !font ||
    !position ||
    !color
  ) return;

  const clicksDetected = (container, hiddenInput, buttonSelector, storageKey) => {
    // 🔁 Restaurar estado desde localStorage
    const savedValue = localStorage.getItem(storageKey);
    if (savedValue) {
      container.querySelectorAll(buttonSelector).forEach((button) => {
        if (button.dataset.value === savedValue) {
          button.classList.add('is-selected');
          hiddenInput.value = savedValue;
        }
      });
    }


    container.addEventListener('click', (ev) => {
      const clickedButton = ev.target.closest(buttonSelector);
      if (!clickedButton) return;

      container.querySelectorAll(buttonSelector).forEach((button) => {
        button.classList.remove('is-selected');
      });

      clickedButton.classList.add('is-selected');
      hiddenInput.value = clickedButton.dataset.value;

      // LOCALSTORAGE
      localStorage.setItem(storageKey, clickedButton.dataset.value);
    });
  };

  clicksDetected(containerPhrase, phrase, '.form__option', 'phraseType');
  clicksDetected(containerFont, font, '.form__option', 'font');
  clicksDetected(containerPosition, position, '.form__option', 'position');
  clicksDetected(containerColor, color, '.form__colorOption', 'color');
};

export default initFormSelects;