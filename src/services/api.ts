import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Asegúrate de que la URL base sea correcta
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

export const fetchQuotes = async () => {
  const response = await api.get('/quotes');
  if (!response.ok) {
    throw new Error('Error al obtener las citas');
  }
  return response.data;
};
