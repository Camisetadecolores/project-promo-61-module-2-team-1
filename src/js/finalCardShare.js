// src/js/finalCardShare.js
// Share + download logic for the final polaroid.
// Buttons expected in the DOM:
// - #finalCard__button--download (button)
// - #finalCard__button--shareWA (a or button)
// - #finalCard__button--shareIG (button)
// Image expected:
// - #js-final-img (img)

function getFinalImageEl() {
  return document.querySelector("#js-final-img");
}

function getShareText() {
  const msg = document.querySelector("#js-final-message")?.textContent?.trim();
  const sig = document.querySelector("#js-final-signature")?.textContent?.trim();
  const base = [msg, sig].filter(Boolean).join(" — ");
  return base || "¡Mira mi polaroid!";
}

async function fetchBlobFromImage(imgEl) {
  const src = imgEl?.src;
  if (!src) throw new Error("No hay src en la imagen final");

  // If the image is served from a different origin without CORS headers, this can fail.
  const res = await fetch(src, { mode: "cors" });
  if (!res.ok) throw new Error(`No se pudo descargar la imagen: ${res.status}`);
  return await res.blob();
}

async function downloadImage() {
  const imgEl = getFinalImageEl();
  if (!imgEl?.src) {
    alert("Aún no hay imagen para descargar.");
    return;
  }

  try {
    const blob = await fetchBlobFromImage(imgEl);
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "polaroid.png";
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  } catch (err) {
    console.warn(err);

    // Fallback: try direct download (may open in new tab depending on browser)
    const a = document.createElement("a");
    a.href = imgEl.src;
    a.download = "polaroid.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}

async function shareWithWebShare({ preferFiles = false } = {}) {
  const imgEl = getFinalImageEl();
  const text = getShareText();
  const url = window.location.href;

  if (!navigator.share) return false;

  // Best for Instagram on mobile: share files
  if (preferFiles && imgEl?.src) {
    try {
      const blob = await fetchBlobFromImage(imgEl);
      const file = new File([blob], "polaroid.png", { type: blob.type || "image/png" });

      if (navigator.canShare && !navigator.canShare({ files: [file] })) {
        throw new Error("El navegador no soporta compartir archivos.");
      }

      await navigator.share({
        title: "Mi polaroid",
        text,
        files: [file],
      });

      return true;
    } catch (e) {
      console.warn("Fallo compartiendo con archivo:", e);
      // continue to text/url share fallback
    }
  }

  try {
    await navigator.share({
      title: "Mi polaroid",
      text: `${text}\n${url}`,
    });
    return true;
  } catch (e) {
    console.warn("Fallo compartiendo:", e);
    return false;
  }
}

function shareToWhatsApp() {
  const text = getShareText();
  const url = window.location.href;

  // Prefer native share sheet on mobile if available
  shareWithWebShare({ preferFiles: false }).then((shared) => {
    if (shared) return;

    // WhatsApp deep-link fallback
    const waUrl = `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;
    window.open(waUrl, "_blank", "noopener");
  });
}

function shareToInstagram() {
  // Instagram doesn't offer a reliable direct web "intent".
  // Best approach: use Web Share with files on mobile; fallback to download.
  shareWithWebShare({ preferFiles: true }).then((shared) => {
    if (shared) return;

    alert(
      "Instagram desde web no permite compartir directo.\n\n" +
        "Se descargará la imagen para que la compartas manualmente desde Instagram."
    );

    downloadImage();
  });
}

export function initFinalCardShare() {
  const btnDownload = document.querySelector("#finalCard__button--download");
  const btnShareWA = document.querySelector("#finalCard__button--shareWA");
  const btnShareIG = document.querySelector("#finalCard__button--shareIG");

  // If this page isn't loaded, don't crash other pages
  if (!btnDownload && !btnShareWA && !btnShareIG) return;

  if (btnDownload) {
    btnDownload.addEventListener("click", (ev) => {
      ev.preventDefault();
      downloadImage();
    });
  }

  if (btnShareWA) {
    btnShareWA.addEventListener("click", (ev) => {
      ev.preventDefault();
      shareToWhatsApp();
    });
  }

  if (btnShareIG) {
    btnShareIG.addEventListener("click", (ev) => {
      ev.preventDefault();
      shareToInstagram();
    });
  }
}
