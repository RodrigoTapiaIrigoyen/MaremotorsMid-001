import React, { useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: 0 });

  const handleAddProduct = () => {
    const newId = products.length + 1;
    setProducts([...products, { id: newId, ...newProduct }]);
    setNewProduct({ name: '', price: 0 });
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Gestión de Productos</h1>
      <p className="text-gray-600">Administra el inventario de productos y repuestos aquí.</p>
      <div>
        <input
          type="text"
          placeholder="Nombre del producto"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Precio"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
          className="border p-2 mr-2"
        />
        <button onClick={handleAddProduct} className="bg-blue-500 text-white px-4 py-2">Añadir Producto</button>
      </div>
      <ul className="mt-4">
        {products.map((product) => (
          <li key={product.id} className="flex justify-between items-center">
            <span>{product.name} - ${product.price}</span>
            <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500">Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Products;
