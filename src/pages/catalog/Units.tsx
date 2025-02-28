import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Unit {
  _id: string;
  model: string;
  type: string;
  brand: string;
  color: string;
  plates: string;
  client: string;
  status: string;
}

interface Client {
  _id: string;
  name: string;
}

const Units: React.FC = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [newUnit, setNewUnit] = useState({ model: '', type: '', brand: '', color: '', plates: '', client: '', status: '' });
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(''); // Definir searchQuery en el estado

  useEffect(() => {
    const fetchUnitsAndClients = async () => {
      try {
        const unitsResponse = await axios.get('http://localhost:5000/api/units');
        const clientsResponse = await axios.get('http://localhost:5000/api/clients');
        setUnits(unitsResponse.data);
        setClients(clientsResponse.data);
      } catch (error) {
        console.error('Error fetching units or clients:', error);
      }
    };

    fetchUnitsAndClients();
  }, []);

  const handleAddUnit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/units', newUnit);
      setUnits([...units, response.data]);
      setNewUnit({ model: '', type: '', brand: '', color: '', plates: '', client: '', status: '' });
    } catch (error) {
      console.error('Error adding unit:', error);
    }
  };

  const handleDeleteUnit = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/units/${id}`);
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
      client: unit.client,
      status: unit.status,
    });
  };

  const handleUpdateUnit = async () => {
    if (!editingUnit) return;

    try {
      const response = await axios.put(`http://localhost:5000/api/units/${editingUnit._id}`, newUnit);
      setUnits(units.map((unit) => (unit._id === editingUnit._id ? response.data : unit)));
      setEditingUnit(null);
      setNewUnit({ model: '', type: '', brand: '', color: '', plates: '', client: '', status: '' });
    } catch (error) {
      console.error('Error updating unit:', error);
    }
  };

  const filteredUnits = units.filter((unit) =>
    unit.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    unit.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    unit.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    unit.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
    unit.plates.toLowerCase().includes(searchQuery.toLowerCase()) ||
    clients.find(client => client._id === unit.client)?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <input
          type="text"
          placeholder="Tipo"
          value={newUnit.type}
          onChange={(e) => setNewUnit({ ...newUnit, type: e.target.value })}
          className="border p-2 rounded-md"
        />
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
        <input
          type="text"
          placeholder="Estatus"
          value={newUnit.status}
          onChange={(e) => setNewUnit({ ...newUnit, status: e.target.value })}
          className="border p-2 rounded-md"
        />
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
          const clientName = clients.find(client => client._id === unit.client)?.name || unit.client;
          return (
            <li key={unit._id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <span className="block text-lg font-semibold text-gray-800">{unit.model} - {unit.type} - {unit.brand}</span>
                <span className="block text-gray-600">{unit.color} - {unit.plates}</span>
                <span className="block text-gray-600">Cliente: {typeof clientName === 'string' ? clientName : ''}</span>
                <span className="block text-gray-600">Estatus: {unit.status}</span>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => handleEditUnit(unit)} className="bg-yellow-500 text-white px-4 py-2 rounded-md">Editar</button>
                <button onClick={() => handleDeleteUnit(unit._id)} className="bg-red-500 text-white px-4 py-2 rounded-md">Eliminar</button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Units;