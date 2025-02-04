
import React, { useState, useEffect } from 'react';
import axiosInstance from '../components/Clients';
import { Search, Plus, Edit, Trash } from 'lucide-react';
const Inventory = () => {
  const [movements, setMovements] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    product: '',
    partNumber: '',
    type: 'entrada',
    quantity: 0,
    amount: 0,
    user: '',
    comments: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [editingMovement, setEditingMovement] = useState(null);

  useEffect(() => {
    fetchMovements();
  }, []);

  const fetchMovements = async () => {
    try {
      const response = await axiosInstance.get('/movements');
      setMovements(response.data);
    } catch (error) {
      console.error('Error al obtener los movimientos:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMovement) {
        await axiosInstance.put(`/movements/${editingMovement._id}`, formData);
      } else {
        await axiosInstance.post('/movements', formData);
      }
      fetchMovements();
      setFormData({
        date: '',
        product: '',
        partNumber: '',
        type: 'entrada',
        quantity: 0,
        amount: 0,
        user: '',
        comments: ''
      });
      setEditingMovement(null);
    } catch (error) {
      console.error('Error al guardar el movimiento:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/movements/${id}`);
      fetchMovements();
    } catch (error) {
      console.error('Error al eliminar el movimiento:', error);
    }
  };

  const handleEdit = (movement) => {
    setEditingMovement(movement);
    setFormData({
      date: movement.date,
      product: movement.product,
      partNumber: movement.partNumber,
      type: movement.type,
      quantity: movement.quantity,
      amount: movement.amount,
      user: movement.user,
      comments: movement.comments
    });
  };

  const filteredMovements = movements.filter(
    (movement) =>
      movement.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movement.partNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Gestión de Inventario</h2>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por producto o número de parte"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <form className="bg-white p-6 rounded-lg shadow-md mb-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="date" className="font-medium">Fecha:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              className="p-3 border rounded-lg shadow-sm"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="product" className="font-medium">Producto:</label>
            <input
              type="text"
              id="product"
              name="product"
              value={formData.product}
              onChange={handleInputChange}
              required
              className="p-3 border rounded-lg shadow-sm"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="partNumber" className="font-medium">Número de Parte:</label>
            <input
              type="text"
              id="partNumber"
              name="partNumber"
              value={formData.partNumber}
              onChange={handleInputChange}
              className="p-3 border rounded-lg shadow-sm"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="type" className="font-medium">Tipo:</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="p-3 border rounded-lg shadow-sm"
            >
              <option value="entrada">Entrada</option>
              <option value="salida">Salida</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="quantity" className="font-medium">Cantidad:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              required
              className="p-3 border rounded-lg shadow-sm"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="amount" className="font-medium">Monto:</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              required
              className="p-3 border rounded-lg shadow-sm"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="user" className="font-medium">Usuario:</label>
            <input
              type="text"
              id="user"
              name="user"
              value={formData.user}
              onChange={handleInputChange}
              className="p-3 border rounded-lg shadow-sm"
            />
          </div>
          <div className="flex flex-col md:col-span-2">
            <label htmlFor="comments" className="font-medium">Comentarios:</label>
            <textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleInputChange}
              className="p-3 border rounded-lg shadow-sm"
            ></textarea>
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          {editingMovement ? 'Actualizar Movimiento' : 'Guardar Movimiento'}
        </button>
      </form>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Movimientos</h3>
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border border-gray-200">Fecha</th>
              <th className="p-3 border border-gray-200">Producto</th>
              <th className="p-3 border border-gray-200">Número de Parte</th>
              <th className="p-3 border border-gray-200">Tipo</th>
              <th className="p-3 border border-gray-200">Cantidad</th>
              <th className="p-3 border border-gray-200">Monto</th>
              <th className="p-3 border border-gray-200">Usuario</th>
              <th className="p-3 border border-gray-200">Comentarios</th>
              <th className="p-3 border border-gray-200">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredMovements.map((movement) => (
              <tr key={movement._id} className="hover:bg-gray-50">
                <td className="p-3 border border-gray-200">{movement.date}</td>
                <td className="p-3 border border-gray-200">{movement.product}</td>
                <td className="p-3 border border-gray-200">{movement.partNumber}</td>
                <td className="p-3 border border-gray-200">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      movement.type === 'entrada'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {movement.type}
                  </span>
                </td>
                <td className="p-3 border border-gray-200">{movement.quantity}</td>
                <td className="p-3 border border-gray-200">${movement.amount.toFixed(2)}</td>
                <td className="p-3 border border-gray-200">{movement.user}</td>
                <td className="p-3 border border-gray-200">{movement.comments}</td>
                <td className="p-3 border border-gray-200">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(movement)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Editar"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(movement._id)}
                      className="text-red-600 hover:text-red-900"
                      title="Eliminar"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Inventory;