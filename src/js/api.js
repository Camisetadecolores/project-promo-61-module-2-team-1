const API_URL = 'https://dev.adalab.es';

export const createCard = (data) => {
  return fetch(`${API_URL}/api/info/data`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then((res) => res.json());
};

export const getCard = (id) => {
  return fetch(`${API_URL}/api/info/${id}`).then((res) => res.json());
};