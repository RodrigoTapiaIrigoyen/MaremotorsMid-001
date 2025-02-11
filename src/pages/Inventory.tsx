import { useState, useEffect } from "react";
import InventoryForm from "../components/InventoryForm";
import axios from "axios";

const Inventory: React.FC = () => {
  const [inventory, setInventory] = useState({});
  const [inventoryItemToEdit, setInventoryItemToEdit] = useState(null);

  const refreshInventory = () => {
    axios.get("http://localhost:5000/api/inventory")
      .then((response) => {
        setInventory(response.data);
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

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Gestión de Inventario</h1>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <InventoryForm onInventoryUpdated={refreshInventory} inventoryItemToEdit={inventoryItemToEdit} />
      </div>
      {Object.keys(inventory).map((section) => (
        <div key={section} className="mt-8">
          <h2 className="text-3xl font-semibold mb-4 text-gray-700">Sección {section}</h2>
          {Object.keys(inventory[section]).map((subsection) => (
            <div key={subsection} className="mb-6">
              <h3 className="text-2xl font-medium mb-3 text-gray-600">Subsección {subsection}</h3>
              <ul className="space-y-4">
                {inventory[section][subsection].map((product) => (
                  <li key={product._id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                    <div>
                      <span className="block text-lg font-semibold text-gray-800">{product.name}</span>
                      <span className="block text-gray-600">Precio: ${product.price}</span>
                      <span className="block text-gray-600">Stock: {product.stock}</span>
                      <span className="block text-gray-600">Stock Mínimo: {product.minStock}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditInventoryItem(product)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteInventoryItem(product._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                      >
                        Eliminar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Inventory;