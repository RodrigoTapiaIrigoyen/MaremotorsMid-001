import api from './api';
import { Mechanic } from '../types';

export const getMechanics = async () => {
  const { data } = await api.get<Mechanic[]>('/mechanics');
  return data;
};

export const getMechanicById = async (id: string) => {
  const { data } = await api.get<Mechanic>(`/mechanics/${id}`);
  return data;
};

export const createMechanic = async (mechanicData: Partial<Mechanic>) => {
  const { data } = await api.post<Mechanic>('/mechanics', mechanicData);
  return data;
};

export const updateMechanic = async (id: string, mechanicData: Partial<Mechanic>) => {
  const { data } = await api.put<Mechanic>(`/mechanics/${id}`, mechanicData);
  return data;
};

export const deleteMechanic = async (id: string) => {
  await api.delete(`/mechanics/${id}`);
};

export const addTask = async (id: string, taskData: any) => {
  const { data } = await api.post(`/mechanics/${id}/tasks`, taskData);
  return data;
};

export const updateTaskStatus = async (mechanicId: string, taskId: string, status: string) => {
  const { data } = await api.put(`/mechanics/${mechanicId}/tasks/${taskId}`, { status });
  return data;
};