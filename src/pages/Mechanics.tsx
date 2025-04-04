import { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaPhone, FaEdit, FaTrash, FaUserCog, FaPlus } from 'react-icons/fa';
import api from '../utils/api';

const Mechanics = () => {
  const [mechanics, setMechanics] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMechanics();
  }, []);

  const fetchMechanics = async () => {
    try {
      const response = await api.get('/mechanics');
      setMechanics(response.data);
      setError("");
    } catch (err) {
      setError("Error al cargar los mecánicos");
      console.error("Error fetching mechanics:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, { name, phone });
        setEditingId(null);
      } else {
        await axios.post(API_URL, { name, phone });
      }
      setName("");
      setPhone("");
      fetchMechanics();
      setError("");
    } catch (err) {
      setError("Error al guardar los datos");
      console.error("Error saving mechanic:", err);
    }
  };

  const handleEdit = (mechanic) => {
    setEditingId(mechanic._id);
    setName(mechanic.name);
    setPhone(mechanic.phone);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchMechanics();
      setError("");
    } catch (err) {
      setError("Error al eliminar el mecánico");
      console.error("Error deleting mechanic:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <FaUserCog className="text-blue-600" />
          {editingId ? 'Editar Mecánico' : 'Nuevo Mecánico'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <FaUser className="w-4 h-4 text-gray-500" />
                Nombre
              </label>
              <input
                type="text"
                placeholder="Ingrese nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <FaPhone className="w-4 h-4 text-gray-500" />
                Teléfono
              </label>
              <input
                type="text"
                placeholder="Ingrese teléfono"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className={`w-full px-6 py-2.5 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  editingId 
                    ? "bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-4 focus:ring-yellow-500/20" 
                    : "bg-blue-600 hover:bg-blue-700 text-white focus:ring-4 focus:ring-blue-500/20"
                }`}
              >
                {editingId ? <FaEdit className="w-4 h-4" /> : <FaPlus className="w-4 h-4" />}
                {editingId ? "Actualizar Mecánico" : "Agregar Mecánico"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Mecánicos Registrados</h3>
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mechanics.length > 0 ? (
                mechanics.map((mechanic) => (
                  <tr key={mechanic._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FaUser className="w-4 h-4 text-gray-400 mr-3" />
                        <div className="text-sm font-medium text-gray-900">{mechanic.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FaPhone className="w-4 h-4 text-gray-400 mr-3" />
                        <div className="text-sm text-gray-900">{mechanic.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(mechanic)}
                          className="text-yellow-600 hover:text-yellow-900 transition-colors"
                        >
                          <FaEdit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(mechanic._id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          <FaTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-500">
                    No hay mecánicos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Mechanics;