import { loadData, saveData } from './storage.js';

function initFontButtons() {
  const container = document.querySelector('#form__phraseFont');
  const fontInput = document.querySelector('#font');
  const messageEl = document.querySelector('#postcardMessage');
  const signatureEl = document.querySelector('#postcardSignature');

  if (!container || !fontInput || !messageEl) return;

  const FONT_MAP = {
    'dancing-script': '"Dancing Script", cursive',
    'playfair-display': '"Playfair Display", serif',
    'montserrat': '"Montserrat", sans-serif',
    'roboto': '"Roboto", sans-serif',
  };

  function applyFont(fontKey) {
    fontInput.value = fontKey || '';

    const cssFont = FONT_MAP[fontKey] || 'inherit';
    messageEl.style.fontFamily = cssFont;
    if (signatureEl) signatureEl.style.fontFamily = cssFont;
  }

  // LOCALSTORAGE
  const data = loadData();
  if (data.font) {
    applyFont(data.font);
  }

  container.addEventListener('click', (ev) => {
    const btn = ev.target.closest('.form__option');
    if (!btn) return;

    const fontKey = btn.dataset.value;
    applyFont(fontKey);
    saveData({ font: fontKey });
  });
}

export default initFontButtons;