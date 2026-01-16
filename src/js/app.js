
import { createCard } from './api.js';

const state = {
  photo: '',
  message: '',
  font: '',
  color: '',
  signature: '',
  position: '',
};

const FONT_MAP = {
  'dancing-script': '"Dancing Script", cursive',
  'playfair-display': '"Playfair Display", serif',
  montserrat: '"Montserrat", sans-serif',
  roboto: '"Roboto", sans-serif',
};

function getUI() {
  return {
    status: document.querySelector('#apodStatus'),
    img: document.querySelector('#apodImage'),
    font: document.querySelector('#font'),
    color: document.querySelector('#color'),
    signatureInput: document.querySelector('#signature'),
    messagePreview: document.querySelector('#postcardMessage'),
    signaturePreview: document.querySelector('#postcardSignature'),
    btnReset: document.querySelector('#btnReset'),
    btnFinish: document.querySelector('#btnFinish'),
    date: document.querySelector('#date'),
  };
}

function updateStateFromUI(ui) {
  state.photo = ui.img?.src || '';
  state.message = ui.messagePreview?.textContent || '';
  state.font = ui.font?.value || '';
  state.color = ui.color?.value || '';
  state.signature = ui.signaturePreview?.textContent || ui.signatureInput?.value || '';
}

function render(ui) {
  const cssFont = FONT_MAP[state.font] || '';

  if (ui.messagePreview) {
    ui.messagePreview.style.fontFamily = cssFont;
    ui.messagePreview.style.color = state.color || '';
  }
  if (ui.signaturePreview) {
    ui.signaturePreview.style.fontFamily = cssFont;
    ui.signaturePreview.style.color = state.color || '';
  }
}

function mapStateToApiData() {
  return {
    photo: state.photo,
    field1: 1,
    field2: state.message,
    field3: state.font,
    field4: state.color,
    field5: state.signature,
  };
}

function handleFinish(ui, ev) {
  ev.preventDefault();

  if (!ui.date?.value) {
    if (ui.status) ui.status.textContent = 'Elige una fecha antes de continuar.';
    return;
  }
  if (!state.photo) {
    if (ui.status) ui.status.textContent = 'Primero genera una imagen.';
    return;
  }

  if (ui.status) ui.status.textContent = 'Creando tarjeta...';

  createCard(mapStateToApiData())
    .then((response) => {

      console.log('[POST response]', response);

      const cardURL = response?.cardURL || response?.cardUrl || response?.url;
      if (cardURL) {
        window.location.href = cardURL;
        return;
      }

      const id =
        response?.infoID ||
        response?.infoId ||
        response?.id ||
        response?.uuid ||
        response?.data?.id ||
        response?.data?.uuid;

      if (response?.success && id) {
        window.location.href = `finalCard-share.html?id=${id}`;
        return;
      }

      if (ui.status) ui.status.textContent = response?.error || 'Error al crear la tarjeta';
    })
    .catch((err) => {
      console.log('[POST error]', err);
      if (ui.status) ui.status.textContent = 'Error de red. Inténtalo de nuevo.';
    });
}

function handleReset(ev) {
  ev.preventDefault();
  location.reload();
}

function addListeners(ui) {
  ui.font?.addEventListener('change', () => {
    updateStateFromUI(ui);
    render(ui);
  });

  ui.color?.addEventListener('change', () => {
    updateStateFromUI(ui);
    render(ui);
  });

  ui.signatureInput?.addEventListener('input', () => {
    updateStateFromUI(ui);
    render(ui);
  });

  ui.btnFinish?.addEventListener('click', (ev) => {
    updateStateFromUI(ui);
    render(ui);
    handleFinish(ui, ev);
  });

  ui.btnReset?.addEventListener('click', handleReset);
}

export default function initApp() {
  const ui = getUI();
  if (!ui.btnFinish && !ui.btnReset) return;

  updateStateFromUI(ui);
  render(ui);
  addListeners(ui);
}