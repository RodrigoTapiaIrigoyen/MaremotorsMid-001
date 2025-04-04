import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? 'https://hammerhead-app-pz4dz.ondigitalocean.app/api' // URL del backend en producción
    : 'http://localhost:5000/api', // URL del backend en desarrollo
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;