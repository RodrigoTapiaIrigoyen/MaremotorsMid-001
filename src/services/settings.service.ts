import api from './api';

export const getSettings = async () => {
  const { data } = await api.get('/settings');
  return data;
};

export const updateSettings = async (settingsData: any) => {
  const { data } = await api.put('/settings', settingsData);
  return data;
};

export const getCompanySettings = async () => {
  const { data } = await api.get('/settings/company');
  return data;
};

export const updateCompanySettings = async (companyData: any) => {
  const { data } = await api.put('/settings/company', companyData);
  return data;
};