const ProductList = ({ products, onEditProduct }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Lista de Productos</h2>
      <ul>
        {products.map((product) => (
          <li key={product._id} className="border p-2 mb-2 flex justify-between items-center">
            <span>{product.name} - ${product.price} - Stock: {product.stock} - Stock Mínimo: {product.minStock}</span>
            <button
              onClick={() => onEditProduct(product)}
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

export default ProductList;