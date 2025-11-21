import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

interface Unit {
  _id: string;
  model: string;
  type: string;
  brand: string;
  color: string;
  plates: string;
  // client puede ser un ID (string) o un objeto con información parcial
  client: string | { _id?: string; name?: string } | null;
}

interface Client {
  _id: string;
  name: string;
}

const Units: React.FC = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [newUnit, setNewUnit] = useState({ model: '', type: '', brand: '', color: '', plates: '', client: '' });
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [types, setTypes] = useState<string[]>([]); // Estado para los tipos

  useEffect(() => {
    const fetchUnitsAndClients = async () => {
      try {
        // Usar la instancia `api` que respeta VITE_API_URL
        const unitsResponse = await api.get('/units');
        const clientsResponse = await api.get('/clients');
        setUnits(unitsResponse.data);
        setClients(clientsResponse.data);
      } catch (error) {
        console.error('Error fetching units or clients:', error);
      }
    };

    fetchUnitsAndClients();
  }, []);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await api.get('/catalog/types');
        setTypes(response.data); // Supongamos que la API devuelve un array de objetos con { _id, name }
      } catch (error) {
        console.error('Error al cargar los tipos:', error);
      }
    };

    fetchTypes();
  }, []);

  const handleAddUnit = async () => {
    try {
  const response = await api.post('/units', newUnit);
      setUnits([...units, response.data]);
      setNewUnit({ model: '', type: '', brand: '', color: '', plates: '', client: '' });
    } catch (error) {
      console.error('Error adding unit:', error);
    }
  };

  const handleDeleteUnit = async (id: string) => {
    try {
  await api.delete(`/units/${id}`);
      setUnits(units.filter((unit) => unit._id !== id));
    } catch (error) {
      console.error('Error deleting unit:', error);
    }
  };

  const handleEditUnit = (unit: Unit) => {
    setEditingUnit(unit);
    setNewUnit({
      model: unit.model,
      type: unit.type,
      brand: unit.brand,
      color: unit.color,
      plates: unit.plates,
      // Aseguramos que no accedamos a propiedades de null
      client: unit.client && typeof unit.client === 'object' ? (unit.client._id ?? '') : (unit.client ?? ''), // Asegúrate de que sea un ID
    });
  };

  const handleUpdateUnit = async () => {
    if (!editingUnit) return;

    // Validar que todos los campos requeridos estén presentes
    if (!newUnit.model || !newUnit.type || !newUnit.brand || !newUnit.color || !newUnit.plates || !newUnit.client) {
      alert('Por favor, completa todos los campos requeridos.');
      return;
    }

    try {
  const response = await api.put(`/units/${editingUnit._id}`, newUnit);
      setUnits(units.map((unit) => (unit._id === editingUnit._id ? response.data : unit)));
      setEditingUnit(null);
      setNewUnit({ model: '', type: '', brand: '', color: '', plates: '', client: '' });
    } catch (error) {
      console.error('Error updating unit:', error);
      alert('Error al actualizar la unidad. Por favor, verifica los datos e intenta nuevamente.');
    }
  };

  const filteredUnits = units.filter((unit) => {
    const q = searchQuery.toLowerCase();
    const model = (unit.model || '').toLowerCase();
    const type = (unit.type || '').toLowerCase();
    const brand = (unit.brand || '').toLowerCase();
    const color = (unit.color || '').toLowerCase();
    const plates = (unit.plates || '').toLowerCase();
    // Obtener nombre de cliente para el filtro, protegiendo null y objetos
    const clientNameForFilter = unit.client && typeof unit.client === 'object'
      ? (unit.client?.name || '')
      : (clients.find(client => client._id === unit.client)?.name || '');

    return (
      model.includes(q) ||
      type.includes(q) ||
      brand.includes(q) ||
      color.includes(q) ||
      plates.includes(q) ||
      clientNameForFilter.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Gestión de Unidades</h1>
      <p className="text-gray-600">Registra y controla las motos acuáticas aquí.</p>
      <div className="flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Modelo"
          value={newUnit.model}
          onChange={(e) => setNewUnit({ ...newUnit, model: e.target.value })}
          className="border p-2 rounded-md"
        />
        <select
          value={newUnit.type}
          onChange={(e) => setNewUnit({ ...newUnit, type: e.target.value })}
          className="border p-2 rounded-md"
        >
          <option value="">Seleccionar Tipo</option>
          {types.map((type: any) => (
            <option key={type?._id ?? type} value={type?.name ?? type}>
              {type?.name ?? type}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Marca"
          value={newUnit.brand}
          onChange={(e) => setNewUnit({ ...newUnit, brand: e.target.value })}
          className="border p-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Color"
          value={newUnit.color}
          onChange={(e) => setNewUnit({ ...newUnit, color: e.target.value })}
          className="border p-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Placas"
          value={newUnit.plates}
          onChange={(e) => setNewUnit({ ...newUnit, plates: e.target.value })}
          className="border p-2 rounded-md"
        />
        <select
          value={newUnit.client}
          onChange={(e) => setNewUnit({ ...newUnit, client: e.target.value })}
          className="border p-2 rounded-md"
        >
          <option value="">Seleccionar Cliente</option>
          {clients.map((client) => (
            <option key={client._id} value={client._id}>
              {client.name}
            </option>
          ))}
        </select>
        {editingUnit ? (
          <button onClick={handleUpdateUnit} className="bg-blue-500 text-white px-4 py-2 rounded-md">Actualizar Unidad</button>
        ) : (
          <button onClick={handleAddUnit} className="bg-purple-500 text-white px-4 py-2 rounded-md">Añadir Unidad</button>
        )}
      </div>
      <div className="mt-4">
        <input
          type="text"
          placeholder="Buscar unidades..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded-md w-full"
        />
      </div>
      <ul className="mt-4 space-y-4">
        {filteredUnits.map((unit) => {
          const clientName = unit.client && typeof unit.client === 'object' && unit.client !== null
            ? (unit.client.name || 'Cliente no encontrado')
            : (clients.find(client => client._id === unit.client)?.name || 'Cliente no encontrado');
          return (
            <li key={unit._id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <span className="block text-lg font-semibold text-gray-800">
                  {unit.model} - {unit.type} - {unit.brand}
                </span>
                <span className="block text-gray-600">
                  {unit.color} - {unit.plates}
                </span>
                <span className="block text-gray-600">
                  Cliente: {clientName}
                </span>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => handleEditUnit(unit)} className="bg-yellow-500 text-white px-4 py-2 rounded-md">
                  Editar
                </button>
                <button onClick={() => handleDeleteUnit(unit._id)} className="bg-red-500 text-white px-4 py-2 rounded-md">
                  Eliminar
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Units;