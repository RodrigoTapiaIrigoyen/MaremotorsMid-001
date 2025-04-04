import api from '../utils/api'; // Importa la instancia centralizada de Axios

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

export const getQuotes = async (): Promise<Quote[]> => {
  try {
    const response = await api.get<Quote[]>('/quotes'); // Usa la instancia de Axios
    return response.data;
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return [];
  }
};

export const createQuote = async (quote: Quote): Promise<Quote> => {
  try {
    const response = await api.post<Quote>('/quotes', quote); // Usa la instancia de Axios
    return response.data;
  } catch (error) {
    console.error('Error creating quote:', error);
    throw error;
  }
};

export const updateQuote = async (id: string, quote: Quote): Promise<Quote> => {
  try {
    const response = await api.put<Quote>(`/quotes/${id}`, quote); // Usa la instancia de Axios
    return response.data;
  } catch (error) {
    console.error('Error updating quote:', error);
    throw error;
  }
};

export const deleteQuote = async (id: string): Promise<void> => {
  try {
    await api.delete(`/quotes/${id}`); // Usa la instancia de Axios
  } catch (error) {
    console.error('Error deleting quote:', error);
    throw error;
  }
};