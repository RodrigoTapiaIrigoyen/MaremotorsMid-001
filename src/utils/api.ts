import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Cambia la URL según tu backend
});

export default api;
