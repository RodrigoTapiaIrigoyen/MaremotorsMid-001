import React, { useState } from 'react';

interface Service {
  id: number;
  name: string;
  description: string;
}

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [newService, setNewService] = useState({ name: '', description: '' });

  const handleAddService = () => {
    const newId = services.length + 1;
    setServices([...services, { id: newId, ...newService }]);
    setNewService({ name: '', description: '' });
  };

  const handleDeleteService = (id: number) => {
    setServices(services.filter((service) => service.id !== id));
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Gestión de Servicios</h1>
      <p className="text-gray-600">Administra servicios de mantenimiento y reparación aquí.</p>
      <div>
        <input
          type="text"
          placeholder="Nombre del servicio"
          value={newService.name}
          onChange={(e) => setNewService({ ...newService, name: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Descripción"
          value={newService.description}
          onChange={(e) => setNewService({ ...newService, description: e.target.value })}
          className="border p-2 mr-2"
        />
        <button onClick={handleAddService} className="bg-green-500 text-white px-4 py-2">Añadir Servicio</button>
      </div>
      <ul className="mt-4">
        {services.map((service) => (
          <li key={service.id} className="flex justify-between items-center">
            <span>{service.name} - {service.description}</span>
            <button onClick={() => handleDeleteService(service.id)} className="text-red-500">Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Services;