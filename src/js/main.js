'use strict';

// Imports (UI)
import initDateText from './date';
import initFormSelects from './formSelects';
import initFontButtons from './font';
import initColorButtons from './colorfont';
import initPositionButtons from './position';
import initSignature from './signature';
import initAccordion from './accordion';

import initApp from './app';
import initShare from './share';

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

if (window.location.pathname.includes('finalCard-share')) {
  console.log('[main] estoy en finalCard-share, llamo a initShare');
  initShare();
} else {
  initApp();
}
});
  initActions();


import { initPhrasePicker } from "./phrases.js";

initPhrasePicker();
