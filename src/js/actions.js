import buildCardData from './cardDataObject.js';
import { createCard } from './api.js';
import { clearData } from './storage.js';

function initActions() {
  const btnReset = document.querySelector('#btnReset');
  const btnFinish = document.querySelector('#btnFinish');

  // Si esta página no tiene estos botones, no hacemos nada (evita errores en otras páginas)
  if (!btnReset && !btnFinish) return;

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
      if (!dateInput?.value) {
        if (status) status.textContent = 'Elige una fecha antes de continuar.';
        return;
      }

      if (!img?.src) {
        if (status) status.textContent = 'Primero genera una imagen.';
        return;
      }

      const data = buildCardData();

      createCard(data)
        .then((response) => {
          if (response.success) {
            window.location.href = `finalCard-share.html?id=${response.infoID}`;
          } else {
            if (status) status.textContent = response.error || 'Error al crear la tarjeta';
          }
        })
        .catch(() => {
          if (status) status.textContent = 'Error de red. Inténtalo de nuevo.';
        });
    });
  }
}

export default initActions;