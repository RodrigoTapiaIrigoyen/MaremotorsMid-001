import api from "../utils/api"; // Importa la instancia centralizada de Axios

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
  const response = await api.get<Product[]>("/products"); // Usa la instancia de Axios
  return response.data;
};

// Crear un producto
export const createProduct = async (productData: Product): Promise<Product> => {
  const response = await api.post<Product>("/products", productData); // Usa la instancia de Axios
  return response.data;
};

// Actualizar un producto
export const updateProduct = async (id: string, productData: Product): Promise<Product> => {
  const response = await api.put<Product>(`/products/${id}`, productData); // Usa la instancia de Axios
  return response.data;
};

// Eliminar un producto
export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/products/${id}`); // Usa la instancia de Axios
};