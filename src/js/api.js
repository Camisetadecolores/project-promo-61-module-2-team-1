const API_URL = 'https://dev.adalab.es';

export function createCard(data) {
  return fetch(`${API_URL}/api/info/data`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}

export function getCard(uuid) {
  return fetch(`${API_URL}/api/info/${uuid}`).then((res) => res.json());
}