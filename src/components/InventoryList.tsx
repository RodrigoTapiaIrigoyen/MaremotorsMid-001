const sectionMap = {
  A: "Motores",
  B: "Eléctrico",
  C: "Componentes de Escape",
};

const InventoryList = ({ inventory, onEditInventoryItem }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Lista de Inventario</h2>
      <ul>
        {inventory.map((item) => (
          <li key={item._id} className="border p-2 mb-2 flex justify-between items-center">
            <span>
              {item.product.name} - Sección: {sectionMap[item.section] || item.section} - Subsección: {item.subsection}
            </span>
            <button
              onClick={() => onEditInventoryItem(item)}
              className="bg-yellow-500 text-white px-2 py-1"
            >
              Editar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InventoryList;