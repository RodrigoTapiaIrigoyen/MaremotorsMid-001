import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, FileText, History } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  history: {
    quotes: number;
    receptions: number;
    purchases: number;
  };
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client>({
    id: '',
    name: '',
    email: '',
    phone: '',
    createdAt: new Date().toISOString(),
    history: {
      quotes: 0,
      receptions: 0,
      purchases: 0,
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setCurrentClient((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentClient.id) {
      setClients((prev) =>
        prev.map((c) => (c.id === currentClient.id ? currentClient : c))
      );
    } else {
      setClients((prev) => [
        ...prev,
        { ...currentClient, id: Date.now().toString() },
      ]);
    }
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentClient({
      id: '',
      name: '',
      email: '',
      phone: '',
      createdAt: new Date().toISOString(),
      history: {
        quotes: 0,
        receptions: 0,
        purchases: 0,
      },
    });
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Clientes
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de clientes y su historial
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Cliente
        </button>
      </div>

      {/* Search */}
      <div className="flex justify-between items-center">
        <div className="max-w-lg w-full lg:max-w-xs">
          <div className="relative">
            <Search className="absolute inset-y-0 left-0 h-5 w-5 text-gray-400 pl-3" />
            <input
              type="search"
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-1.5 rounded-md border ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Nombre
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Email
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Teléfono
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Fecha de Registro
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Historial
              </th>
              <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredClients.map((client) => (
              <tr key={client.id}>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                  {client.name}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {client.email}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {client.phone}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {new Date(client.createdAt).toLocaleDateString()}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <div className="flex gap-2">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      {client.history.quotes} cotizaciones
                    </span>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      {client.history.purchases} compras
                    </span>
                  </div>
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setCurrentClient(client);
                        setShowHistoryModal(true);
                      }}
                      className="text-gray-600 hover:text-gray-900"
                      title="Ver historial"
                    >
                      <History className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setCurrentClient(client);
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        setClients((prev) =>
                          prev.filter((c) => c.id !== client.id)
                        )
                      }
                      className="text-red-600 hover:text-red-900"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Client Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              {currentClient.id ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  name="name"
                  value={currentClient.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={currentClient.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={currentClient.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  {currentClient.id ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Client History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Historial del Cliente
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {currentClient.name}
                </p>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="rounded-md bg-white text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Cerrar</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-6">
              <div className="divide-y divide-gray-200">
                <div className="py-4">
                  <h4 className="text-sm font-medium text-gray-900">
                    Cotizaciones Recientes
                  </h4>
                  {/* Add quotes list here */}
                </div>
                <div className="py-4">
                  <h4 className="text-sm font-medium text-gray-900">
                    Recepciones Recientes
                  </h4>
                  {/* Add receptions list here */}
                </div>
                <div className="py-4">
                  <h4 className="text-sm font-medium text-gray-900">
                    Compras Recientes
                  </h4>
                  {/* Add purchases list here */}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}