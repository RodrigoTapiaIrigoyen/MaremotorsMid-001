import axios from 'axios';

export interface Service {
  id: string;
  name: string;
  quantity: number;
  precioVenta: number;
}

export interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Quote {
  _id?: string;
  reception: string;
  client: string;
  user: string;
  mechanic: string;
  date: string;
  documentType: string;
  status: string;
  discount: number;
  unit: string;
  total: number;
  services: Service[];
  products: Product[];
}

const API_URL = 'http://localhost:5000/api/quotes';

export const getQuotes = async (): Promise<Quote[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return [];
  }
};

export const createQuote = async (quote: Quote): Promise<Quote> => {
  try {
    const response = await axios.post(API_URL, quote);
    return response.data;
  } catch (error) {
    console.error('Error creating quote:', error);
    throw error;
  }
};

export const updateQuote = async (id: string, quote: Quote): Promise<Quote> => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, quote);
    return response.data;
  } catch (error) {
    console.error('Error updating quote:', error);
    throw error;
  }
};

export const deleteQuote = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Error deleting quote:', error);
    throw error;
  }
};