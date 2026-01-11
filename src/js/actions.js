import { clearData } from './storage.js';

function initActions() {
  const btnReset = document.querySelector('#btnReset');
  const btnFinish = document.querySelector('#btnFinish');

  const dateInput = document.querySelector('#date');
  const status = document.querySelector('#apodStatus');
  const img = document.querySelector('#apodImage');

  // RESET
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      clearData();

      localStorage.removeItem('phraseType');
      localStorage.removeItem('font');
      localStorage.removeItem('position');
      localStorage.removeItem('color');

      location.reload();
    });
  }

  // FINISH
  if (btnFinish) {
    btnFinish.addEventListener('click', () => {
      if (!dateInput || !dateInput.value) {
        return;
      }

      const hasImage = img && !img.hidden && img.src;
      if (!hasImage) {
        return;
      }

      window.location.href = 'finalCard-share.html';
    });
  }
}

export default initActions;