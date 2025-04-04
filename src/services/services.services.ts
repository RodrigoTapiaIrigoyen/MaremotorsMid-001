import api from '../utils/api'; // Importa la instancia centralizada de Axios

export interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  currency: string;
}

export const getServices = async (): Promise<Service[]> => {
  try {
    const response = await api.get<Service[]>('/services'); // Usa la instancia de Axios
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
};

export const createService = async (service: Service): Promise<Service> => {
  try {
    const response = await api.post<Service>('/services', service); // Usa la instancia de Axios
    return response.data;
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
};

export const deleteService = async (id: string): Promise<void> => {
  try {
    await api.delete(`/services/${id}`); // Usa la instancia de Axios
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
};