// src/services/api.js
const API_BASE_URL = 'http://localhost:5000/api';

export const fetchQuotes = async () => {
  const response = await fetch(`${API_BASE_URL}/quotes`);
  if (!response.ok) {
    throw new Error('Error al obtener las citas');
  }
  return response.json();
};
