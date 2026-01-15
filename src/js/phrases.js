// src/js/phrases.js

const TAGS_BY_TYPE = {
  romantic: "love|romance",
  motivational: "motivational",
  inspirational: "inspirational",
};

const FALLBACKS = {
  romantic: [
    "Contigo, hasta el universo parece más cerca.",
    "Eres mi lugar favorito en este planeta.",
  ],
  motivational: [
    "Hazlo con miedo, pero hazlo.",
    "Paso a paso también se llega lejos.",
  ],
  inspirational: [
    "Mira al cielo: todo cambia, todo pasa.",
    "Tu luz también cuenta, incluso en días oscuros.",
  ],
};

function setActive(buttonsContainer, clickedBtn) {
  const buttons = buttonsContainer.querySelectorAll(".form__option");
  buttons.forEach((b) => b.classList.remove("is-active"));
  clickedBtn.classList.add("is-active");
}

function pickFallback(type) {
  const list = FALLBACKS[type] ?? FALLBACKS.inspirational;
  return list[Math.floor(Math.random() * list.length)];
}

async function fetchQuoteByType(type) {
  const tags = TAGS_BY_TYPE[type] ?? TAGS_BY_TYPE.inspirational;
  const url = `https://api.quotable.io/random?tags=${encodeURIComponent(tags)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Quotable error: ${res.status}`);

  const data = await res.json();
  // data.content -> frase
  return data.content;
}

export function initPhrasePicker() {
  const phraseTypeContainer = document.querySelector("#form__phraseType");
  const phraseTypeInput = document.querySelector("#phraseType");
  const postcardMessage = document.querySelector("#postcardMessage");

  if (!phraseTypeContainer || !phraseTypeInput || !postcardMessage) return;

  phraseTypeContainer.addEventListener("click", async (ev) => {
    const btn = ev.target.closest(".form__option");
    if (!btn) return;

    const type = btn.dataset.value; // romantic | motivational | inspirational

    // 1) UI selected
    setActive(phraseTypeContainer, btn);

    // 2) Guardar en input hidden (para que el form sea válido)
    phraseTypeInput.value = type;

    // 3) Traer frase y pintarla en la postal (si falla, fallback)
    postcardMessage.textContent = "Buscando una frase…";

    try {
      const quote = await fetchQuoteByType(type);
      postcardMessage.textContent = quote;
    } catch (err) {
      console.warn(err);
      postcardMessage.textContent = pickFallback(type);
    }
  });
}