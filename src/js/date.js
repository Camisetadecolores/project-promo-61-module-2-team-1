const initDateText = () => {
  const dateInput = document.querySelector('#date');
  const dateSpan = document.querySelector('.pic__text--date');

  const formatDateES = (isoDate) => {
    const date = new Date(isoDate);

    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  dateInput.addEventListener('change', () => {
    dateSpan.textContent = formatDateES(dateInput.value);
  });
};

export default initDateText;