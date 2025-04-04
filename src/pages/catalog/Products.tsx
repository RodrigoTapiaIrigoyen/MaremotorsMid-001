import { useState, useEffect } from "react";
import ProductList from "../../components/ProductList";
import ProductForm from "../../components/ProductForm";
import api from '../../utils/api';

const Products: React.FC = () => {
  const [refresh, setRefresh] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [currencies, setCurrencies] = useState([]);

  const refreshProducts = () => setRefresh(!refresh);

  const handleEditProduct = (product: any) => {
    setProductToEdit(product);
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await api.delete(`/products/${productId}`);
      refreshProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  useEffect(() => {
    // Obtener productos
    api.get('/products')
      .then((response) => {
        setProducts(response.data);
        checkLowStock(response.data);
      })
      .catch((err) => console.error(err));
  }, [refresh]);

  useEffect(() => {
    // Obtener monedas
    api.get('/currencies')
      .then((response) => {
        setCurrencies(response.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // Filtrar productos en función del texto de búsqueda
  const filteredProducts = products.filter((product: any) =>
    product.name && product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Verificar productos con bajo stock
  const checkLowStock = (products: any[]) => {
    const lowStock = products.filter(product => product.stock < product.minStock); // Umbral de stock bajo
    setLowStockProducts(lowStock);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Gestión de Productos</h1>
      <input
        type="text"
        placeholder="Buscar productos..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      {lowStockProducts.length > 0 && (
        <div className="mb-4 p-4 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Productos con bajo stock:</h2>
          <ul className="list-disc pl-5">
            {lowStockProducts.map(product => (
              <li key={product._id}>{product.name} - Stock: {product.stock}</li>
            ))}
          </ul>
        </div>
      )}
      <ProductForm onProductCreated={refreshProducts} productToEdit={productToEdit} currencies={currencies} />
      <ProductList products={filteredProducts} onEditProduct={handleEditProduct} onDeleteProduct={handleDeleteProduct} />
    </div>
  );
};

export default Products;