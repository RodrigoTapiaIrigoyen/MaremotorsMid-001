import axios from 'axios';

export interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  currency: string;
}

const API_URL = 'http://localhost:5000/api/services';

export const getServices = async (): Promise<Service[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
};

export const createService = async (service: Service): Promise<Service> => {
  try {
    const response = await axios.post(API_URL, service);
    return response.data;
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
};

export const deleteService = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
};