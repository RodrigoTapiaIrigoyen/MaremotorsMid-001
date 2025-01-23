import React, { useState } from "react";

export default function Reception() {
  const [receptions, setReceptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newReception, setNewReception] = useState({
    fecha: "",
    cliente: "",
    tel: "",
    modelo: "",
    tipo: "",
    marca: "",
    cotizacion: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReception((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddReception = () => {
    setReceptions([...receptions, newReception]);
    setNewReception({
      fecha: "",
      cliente: "",
      tel: "",
      modelo: "",
      tipo: "",
      marca: "",
      cotizacion: "",
    });
    setShowModal(false);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        Recepción
      </h2>

      {/* Botón para agregar nueva recepción */}
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        Agregar Nuevo
      </button>

      {/* Tabla para mostrar recepciones */}
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Recepción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tel
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Modelo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Marca
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Cotización
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {receptions.map((reception, index) => (
              <tr key={index}>
                <td className="px-6 py-4 text-sm text-gray-900"># {index + 1}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{reception.fecha}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{reception.cliente}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{reception.tel}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{reception.modelo}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{reception.tipo}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{reception.marca}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{reception.cotizacion}</td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() =>
                      setReceptions((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                    className="text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para agregar nueva recepción */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-medium text-gray-900">Nueva Recepción</h3>
            <div className="space-y-4 mt-4">
              {["fecha", "cliente", "tel", "modelo", "tipo", "marca", "cotizacion"].map(
                (field) => (
                  <div key={field}>
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor={field}
                    >
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      type="text"
                      id={field}
                      name={field}
                      value={newReception[field]}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                )
              )}
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddReception}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
