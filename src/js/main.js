'use strict';

// Imports (UI)
import initDateText from './date';
import initFormSelects from './formSelects';
import initFontButtons from './font';
import initColorButtons from './colorfont';
import initPositionButtons from './position';
import initSignature from './signature';
import initAccordion from './accordion';
import initiReset from './reset';
import initApp from './app';
import initShare from './share';
import { initPhrasePicker } from './phrases.js';
import { initFinalCardShare } from './finalCardShare.js';

// 🌿 Naturaleza por fecha (Pexels)
import './picture.js';

document.addEventListener('DOMContentLoaded', () => {
  // Si estás en la pantalla final, NO hace falta inicializar el formulario
  const isFinal = window.location.pathname.includes('finalCard-share');

  if (isFinal) {
    // 1) Pintar imagen / mensaje / firma
    initShare();

    // 2) Activar descarga + WhatsApp + Instagram (botones)
    initFinalCardShare();

    return; // cortamos aquí para no ejecutar initApp()
  }

  // Página del formulario (normal)
  initAccordion();
  initDateText();
  initFormSelects();
  initFontButtons();
  initColorButtons();
  initPositionButtons();
  initSignature();
  initiReset();

  initPhrasePicker();
  initApp();
});