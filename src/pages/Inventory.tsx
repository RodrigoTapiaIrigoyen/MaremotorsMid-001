import { useState, useEffect } from "react";
import InventoryForm from "../components/InventoryForm";
import axios from "axios";

const Inventory: React.FC = () => {
  const [inventory, setInventory] = useState({});
  const [filteredInventory, setFilteredInventory] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [inventoryItemToEdit, setInventoryItemToEdit] = useState(null);

  const refreshInventory = () => {
    axios.get("http://localhost:5000/api/inventory")
      .then((response) => {
        setInventory(response.data);
        setFilteredInventory(response.data);
      })
      .catch((err) => console.error("Error al obtener el inventario:", err));
  };

  useEffect(() => {
    refreshInventory();
  }, []);

  const handleEditInventoryItem = (item) => {
    setInventoryItemToEdit(item);
  };

  const handleDeleteInventoryItem = (id) => {
    axios.delete(`http://localhost:5000/api/inventory/${id}`)
      .then(() => {
        refreshInventory();
      })
      .catch((err) => console.error("Error al eliminar el inventario:", err));
  };

  // Filtrar productos por nombre
  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());

    if (!query) {
      setFilteredInventory(inventory);
      return;
    }

    const newFilteredInventory = {};

    Object.keys(inventory).forEach((section) => {
      Object.keys(inventory[section]).forEach((subsection) => {
        const filteredProducts = inventory[section][subsection].filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        );

        if (filteredProducts.length > 0) {
          if (!newFilteredInventory[section]) {
            newFilteredInventory[section] = {};
          }
          newFilteredInventory[section][subsection] = filteredProducts;
        }
      });
    });

    setFilteredInventory(newFilteredInventory);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">📦 Gestión de Inventario</h1>

      {/* Buscador */}
      <div className="max-w-lg mx-auto mb-6">
        <input
          type="text"
          placeholder="🔍 Buscar producto..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Formulario de Inventario */}
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow">
        <InventoryForm onInventoryUpdated={refreshInventory} inventoryItemToEdit={inventoryItemToEdit} />
      </div>

      {/* Secciones del Inventario */}
      {Object.keys(filteredInventory).map((section) => (
        <div key={section} className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b border-gray-300 pb-2">
            📂 Sección: {section}
          </h2>

          {Object.keys(filteredInventory[section]).map((subsection) => (
            <div key={subsection} className="mb-6">
              <h3 className="text-lg font-medium text-gray-600 mb-3">🔹 Subsección: {subsection}</h3>

              {/* Grid para el diseño responsivo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredInventory[section][subsection].map((product) => (
                  <div
                    key={product._id}
                    className="bg-white shadow-md rounded-lg p-5 flex flex-col justify-between border border-gray-200 hover:shadow-lg transition"
                  >
                    <h3 className="text-lg font-semibold text-gray-700">{product.name}</h3>
                    <p className="text-gray-500 text-sm">💲 Precio: ${product.price}</p>
                    <p className="text-gray-500 text-sm">📦 Stock: {product.stock}</p>
                    <p className="text-gray-500 text-sm">⚠️ Stock Mínimo: {product.minStock}</p>

                    {/* Botones de acción */}
                    <div className="mt-4 flex justify-between">
                      <button
                        onClick={() => handleEditInventoryItem(product)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDeleteInventoryItem(product._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                      >
                        🗑 Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Inventory;
