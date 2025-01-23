import React, { useState } from 'react';
import { Search, Plus, Edit, Trash, AlertTriangle } from 'lucide-react';

interface ProductMovement {
  id: string;
  date: string;
  product: string;
  partNumber: string;
  type: 'entrada' | 'salida';
  quantity: number;
  amount: number;
  user: string;
  comments: string;
}

export default function Inventory() {
  const [movements, setMovements] = useState<ProductMovement[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentMovement, setCurrentMovement] = useState<ProductMovement>({
    id: '',
    date: new Date().toISOString().split('T')[0],
    product: '',
    partNumber: '',
    type: 'salida',
    quantity: 0,
    amount: 0,
    user: '',
    comments: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentMovement((prev) => ({
      ...prev,
      [name]: name === 'quantity' || name === 'amount' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentMovement.id) {
      setMovements((prev) =>
        prev.map((m) => (m.id === currentMovement.id ? currentMovement : m))
      );
    } else {
      setMovements((prev) => [
        ...prev,
        { ...currentMovement, id: Date.now().toString() },
      ]);
    }
    closeModal();
  };

  const handleEdit = (movement: ProductMovement) => {
    setCurrentMovement(movement);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setMovements((prev) => prev.filter((m) => m.id !== id));
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentMovement({
      id: '',
      date: new Date().toISOString().split('T')[0],
      product: '',
      partNumber: '',
      type: 'salida',
      quantity: 0,
      amount: 0,
      user: '',
      comments: '',
    });
  };

  const filteredMovements = movements.filter(
    (movement) =>
      movement.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.partNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Movimientos de Productos
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de entradas y salidas de productos del inventario
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Movimiento
        </button>
      </div>

      {/* Search */}
      <div className="flex justify-between items-center">
        <div className="max-w-lg w-full lg:max-w-xs">
          <div className="relative">
            <Search className="absolute inset-y-0 left-0 h-5 w-5 text-gray-400 pl-3" />
            <input
              type="search"
              placeholder="Buscar por artículo o No. de parte..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-1.5 rounded-md border ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Fecha</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Artículo</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">No. Parte</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Tipo</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Cantidad</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Monto</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Usuario</th>
              <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredMovements.map((movement) => (
              <tr key={movement.id}>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{movement.date}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{movement.product}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{movement.partNumber}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
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
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{movement.quantity}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${movement.amount.toFixed(2)}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{movement.user}</td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(movement)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(movement.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Eliminar"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              {currentMovement.id ? 'Editar Movimiento' : 'Nuevo Movimiento'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fecha
                </label>
                <input
                  type="date"
                  name="date"
                  value={currentMovement.date}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Producto
                </label>
                <input
                  type="text"
                  name="product"
                  value={currentMovement.product}
                  onChange={handleInputChange}
                  placeholder="Nombre del producto"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  No. de Parte
                </label>
                <input
                  type="text"
                  name="partNumber"
                  value={currentMovement.partNumber}
                  onChange={handleInputChange}
                  placeholder="Número de parte"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tipo de Movimiento
                </label>
                <select
                  name="type"
                  value={currentMovement.type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                >
                  <option value="entrada">Entrada</option>
                  <option value="salida">Salida</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cantidad
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={currentMovement.quantity}
                  onChange={handleInputChange}
                  placeholder="Cantidad"
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Monto
                </label>
                <input
                  type="number"
                  name="amount"
                  value={currentMovement.amount}
                  onChange={handleInputChange}
                  placeholder="Monto"
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Usuario
                </label>
                <select
                  name="user"
                  value={currentMovement.user}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                >
                  <option value="">Seleccionar Usuario</option>
                  <option value="admin">Administrador</option>
                  <option value="almacen">Almacén</option>
                  <option value="ventas">Ventas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Comentarios
                </label>
                <textarea
                  name="comments"
                  value={currentMovement.comments}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Comentarios adicionales"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md border px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  {currentMovement.id ? 'Actualizar' : 'Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}