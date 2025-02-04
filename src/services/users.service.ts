// services/users.service.ts
import api from './api'; // Importa la instancia de Axios

// Función para obtener todos los usuarios
export const getUsers = async () => {
  try {
    const response = await api.get('/users'); // Solicita todos los usuarios
    return response.data; // Devuelve los datos de la respuesta
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw new Error('No se pudo obtener la lista de usuarios.');
  }
};

// Función para crear un nuevo usuario
export const createUser = async (userData: any) => {
  try {
    const response = await api.post('/users', userData); // Crea un nuevo usuario
    return response.data; // Devuelve el usuario creado
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw new Error('No se pudo crear el usuario.');
  }
};

// Función para actualizar un usuario
export const updateUser = async (id: string, userData: any) => {
  try {
    const response = await api.put(`/users/${id}`, userData); // Actualiza el usuario con el ID dado
    return response.data; // Devuelve el usuario actualizado
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw new Error('No se pudo actualizar el usuario.');
  }
};

// Función para eliminar un usuario
export const deleteUser = async (id: string) => {
  try {
    const response = await api.delete(`/users/${id}`); // Elimina el usuario con el ID dado
    return response.data; // Devuelve el usuario eliminado
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw new Error('No se pudo eliminar el usuario.');
  }
};
