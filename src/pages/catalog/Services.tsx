import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { getServices, createService, deleteService, Service } from '../../services/services.services';

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<string[]>([]); // Estado para las categorías
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    currency: 'MXN',
  });

  useEffect(() => {
    const fetchServices = async () => {
      const servicesData = await getServices();
      setServices(servicesData);
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/catalog/categories'); // Cargar categorías del backend
        const dynamicCategories = response.data.map((category: any) => category.name); // Extraer nombres de las categorías
        setCategories(dynamicCategories); // Usar solo las categorías dinámicas
      } catch (error) {
        console.error('Error al cargar las categorías:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleAddService = async () => {
    const addedService = await createService(newService);
    setServices([...services, addedService]);
    setNewService({ name: '', description: '', price: 0, category: '', currency: 'MXN' });
  };

  const handleDeleteService = async (id: string) => {
    await deleteService(id);
    setServices(services.filter((service) => service._id !== id));
  };

  return (
    <div className="p-6 space-y-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800">Gestión de Servicios</h1>
      <p className="text-gray-600 text-center mb-6">Administra servicios de mantenimiento y reparación aquí.</p>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Nombre del servicio"
            value={newService.name}
            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
            className="border p-2 mr-2 rounded w-full mb-2"
          />
          <input
            type="text"
            placeholder="Descripción"
            value={newService.description}
            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
            className="border p-2 mr-2 rounded w-full mb-2"
          />
          <input
            type="number"
            placeholder="Precio Venta"
            value={newService.price}
            onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) })}
            className="border p-2 mr-2 rounded w-full mb-2"
          />
          <select
            value={newService.category}
            onChange={(e) => setNewService({ ...newService, category: e.target.value })}
            className="border p-2 mr-2 rounded w-full mb-2"
          >
            <option value="">Selecciona una categoría</option>
            {/* Opciones dinámicas obtenidas desde el backend */}
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={newService.currency}
            onChange={(e) => setNewService({ ...newService, currency: e.target.value })}
            className="border p-2 mr-2 rounded w-full mb-2"
          >
            <option value="MXN">Pesos Mexicanos</option>
           
          </select>
          <button
            onClick={handleAddService}
            className="bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600"
          >
            Añadir Servicio
          </button>
        </div>
        <ul className="mt-4 space-y-4">
          {services.map((service) => (
            <li
              key={service._id}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <span className="block text-lg font-semibold text-gray-800">{service.name}</span>
                <span className="block text-gray-600">{service.description}</span>
                <span className="block text-gray-600">
                  {service.price} {service.currency}
                </span>
                <span className="block text-gray-600">{service.category}</span>
              </div>
              <button
                onClick={() => handleDeleteService(service._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Services;