
import { clearData } from './storage.js';

export default function initReset() {
  const btnReset = document.querySelector('#btnReset');
  if (!btnReset) return;

  btnReset.addEventListener('click', (ev) => {
    ev.preventDefault();

    // storage
    clearData();
    ['phraseType', 'font', 'position', 'color'].forEach((k) => localStorage.removeItem(k));

    // visual 
    const dateInput = document.querySelector('#date');
    if (dateInput) dateInput.value = '';

    const img = document.querySelector('#apodImage');
    if (img) img.src = '';

    const form = document.querySelector('form');
    if (form) form.reset();

    // reload
    location.reload();
  });
}