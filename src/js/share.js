
import { getCard } from './api.js';

export default function initShare() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) return;

  getCard(id).then((res) => {
    const card = res?.data; 
    if (!res?.success || !card) {
      console.log('[share.js] respuesta inválida:', res);
      return;
    }

    const img = document.querySelector('#js-final-img');
    const message = document.querySelector('#js-final-message');
    const signature = document.querySelector('#js-final-signature');

    if (img) img.src = card.photo || '';

    if (message) {
      message.textContent = card.field2 || '';
      message.style.fontFamily = card.field3 || '';
      message.style.color = card.field4 || '';
    }

    if (signature) {
      signature.textContent = card.field5 || '';
      signature.style.fontFamily = card.field3 || '';
      signature.style.color = card.field4 || '';
    }
  });
}