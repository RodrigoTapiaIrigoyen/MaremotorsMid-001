import api from '../utils/api'; // Importa la instancia centralizada de Axios
import { Client } from '../types';

export const getClients = async () => {
  const { data } = await api.get<Client[]>('/clients');
  return data;
};

export const getClientById = async (id: string) => {
  const { data } = await api.get<Client>(`/clients/${id}`);
  return data;
};

export const createClient = async (clientData: Partial<Client>) => {
  const { data } = await api.post<Client>('/clients', clientData);
  return data;
};

export const updateClient = async (id: string, clientData: Partial<Client>) => {
  const { data } = await api.put<Client>(`/clients/${id}`, clientData);
  return data;
};

export const deleteClient = async (id: string) => {
  await api.delete(`/clients/${id}`);
};

export const getClientHistory = async (id: string) => {
  const { data } = await api.get(`/clients/${id}/history`);
  return data;
};