import api from './api';
import { Sale } from '../types';

export const getSales = async () => {
  const { data } = await api.get<Sale[]>('/sales');
  return data;
};

export const getSaleById = async (id: string) => {
  const { data } = await api.get<Sale>(`/sales/${id}`);
  return data;
};

export const createSale = async (saleData: Partial<Sale>) => {
  const { data } = await api.post<Sale>('/sales', saleData);
  return data;
};

export const updateSale = async (id: string, saleData: Partial<Sale>) => {
  const { data } = await api.put<Sale>(`/sales/${id}`, saleData);
  return data;
};

export const deleteSale = async (id: string) => {
  await api.delete(`/sales/${id}`);
};

export const getSalesStats = async (startDate: string, endDate: string) => {
  const { data } = await api.get(`/sales/stats?startDate=${startDate}&endDate=${endDate}`);
  return data;
};