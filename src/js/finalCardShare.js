export function initFinalCardShare() {
  const container = document.querySelector('.main-finalCard');
  if (!container) return;

  const btnDownload = document.querySelector('#finalCard__button--download');
  const btnWA = document.querySelector('#finalCard__button--shareWA');
  const btnIG = document.querySelector('#finalCard__button--shareIG');

  // Genera la imagen desde TODO el DOM de la polaroid
  async function generateImage() {
    if (typeof window.html2canvas !== 'function') {
      alert('html2canvas no está cargado');
      throw new Error('html2canvas missing');
    }

    return await window.html2canvas(container, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
    });
  }

  // Canvas → Blob (con control de null)
  function canvasToBlob(canvas) {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) reject(new Error('No se pudo generar el PNG (blob null)'));
        else resolve(blob);
      }, 'image/png', 1);
    });
  }

  // 📥 Descargar
  if (btnDownload) {
    btnDownload.addEventListener('click', async () => {
      try {
        const canvas = await generateImage();
        const link = document.createElement('a');
        link.download = 'polaroid.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (e) {
        console.error(e);
      }
    });
  }

  // 🟢 WhatsApp
  if (btnWA) {
    btnWA.addEventListener('click', async (e) => {
      e.preventDefault();

      const text = 'Mira mi Polaroid ✨';
      const pageUrl = window.location.href;

      try {
        const canvas = await generateImage();
        const blob = await canvasToBlob(canvas);
        const file = new File([blob], 'polaroid.png', { type: 'image/png' });

        // ✅ MÓVIL / NAVEGADORES COMPATIBLES: Share Sheet con archivo
        const canShareFiles =
          !!navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }));

        if (canShareFiles) {
          await navigator.share({
            files: [file],
            text: `${text}\n${pageUrl}`,
          });
          return;
        }

        // 🔁 FALLBACK (desktop y móviles no compatibles):
        // WhatsApp web NO puede adjuntar imágenes desde un link → solo texto/URL
        // Descargamos el PNG para que lo adjuntes manualmente
        const link = document.createElement('a');
        link.download = 'polaroid.png';
        link.href = canvas.toDataURL('image/png');
        link.click();

        // Abrimos WhatsApp con texto + URL (esto sí es “link de compartir” real)
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${text}\n${pageUrl}`)}`,
          '_blank',
          'noopener'
        );

        alert(
          'Tu navegador no permite enviar la imagen directamente a WhatsApp.\n' +
          'He descargado la Polaroid para que la adjuntes manualmente en el chat.'
        );
      } catch (e) {
        console.error(e);

        // Último fallback: al menos abrir WhatsApp con texto + URL
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${text}\n${pageUrl}`)}`,
          '_blank',
          'noopener'
        );
      }
    });
  }

  // 🟣 Instagram
  if (btnIG) {
    btnIG.addEventListener('click', async () => {
      try {
        const canvas = await generateImage();
        const blob = await canvasToBlob(canvas);
        const file = new File([blob], 'polaroid.png', { type: 'image/png' });

        // ✅ MÓVIL (Share Sheet)
        if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
          await navigator.share({ files: [file] });
          return;
        }

        // 🔁 FALLBACK (descarga)
        const link = document.createElement('a');
        link.download = 'polaroid-instagram.png';
        link.href = canvas.toDataURL('image/png');
        link.click();

        alert(
          'Instagram no permite compartir directamente desde el navegador en escritorio.\n' +
          'La imagen se ha descargado para que puedas subirla manualmente.'
        );
      } catch (e) {
        console.error(e);
      }
    });
  }
}