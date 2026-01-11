import { loadData, saveData } from './storage.js';

function initSignature() {
  const input = document.querySelector('#signature');
  const signatureEl = document.querySelector('#postcardSignature');

  if (!input || !signatureEl) return;

  function applySignature(value) {
    const clean = (value || '').trim();
    signatureEl.textContent = clean ? clean : '';
  }

  // LOCALSTORAGE
  const data = loadData();
  if (data.signature) {
    input.value = data.signature;
    applySignature(data.signature);
  } else {
    applySignature(input.value); 
  }

  input.addEventListener('input', () => {
    applySignature(input.value);
    saveData({ signature: input.value });
  });
}

export default initSignature;