import api from './api';

export const createQuote = async (quoteData: {
  name: string;
  description: string;
}) => {
  const { data } = await api.post('/quotes', quoteData);
  return data;
};
