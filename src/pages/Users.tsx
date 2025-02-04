import React, { useEffect, useState } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../services/users.service';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersData = await getUsers();
      setUsers(usersData);
      setLoading(false);
    } catch (error) {
      setError('Error al obtener usuarios');
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    const newUser = {
      name: 'New User',
      email: 'newuser@example.com',
      password: 'password123',
      isAdmin: false,
    };

    try {
      const createdUser = await createUser(newUser);
      setUsers([...users, createdUser]);
    } catch (error) {
      setError('Error al crear usuario');
    }
  };

  const handleUpdateUser = async (id: string) => {
    const updatedUserData = {
      name: 'Updated User',
      email: 'updateduser@example.com',
      isAdmin: true,
    };

    try {
      const updatedUser = await updateUser(id, updatedUserData);
      setUsers(users.map(user => (user._id === id ? updatedUser : user)));
    } catch (error) {
      setError('Error al actualizar usuario');
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);
      setUsers(users.filter(user => user._id !== id));
    } catch (error) {
      setError('Error al eliminar usuario');
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Usuarios</h1>
      <button onClick={handleAddUser}>Agregar Usuario</button>
      <ul>
        {users.map(user => (
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

export default Users;
