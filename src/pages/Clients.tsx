import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [editClient, setEditClient] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/clients')
      .then((response) => {
        setClients(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener los clientes:', error);
      });
  }, []);

  const handleAddClient = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:5000/api/clients', newClient)
      .then((response) => {
        setClients([...clients, response.data]);
        setNewClient({ name: '', phone: '', email: '' });
      })
      .catch((error) => {
        console.error('Error al agregar cliente:', error);
      });
  };

  const handleEditClient = (client) => {
    setEditClient(client);
    setNewClient({
      name: client.name,
      phone: client.phone,
      email: client.email,
    });
  };

  const handleUpdateClient = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/api/clients/${editClient._id}`, newClient)
      .then((response) => {
        const updatedClients = clients.map((client) =>
          client._id === editClient._id ? response.data : client
        );
        setClients(updatedClients);
        setNewClient({ name: '', phone: '', email: '' });
        setEditClient(null);
      })
      .catch((error) => {
        console.error('Error al actualizar cliente:', error);
      });
  };

  const handleDeleteClient = (id) => {
    axios
      .delete(`http://localhost:5000/api/clients/${id}`)
      .then(() => {
        setClients(clients.filter((client) => client._id !== id));
      })
      .catch((error) => {
        console.error('Error al eliminar cliente:', error);
      });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          {editClient ? 'Editar Cliente' : 'Nuevo Cliente'}
        </h2>

        <form onSubmit={editClient ? handleUpdateClient : handleAddClient} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                type="text"
                placeholder="Ingrese nombre"
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Teléfono
              </label>
              <input
                type="text"
                placeholder="Ingrese teléfono"
                value={newClient.phone}
                onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="Ingrese email"
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                required
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 transition-colors"
            >
              {editClient ? 'Actualizar Cliente' : 'Agregar Cliente'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Clientes Registrados</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <div
              key={client._id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">{client.name}</h4>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-600 flex items-center">
                      <span className="w-16 font-medium">Tel:</span>
                      {client.phone}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <span className="w-16 font-medium">Email:</span>
                      {client.email}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleEditClient(client)}
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteClient(client._id)}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Clients;