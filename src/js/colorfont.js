import { loadData, saveData } from './storage.js';

function initColorButtons() {
  const container = document.querySelector('#form__color');
  const colorInput = document.querySelector('#color');
  const messageEl = document.querySelector('#postcardMessage');
  const signatureEl = document.querySelector('#postcardSignature');

  if (!container || !colorInput || !messageEl) return;

  function applyColor(color) {
    colorInput.value = color || '';

    messageEl.style.color = color || 'inherit';
    if (signatureEl) signatureEl.style.color = color || 'inherit';
  }

  // LOCALSTORAGE
  const data = loadData();
  if (data.color) {
    applyColor(data.color);
  }

  container.addEventListener('click', (ev) => {
    const btn = ev.target.closest('.form__colorOption');
    if (!btn) return;

    const color = btn.dataset.value; // "#000000", "#ffffff", etc.
    if (!color) return;

    applyColor(color);
    saveData({ color });
  });
}

export default initColorButtons;