import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InventorySettings: React.FC = () => {
  const [newCategory, setNewCategory] = useState('');
  const [newType, setNewType] = useState('');
  const [newSection, setNewSection] = useState('');
  const [categories, setCategories] = useState([]); // Estado para las categorías
  const [types, setTypes] = useState([]); // Estado para los tipos
  const [sections, setSections] = useState([]); // Estado para las secciones

  // Cargar categorías, tipos y secciones al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, typesResponse, sectionsResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/catalog/categories'),
          axios.get('http://localhost:5000/api/catalog/types'),
          axios.get('http://localhost:5000/api/catalog/sections'),
        ]);

        setCategories(categoriesResponse.data);
        setTypes(typesResponse.data);
        setSections(sectionsResponse.data);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchData();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      alert('El nombre de la categoría no puede estar vacío');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/catalog/categories', { name: newCategory });
      setCategories([...categories, response.data]); // Agregar la nueva categoría a la lista
      setNewCategory('');
      alert('Categoría creada con éxito');
    } catch (error) {
      console.error('Error al agregar la categoría:', error);
      alert('Error al agregar la categoría');
    }
  };

  const handleAddType = async () => {
    if (!newType.trim()) {
      alert('El nombre del tipo no puede estar vacío');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/catalog/types', { name: newType });
      setTypes([...types, response.data]); // Agregar el nuevo tipo a la lista
      setNewType('');
      alert('Tipo creado con éxito');
    } catch (error) {
      console.error('Error al agregar el tipo:', error);
      alert('Error al agregar el tipo');
    }
  };

  const handleAddSection = async () => {
    if (!newSection.trim()) {
      alert('El nombre de la sección no puede estar vacío');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/catalog/sections', { name: newSection });
      setSections([...sections, response.data]); // Agregar la nueva sección a la lista
      setNewSection('');
      alert('Sección creada con éxito');
    } catch (error) {
      console.error('Error al agregar la sección:', error);
      alert('Error al agregar la sección');
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/catalog/categories/${id}`);
      setCategories(categories.filter((category) => category._id !== id)); // Eliminar la categoría de la lista
      alert('Categoría eliminada con éxito');
    } catch (error) {
      console.error('Error al eliminar la categoría:', error);
      alert('Error al eliminar la categoría');
    }
  };

  const handleDeleteType = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/catalog/types/${id}`);
      setTypes(types.filter((type) => type._id !== id)); // Eliminar el tipo de la lista
      alert('Tipo eliminado con éxito');
    } catch (error) {
      console.error('Error al eliminar el tipo:', error);
      alert('Error al eliminar el tipo');
    }
  };

  const handleDeleteSection = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/catalog/sections/${id}`);
      setSections(sections.filter((section) => section._id !== id)); // Eliminar la sección de la lista
      alert('Sección eliminada con éxito');
    } catch (error) {
      console.error('Error al eliminar la sección:', error);
      alert('Error al eliminar la sección');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Creacion de Categorias</h1>

      {/* Categorías */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Categorías</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Nueva categoría"
            className="border p-3 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={handleAddCategory} className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600">
            Agregar
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category._id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
              <span className="text-gray-700">{category.name}</span>
              <button
                onClick={() => handleDeleteCategory(category._id)}
                className="text-red-500 hover:underline"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tipos */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Tipos</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            placeholder="Nuevo tipo"
            className="border p-3 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={handleAddType} className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600">
            Agregar
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {types.map((type) => (
            <div key={type._id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
              <span className="text-gray-700">{type.name}</span>
              <button
                onClick={() => handleDeleteType(type._id)}
                className="text-red-500 hover:underline"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Secciones */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Secciones</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={newSection}
            onChange={(e) => setNewSection(e.target.value)}
            placeholder="Nueva sección"
            className="border p-3 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={handleAddSection} className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600">
            Agregar
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((section) => (
            <div key={section._id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
              <span className="text-gray-700">{section.name}</span>
              <button
                onClick={() => handleDeleteSection(section._id)}
                className="text-red-500 hover:underline"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InventorySettings;