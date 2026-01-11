import { loadData, saveData } from './storage.js';

const initDateText = () => {
  const dateInput = document.querySelector('#date');
  const dateSpan = document.querySelector('.pic__text--date');

  if (!dateInput || !dateSpan) return;

  const formatDateES = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const paintDate = () => {
    if (!dateInput.value) {
      dateSpan.textContent = '';
      return;
    }
    dateSpan.textContent = formatDateES(dateInput.value);
  };

  let isRestoring = false;

  dateInput.addEventListener('change', () => {
    paintDate();

    setTimeout(paintDate, 0);

    if (!isRestoring) {
      saveData({ date: dateInput.value });
    }
  });

  // LOCALSTORAGE
  const data = loadData();
  if (data.date) {
    dateInput.value = data.date;
    paintDate();

    isRestoring = true;
    setTimeout(() => {
      dateInput.dispatchEvent(new Event('change', { bubbles: true }));

      setTimeout(() => {
        paintDate();
        isRestoring = false;
      }, 0);
    }, 0);
  }
};

export default initDateText;