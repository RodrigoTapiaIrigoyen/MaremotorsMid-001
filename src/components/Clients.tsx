import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // Asegúrate de que la URL base sea correcta
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;