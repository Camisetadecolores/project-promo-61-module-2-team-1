import { loadData, saveData } from './storage.js';

function initPositionButtons() {
  const container = document.querySelector('#form__phrasePosition');
  const positionInput = document.querySelector('#phrasePosition');
  const postcard = document.querySelector('.postcard');

  if (!container || !positionInput || !postcard) return;

  function applyPosition(pos) {
    positionInput.value = pos || '';

    postcard.classList.remove('is-top', 'is-center', 'is-bottom');

    if (pos === 'start') postcard.classList.add('is-top');
    if (pos === 'center') postcard.classList.add('is-center');
    if (pos === 'end') postcard.classList.add('is-bottom');
  }

  // LOCALSTORAGE
  const data = loadData();
  if (data.position) {
    applyPosition(data.position);
  }

  container.addEventListener('click', (ev) => {
    const btn = ev.target.closest('.form__option');
    if (!btn) return;

    const pos = btn.dataset.value; 
    if (!pos) return;

    applyPosition(pos);
    saveData({ position: pos });
  });
}

export default initPositionButtons;