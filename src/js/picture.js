'use strict';

// =============================
// NASA EPIC (Earth Polychromatic Imaging Camera)
// https://api.nasa.gov/
// =============================

const NASA_API_KEY = 'DEMO_KEY';

function setPreviewLoading(isLoading, msg = '') {
  const status = document.querySelector('#apodStatus');
  const img = document.querySelector('#apodImage');
  const video = document.querySelector('#apodVideo');

  if (!status || !img || !video) return;

  status.textContent = msg;

  if (isLoading) {
    img.hidden = true;
    video.hidden = true;
  }
}

function setPreviewImage(url) {
  const img = document.querySelector('#apodImage');
  const video = document.querySelector('#apodVideo');
  const status = document.querySelector('#apodStatus');

  if (!img || !video || !status) return;

  img.src = url;
  img.style.width = '';
  img.style.height = '';
  img.hidden = false;

  // EPIC solo es imagen; ocultamos el iframe
  video.src = '';
  video.hidden = true;

  status.textContent = '';
}

async function fetchWikimediaAstronomyImage() {
  const endpoint = 'https://commons.wikimedia.org/w/api.php?' + new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    generator: 'categorymembers',
    gcmtitle: 'Category:Astronomy',
    gcmtype: 'file',
    gcmlimit: '20',
    prop: 'imageinfo',
    iiprop: 'url'
  });

  const res = await fetch(endpoint);
  if (!res.ok) {
    throw new Error('Error cargando imagen alternativa (Wikimedia)');
  }

  const data = await res.json();
  const pages = data?.query?.pages;
  if (!pages) {
    throw new Error('No se encontraron imágenes alternativas');
  }

  const images = Object.values(pages)
    .map(p => p.imageinfo?.[0]?.url)
    .filter(Boolean);

  if (images.length === 0) {
    throw new Error('No se encontraron URLs de imágenes alternativas');
  }

  return images[Math.floor(Math.random() * images.length)];
}

async function fetchEpicImageByDate(dateStr) {
  const endpoint = `https://api.nasa.gov/EPIC/api/natural/date/${dateStr}?api_key=${NASA_API_KEY}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(endpoint, { signal: controller.signal });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const msg = data?.msg || data?.error?.message || data?.message || 'Error consultando NASA EPIC';
      throw new Error(`NASA EPIC error ${res.status}: ${msg}`);
    }

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('No hay imágenes EPIC para esa fecha. Prueba otra (p. ej. 2023-01-01).');
    }

    const first = data[0];
    const imageName = first.image;

    if (!imageName) {
      throw new Error('Respuesta EPIC inválida (no viene el nombre de la imagen).');
    }

    const [yyyy, mm, dd] = dateStr.split('-');
    return `https://epic.gsfc.nasa.gov/archive/natural/${yyyy}/${mm}/${dd}/png/${imageName}.png`;
  } catch (err) {
    if (err?.name === 'AbortError') {
      throw new Error('La petición a NASA EPIC tardó demasiado (timeout).');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

function initEpicDatePicker() {
  const dateInput = document.querySelector('#date');
  const dateText = document.querySelector('.pic__text--date');

  if (!dateInput) return;

  // Limitar el date picker a hoy
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  dateInput.max = `${yyyy}-${mm}-${dd}`;

  dateInput.addEventListener('change', async (ev) => {
    const selectedDate = ev.target.value;
    if (!selectedDate) return;

    if (dateText) dateText.textContent = selectedDate;

    try {
      setPreviewLoading(true, 'Cargando imagen de la NASA…');

      const imageUrl = await fetchEpicImageByDate(selectedDate);
      setPreviewImage(imageUrl.replace(/^http:\/\//, 'https://'));
    } catch (err) {
      console.warn('NASA falló, usando imagen alternativa:', err);

      try {
        setPreviewLoading(true, 'NASA está saturada. Cargando imagen alternativa del espacio…');

        const fallbackUrl = await fetchWikimediaAstronomyImage();
        setPreviewImage(fallbackUrl.replace(/^http:\/\//, 'https://'));
      } catch (fallbackErr) {
        console.error(fallbackErr);
        setPreviewLoading(true, 'No se pudo cargar ninguna imagen. Inténtalo más tarde.');
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initEpicDatePicker();
});