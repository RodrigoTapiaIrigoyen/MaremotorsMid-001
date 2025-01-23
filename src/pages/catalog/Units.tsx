import React, { useState } from 'react';

interface Unit {
  id: number;
  model: string;
  status: string;
}

const Units: React.FC = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [newUnit, setNewUnit] = useState({ model: '', status: '' });

  const handleAddUnit = () => {
    const newId = units.length + 1;
    setUnits([...units, { id: newId, ...newUnit }]);
    setNewUnit({ model: '', status: '' });
  };

  const handleDeleteUnit = (id: number) => {
    setUnits(units.filter((unit) => unit.id !== id));
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Gestión de Unidades</h1>
      <p className="text-gray-600">Registra y controla las motos acuáticas aquí.</p>
      <div>
        <input
          type="text"
          placeholder="Modelo"
          value={newUnit.model}
          onChange={(e) => setNewUnit({ ...newUnit, model: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Estatus"
          value={newUnit.status}
          onChange={(e) => setNewUnit({ ...newUnit, status: e.target.value })}
          className="border p-2 mr-2"
        />
        <button onClick={handleAddUnit} className="bg-purple-500 text-white px-4 py-2">Añadir Unidad</button>
      </div>
      <ul className="mt-4">
        {units.map((unit) => (
          <li key={unit.id} className="flex justify-between items-center">
            <span>{unit.model} - {unit.status}</span>
            <button onClick={() => handleDeleteUnit(unit.id)} className="text-red-500">Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Units;