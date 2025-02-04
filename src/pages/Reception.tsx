import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaCalendarAlt, FaUser, FaPhone, FaCar, FaTools, FaTags, FaMoneyBillWave } from 'react-icons/fa';

const Reception = () => {
  const [newReception, setNewReception] = useState({
    date: "",
    client: "",
    phone: "",
    model: "",
    type: "",
    brand: "",
    quotation: "",
  });

  const [receptions, setReceptions] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [editingReceptionId, setEditingReceptionId] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewReception({
      ...newReception,
      [name]: value,
    });
  };

  const fetchReceptions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/receptions");
      setReceptions(response.data);
    } catch (error) {
      console.error("Error fetching receptions:", error);
      setError("Error al obtener las recepciones.");
    }
  };

  const handleAddReception = async () => {
    try {
      if (
        !newReception.date ||
        !newReception.client ||
        !newReception.phone ||
        !newReception.model ||
        !newReception.type ||
        !newReception.brand ||
        !newReception.quotation
      ) {
        alert("Por favor, complete todos los campos.");
        return;
      }

      const receptionData = {
        ...newReception,
        quotation: parseFloat(newReception.quotation),
      };

      if (editingReceptionId) {
        const response = await axios.put(`http://localhost:5000/api/receptions/${editingReceptionId}`, receptionData);
        setReceptions(receptions.map((reception) => (reception._id === editingReceptionId ? response.data : reception)));
        setEditingReceptionId(null);
      } else {
        const response = await axios.post("http://localhost:5000/api/receptions", receptionData);
        setReceptions([...receptions, response.data]);
      }

      setNewReception({
        date: "",
        client: "",
        phone: "",
        model: "",
        type: "",
        brand: "",
        quotation: "",
      });
    } catch (error: any) {
      console.error("Error adding/updating reception:", error);
      if (error.response) {
        alert(`Error: ${error.response.data.message || "Error desconocido"}`);
      } else {
        alert("Error de conexión con el servidor.");
      }
    }
  };

  const handleDeleteReception = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/receptions/${id}`);
      setReceptions(receptions.filter((reception) => reception._id !== id));
    } catch (error) {
      console.error("Error deleting reception:", error);
      setError("Error al eliminar la recepción.");
    }
  };

  const handleEditReception = (reception: any) => {
    setNewReception({
      date: reception.date,
      client: reception.client,
      phone: reception.phone,
      model: reception.model,
      type: reception.type,
      brand: reception.brand,
      quotation: reception.quotation.toString(),
    });
    setEditingReceptionId(reception._id);
  };

  useEffect(() => {
    fetchReceptions();
  }, []);

  const inputFields = [
    { name: 'date', label: 'Fecha', type: 'date', icon: FaCalendarAlt },
    { name: 'client', label: 'Cliente', type: 'text', icon: FaUser },
    { name: 'phone', label: 'Teléfono', type: 'text', icon: FaPhone },
    { name: 'model', label: 'Modelo', type: 'text', icon: FaCar },
    { name: 'type', label: 'Tipo', type: 'text', icon: FaTools },
    { name: 'brand', label: 'Marca', type: 'text', icon: FaTags },
    { name: 'quotation', label: 'Cotización', type: 'number', icon: FaMoneyBillWave },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          {editingReceptionId ? 'Editar Recepción' : 'Nueva Recepción'}
        </h2>
        
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inputFields.map(({ name, label, type, icon: Icon }) => (
              <div key={name} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Icon className="w-4 h-4 text-gray-500" />
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={newReception[name as keyof typeof newReception]}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  placeholder={`Ingrese ${label.toLowerCase()}`}
                />
              </div>
            ))}
          </div>

          <div className="pt-4">
            <button
              onClick={handleAddReception}
              className="w-full md:w-auto px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 transition-colors"
            >
              {editingReceptionId ? 'Guardar Cambios' : 'Crear Recepción'}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Recepciones Registradas</h3>
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehículo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cotización</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {receptions.map((reception) => (
                <tr key={reception._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{reception.client}</div>
                    <div className="text-sm text-gray-500">{new Date(reception.date).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{reception.brand} {reception.model}</div>
                    <div className="text-sm text-gray-500">{reception.type}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{reception.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      ${reception.quotation.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEditReception(reception)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        <FaEdit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteReception(reception._id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        <FaTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reception;