import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Specialty {
  id: string;
  name: string;
}

interface Task {
  id: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  deadline: string;
}

interface Mechanic {
  id: string;
  name: string;
  phone: string;
  email: string;
  specialties: string[];
  available: boolean;
  currentTasks: Task[];
}

export default function Mechanics() {
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentMechanic, setCurrentMechanic] = useState<Mechanic>({
    id: '',
    name: '',
    phone: '',
    email: '',
    specialties: [],
    available: true,
    currentTasks: [],
  });

  const specialtiesList: Specialty[] = [
    { id: '1', name: 'Motor' },
    { id: '2', name: 'Eléctrico' },
    { id: '3', name: 'Hidráulico' },
    { id: '4', name: 'Carrocería' },
    { id: '5', name: 'Diagnóstico' },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCurrentMechanic((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpecialtyChange = (specialtyId: string) => {
    setCurrentMechanic((prev) => {
      const specialties = prev.specialties.includes(specialtyId)
        ? prev.specialties.filter((id) => id !== specialtyId)
        : [...prev.specialties, specialtyId];
      return { ...prev, specialties };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentMechanic.id) {
      setMechanics((prev) =>
        prev.map((m) => (m.id === currentMechanic.id ? currentMechanic : m))
      );
    } else {
      setMechanics((prev) => [
        ...prev,
        { ...currentMechanic, id: Date.now().toString() },
      ]);
    }
    closeModal();
  };

  const handleAddTask = (mechanicId: string, task: Task) => {
    setMechanics((prev) =>
      prev.map((m) =>
        m.id === mechanicId
          ? { ...m, currentTasks: [...m.currentTasks, task] }
          : m
      )
    );
  };

  const handleUpdateTaskStatus = (
    mechanicId: string,
    taskId: string,
    status: Task['status']
  ) => {
    setMechanics((prev) =>
      prev.map((m) =>
        m.id === mechanicId
          ? {
              ...m,
              currentTasks: m.currentTasks.map((t) =>
                t.id === taskId ? { ...t, status } : t
              ),
            }
          : m
      )
    );
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentMechanic({
      id: '',
      name: '',
      phone: '',
      email: '',
      specialties: [],
      available: true,
      currentTasks: [],
    });
  };

  const filteredMechanics = mechanics.filter(
    (mechanic) =>
      mechanic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mechanic.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Mecánicos
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de mecánicos y asignación de tareas
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Mecánico
        </button>
      </div>

      {/* Search */}
      <div className="flex justify-between items-center">
        <div className="max-w-lg w-full lg:max-w-xs">
          <div className="relative">
            <Search className="absolute inset-y-0 left-0 h-5 w-5 text-gray-400 pl-3" />
            <input
              type="search"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-1.5 rounded-md border ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Mechanics List */}
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Nombre
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Contacto
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Especialidades
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Estado
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Tareas Actuales
              </th>
              <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredMechanics.map((mechanic) => (
              <tr key={mechanic.id}>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                  {mechanic.name}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <div>
                    <p>{mechanic.email}</p>
                    <p>{mechanic.phone}</p>
                  </div>
                </td>
                <td className="px-3 py-4 text-sm text-gray-500">
                  <div className="flex flex-wrap gap-1">
                    {mechanic.specialties.map((specialtyId) => (
                      <span
                        key={specialtyId}
                        className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800"
                      >
                        {
                          specialtiesList.find((s) => s.id === specialtyId)?.name
                        }
                      </span>
                    ))}
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      mechanic.available
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {mechanic.available ? 'Disponible' : 'Ocupado'}
                  </span>
                </td>
                <td className="px-3 py-4 text-sm text-gray-500">
                  <div className="space-y-1">
                    {mechanic.currentTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between gap-2"
                      >
                        <span className="truncate">{task.description}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              handleUpdateTaskStatus(
                                mechanic.id,
                                task.id,
                                'completed'
                              )
                            }
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateTaskStatus(
                                mechanic.id,
                                task.id,
                                'in-progress'
                              )
                            }
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            <Clock className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setCurrentMechanic(mechanic);
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        setMechanics((prev) =>
                          prev.filter((m) => m.id !== mechanic.id)
                        )
                      }
                      className="text-red-600 hover:text-red-900"
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

      {/* Add/Edit Mechanic Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              {currentMechanic.id ? 'Editar Mecánico' : 'Nuevo Mecánico'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  name="name"
                  value={currentMechanic.name}
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
                  value={currentMechanic.email}
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
                  value={currentMechanic.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Especialidades
                </label>
                <div className="space-y-2">
                  {specialtiesList.map((specialty) => (
                    <label
                      key={specialty.id}
                      className="inline-flex items-center mr-4"
                    >
                      <input
                        type="checkbox"
                        checked={currentMechanic.specialties.includes(
                          specialty.id
                        )}
                        onChange={() => handleSpecialtyChange(specialty.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {specialty.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="available"
                    checked={currentMechanic.available}
                    onChange={(e) =>
                      setCurrentMechanic((prev) => ({
                        ...prev,
                        available: e.target.checked,
                      }))
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Disponible</span>
                </label>
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
                  {currentMechanic.id ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}