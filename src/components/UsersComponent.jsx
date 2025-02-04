// components/UsersComponent.tsx
import React, { useEffect, useState } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../services/userService';

const UsersComponent = () => {
  const [users, setUsers] = useState<any[]>([]); // Estado para almacenar los usuarios
  const [loading, setLoading] = useState<boolean>(true); // Estado para cargar los usuarios
  const [error, setError] = useState<string | null>(null); // Estado para mostrar errores

  // Cargar los usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  // Función para obtener los usuarios
  const fetchUsers = async () => {
    try {
      const usersData = await getUsers(); // Llamada a la API
      setUsers(usersData); // Actualiza el estado con los usuarios obtenidos
      setLoading(false); // Finaliza el estado de carga
    } catch (error) {
      setError('Error al obtener usuarios'); // Manejo de errores
      setLoading(false);
    }
  };

  // Función para agregar un usuario
  const handleAddUser = async () => {
    const newUser = {
      name: 'New User',
      email: 'newuser@example.com',
      password: 'password123',
      isAdmin: false,
    };

    try {
      const createdUser = await createUser(newUser); // Llamada a la API para crear un nuevo usuario
      setUsers((prevUsers) => [...prevUsers, createdUser]); // Actualiza el estado añadiendo el nuevo usuario
    } catch (error) {
      setError('Error al crear usuario'); // Manejo de errores
    }
  };

  // Función para actualizar un usuario
  const handleUpdateUser = async (id: string) => {
    const updatedUserData = {
      name: 'Updated User',
      email: 'updateduser@example.com',
      isAdmin: true,
    };

    try {
      const updatedUser = await updateUser(id, updatedUserData); // Llamada a la API para actualizar el usuario
      setUsers(users.map((user) => (user._id === id ? updatedUser : user))); // Actualiza el usuario en el estado
    } catch (error) {
      setError('Error al actualizar usuario'); // Manejo de errores
    }
  };

  // Función para eliminar un usuario
  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id); // Llamada a la API para eliminar el usuario
      setUsers(users.filter((user) => user._id !== id)); // Actualiza el estado eliminando el usuario
    } catch (error) {
      setError('Error al eliminar usuario'); // Manejo de errores
    }
  };

  // Si está cargando, muestra un mensaje de carga
  if (loading) return <div>Cargando...</div>;

  // Si hubo un error, muestra un mensaje de error
  if (error) return <div>{error}</div>;

  // Renderiza la lista de usuarios
  return (
    <div>
      <h1>Usuarios</h1>
      <button onClick={handleAddUser}>Agregar Usuario</button>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.name} - {user.email}
            <button onClick={() => handleUpdateUser(user._id)}>Actualizar</button>
            <button onClick={() => handleDeleteUser(user._id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersComponent;
