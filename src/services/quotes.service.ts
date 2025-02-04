import axios from 'axios';

const API_URL = 'http://localhost:5000/api/quotes';

export const createQuote = async (quoteData) => {
  const response = await axios.post(API_URL, quoteData);
  return response.data;
};

export const getQuotes = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const updateQuote = async (id, quoteData) => {
  const response = await axios.put(`${API_URL}/${id}`, quoteData);
  return response.data;
};

export const deleteQuote = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar la cotización:', error);
    throw error;
  }
};