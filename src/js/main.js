'use strict';

// Imports (UI)
import initDateText from './date';
import initFormSelects from './formSelects';
import initFontButtons from './font';
import initColorButtons from './colorfont';
import initPositionButtons from './position';
import initSignature from './signature';
import initActions from './actions';
import initAccordion from './accordion';

// 🌿 Naturaleza por fecha (Pexels)
import './picture.js';

document.addEventListener('DOMContentLoaded', () => {
  initAccordion();
  initDateText();
  initFormSelects();
  initFontButtons();
  initColorButtons();
  initPositionButtons();
  initSignature();
  initActions();
});
