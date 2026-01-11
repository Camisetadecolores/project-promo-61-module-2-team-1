const KEY = 'halleyData';

export function loadData() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch (e) {
    return {};
  }
}

export function saveData(partial) {
  const current = loadData();
  const next = { ...current, ...partial };
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function clearData() {
  localStorage.removeItem(KEY);
}