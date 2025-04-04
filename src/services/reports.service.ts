import api from '../utils/api';

export const getInventoryReport = async () => {
  const { data } = await api.get('/reports/inventory');
  return data;
};

export const getQuotesReport = async (startDate: string, endDate: string, status?: string) => {
  const { data } = await api.get('/reports/quotes', {
    params: { startDate, endDate, status }
  });
  return data;
};

export const getReceptionsReport = async (startDate: string, endDate: string, status?: string) => {
  const { data } = await api.get('/reports/receptions', {
    params: { startDate, endDate, status }
  });
  return data;
};

export const getSalesReport = async (startDate: string, endDate: string) => {
  const { data } = await api.get('/reports/sales', {
    params: { startDate, endDate }
  });
  return data;
};