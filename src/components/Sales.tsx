import { useState, useEffect } from "react";
import api from '../utils/api';

const Sales: React.FC = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    // Obtener ventas
    api.get('/sales')
      .then((response) => {
        console.log(response.data); // Agregar este console.log para inspeccionar los datos
        setSales(response.data);
      })
      .catch((err) => console.error("Error al obtener las ventas:", err));
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Gestión de Ventas</h1>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Ventas</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">Venta ID</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">Fecha</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">Total</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">Productos</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale._id}>
                <td className="px-6 py-4 border-b border-gray-300 text-sm leading-5 text-gray-800">{sale._id}</td>
                <td className="px-6 py-4 border-b border-gray-300 text-sm leading-5 text-gray-800">{new Date(sale.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 border-b border-gray-300 text-sm leading-5 text-gray-800">${sale.totalPrice}</td>
                <td className="px-6 py-4 border-b border-gray-300 text-sm leading-5 text-gray-800">
                  <ul>
                    {Array.isArray(sale.products) && sale.products.length > 0 ? (
                      sale.products.map((product, index) => (
                        <li key={product?.product?._id || index} className="text-gray-600">
                          {product?.product?.name ? `${product.product.name} - Cantidad: ${product.quantity}` : `Producto no disponible - Cantidad: ${product?.quantity || 0}`}
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-600">No hay productos en esta venta.</li>
                    )}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sales;