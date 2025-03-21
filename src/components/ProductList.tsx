import React from "react";

const ProductList = ({ products, onEditProduct, onDeleteProduct }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Lista de Productos</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Nombre</th>
            <th className="py-2">No. Parte</th>
            <th className="py-2">Precio</th>
            <th className="py-2">Precio de Compra</th>
            <th className="py-2">Condición</th>
            <th className="py-2">Moneda</th>
            <th className="py-2">Stock</th>
            <th className="py-2">Stock Mínimo</th>
            <th className="py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td className="border px-4 py-2">{product.name}</td>
              <td className="border px-4 py-2">{product.partNumber}</td>
              <td className="border px-4 py-2">${product.price}</td>
              <td className="border px-4 py-2">${product.purchasePrice}</td>
              <td className="border px-4 py-2">{product.condition}</td>
              <td className="border px-4 py-2">
                {product.currencyId ? `${product.currencyId.name} (${product.currencyId.symbol})` : "N/A"}
              </td>
              <td className={`border px-4 py-2 ${product.stock <= product.minStock ? 'text-red-500' : ''}`}>
                {product.stock}
              </td>
              <td className="border px-4 py-2">{product.minStock}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => onEditProduct(product)}
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDeleteProduct(product._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;