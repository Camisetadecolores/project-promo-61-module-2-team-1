'use strict';

const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;
const FALLBACK_SRC = 'images/background-polaroid.png';

function ensureDefaultPreview() {
  const img = document.querySelector('#apodImage');
  const video = document.querySelector('#apodVideo');
  const status = document.querySelector('#apodStatus');

  if (!img || !video || !status) {
    console.warn('[picture.js] Faltan elementos en DOM (#apodStatus, #apodImage, #apodVideo).');
    return;
  }

  img.src = FALLBACK_SRC;
  img.hidden = false;

  video.src = '';
  video.hidden = true;
}

function setPreviewLoading(isLoading, msg = '') {
  const status = document.querySelector('#apodStatus');
  const img = document.querySelector('#apodImage');
  const video = document.querySelector('#apodVideo');

  if (!status || !img || !video) {
    console.warn('[picture.js] Faltan elementos en DOM (#apodStatus, #apodImage, #apodVideo).');
    return;
  }

  status.textContent = msg;

  if (isLoading) {
    img.hidden = true;
    video.hidden = true;
  } else {
    if (!img.src || img.src.endsWith('#') || img.src === window.location.href) {
      img.src = FALLBACK_SRC;
    }
    img.hidden = false;
    video.hidden = true;
  }
}

function setPreviewMedia({ url, credit = '' }) {
  const img = document.querySelector('#apodImage');
  const video = document.querySelector('#apodVideo');
  const status = document.querySelector('#apodStatus');

  if (!img || !video || !status) {
    console.warn('[picture.js] Faltan elementos en DOM (#apodStatus, #apodImage, #apodVideo).');
    return;
  }

  status.textContent = '';

  img.src = url;
  img.hidden = false;

  video.src = '';
  video.hidden = true;
}

function setPreviewError(message) {
  const status = document.querySelector('#apodStatus');
  const img = document.querySelector('#apodImage');
  const video = document.querySelector('#apodVideo');

  if (!status || !img || !video) return;

  status.textContent = message;

  img.src = FALLBACK_SRC;
  img.hidden = false;

  video.src = '';
  video.hidden = true;
}

function hashDateToIndex(dateStr, modulo) {
  let h = 0;
  for (let i = 0; i < dateStr.length; i++) {
    h = (h * 31 + dateStr.charCodeAt(i)) >>> 0;
  }
  return modulo === 0 ? 0 : (h % modulo);
}

async function fetchPexelsNatureByDate(dateStr) {
  if (!PEXELS_API_KEY) {
    throw new Error('Falta configurar VITE_PEXELS_API_KEY (crea un .env y reinicia Vite)');
  }

  const query = 'nature landscape';
  const perPage = 80;
  const page = hashDateToIndex(dateStr, 10) + 1; // 1..10

  const endpoint =
    'https://api.pexels.com/v1/search?' +
    new URLSearchParams({
      query,
      orientation: 'landscape',
      size: 'large',
      per_page: String(perPage),
      page: String(page),
    });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(endpoint, {
      signal: controller.signal,
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const msg = data?.error || data?.message || 'Error consultando Pexels';
      throw new Error(`Pexels error ${res.status}: ${msg}`);
    }

    const photos = data?.photos;
    if (!Array.isArray(photos) || photos.length === 0) {
      throw new Error('Pexels no devolvió fotos para la búsqueda.');
    }

    const idx = hashDateToIndex(dateStr, photos.length);
    const p = photos[idx];

    const url = p?.src?.large2x || p?.src?.original || p?.src?.large || p?.src?.medium;
    if (!url) throw new Error('Foto de Pexels sin URL usable.');

    const photographer = p?.photographer || 'Autor';
    const credit = `Foto de ${photographer} en Pexels`;

    return { url, credit };
  } catch (err) {
    if (err?.name === 'AbortError') {
      throw new Error('La petición a Pexels tardó demasiado (timeout).');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

function initNatureDatePicker() {
  const dateInput = document.querySelector('#date');
  const dateText = document.querySelector('.pic__text--date');

  if (!dateInput) {
    console.warn('[picture.js] No se encontró el input #date en esta página');
    return;
  }

  ensureDefaultPreview();

  console.log('[picture.js] Inicializado. Esperando selección de fecha…');

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  dateInput.max = `${yyyy}-${mm}-${dd}`;

  dateInput.addEventListener('change', async (ev) => {
    const selectedDate = ev.target.value;
    if (!selectedDate) return;

    console.log('[picture.js] Fecha seleccionada:', selectedDate);

    if (dateText) dateText.textContent = selectedDate;

    try {
      setPreviewLoading(true, 'Cargando imagen de naturaleza…');

      const pexels = await fetchPexelsNatureByDate(selectedDate);
      console.log('[picture.js] Imagen Pexels:', pexels.url);

      setPreviewMedia({
        url: pexels.url.replace(/^http:\/\//, 'https://'),
        credit: pexels.credit,
      });
    } catch (err) {
      console.error('[picture.js] Error cargando Pexels:', err);
      setPreviewError(
        `No se pudo cargar ninguna imagen de naturaleza. ${err?.message || ''}`.trim()
      );
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNatureDatePicker();
});