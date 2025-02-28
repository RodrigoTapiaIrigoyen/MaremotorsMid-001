const ProductList = ({ products, onEditProduct }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 Lista de Productos</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-2 px-4 text-left">Nombre</th>
              <th className="py-2 px-4 text-left">Precio</th>
              <th className="py-2 px-4 text-left">Stock</th>
              <th className="py-2 px-4 text-left">Stock Mínimo</th>
              <th className="py-2 px-4 text-center">Acción</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-t border-gray-200 hover:bg-gray-50 transition">
                <td className="py-2 px-4 text-gray-800">{product.name}</td>
                <td className="py-2 px-4 text-gray-700">${product.price}</td>
                <td className={`py-2 px-4 font-semibold ${product.stock < product.minStock ? "text-red-500" : "text-gray-700"}`}>
                  {product.stock}
                </td>
                <td className="py-2 px-4 text-gray-700">{product.minStock}</td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => onEditProduct(product)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded-md transition"
                  >
                    ✏️ Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
