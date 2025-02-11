import axios from "axios";

const API_URL = "http://localhost:5000/api/products"; // Ajusta según tu servidor

// Definimos el tipo de Producto
export interface Product {
  _id?: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  cost: number;
  currency: string;
}

// Obtener todos los productos
export const getProducts = async (): Promise<Product[]> => {
  const response = await axios.get<Product[]>(API_URL);
  return response.data;
};

// Crear un producto
export const createProduct = async (productData: Product): Promise<Product> => {
  const response = await axios.post<Product>(API_URL, productData);
  return response.data;
};

// Actualizar un producto
export const updateProduct = async (id: string, productData: Product): Promise<Product> => {
  const response = await axios.put<Product>(`${API_URL}/${id}`, productData);
  return response.data;
};

// Eliminar un producto
export const deleteProduct = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
