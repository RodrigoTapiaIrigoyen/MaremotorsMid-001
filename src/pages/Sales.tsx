import { useState, useEffect } from "react";
import axios from "axios";
import { 
  ShoppingCart, 
  Package, 
  Search, 
  Calendar, 
  DollarSign, 
  Tag,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
  Plus,
  Clock
} from "lucide-react";

interface Product {
  _id: string;
  name: string;
  quantity: number;
  price: number;
}

interface SaleProduct {
  product: Product | null;
  quantity: number;
}

interface Sale {
  _id: string;
  date: string;
  total: number;
  products: SaleProduct[];
  status: string;
}

const Sales: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [productSearch, setProductSearch] = useState<string>("");
  const [salesSearch, setSalesSearch] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [salesRes, productsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/sales"),
        axios.get("http://localhost:5000/api/products")
      ]);
      setSales(salesRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Error al cargar los datos. Por favor, intente nuevamente.");
    }
  };

  const handleSale = async () => {
    if (!selectedProduct || quantity <= 0) {
      setError("Selecciona un producto y una cantidad válida.");
      return;
    }

    try {
      const product = products.find(p => p._id === selectedProduct);
      if (!product) {
        setError("Producto no encontrado.");
        return;
      }

      const newSale = {
        products: [{ product: selectedProduct, quantity }],
        total: product.price * quantity,
        date: new Date().toISOString(),
        status: "pendiente"
      };

      await axios.post("http://localhost:5000/api/sales", newSale);
      await fetchData();
      
      setSuccess("Venta realizada con éxito.");
      setError("");
      setSelectedProduct("");
      setQuantity(1);
    } catch (err) {
      console.error("Error al realizar la venta:", err);
      setError("No se pudo realizar la venta. Intenta nuevamente más tarde.");
      setSuccess("");
    }
  };

  const handleDeleteSale = async (saleId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/sales/${saleId}`);
      setSales(sales.filter(sale => sale._id !== saleId));
      setSuccess("Venta eliminada correctamente");
    } catch (err) {
      console.error("Error al eliminar la venta:", err);
      setError("No se pudo eliminar la venta. Intenta nuevamente más tarde.");
    }
  };

  const handleApproveSale = async (saleId: string) => {
    try {
      const sale = sales.find(s => s._id === saleId);
      if (!sale) {
        setError("Venta no encontrada.");
        return;
      }

      for (const saleProduct of sale.products) {
        const product = products.find(p => p._id === saleProduct.product?._id);
        if (product) {
          product.quantity -= saleProduct.quantity;
          await axios.put(`http://localhost:5000/api/products/${product._id}`, product);
        }
      }

      await axios.put(`http://localhost:5000/api/sales/${saleId}`, { status: "aprobada" });
      await fetchData();
      setSuccess("Venta aprobada correctamente");
    } catch (err) {
      console.error("Error al aprobar la venta:", err);
      setError("No se pudo aprobar la venta. Intenta nuevamente más tarde.");
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredSales = sales.filter(sale =>
    sale._id.toLowerCase().includes(salesSearch.toLowerCase())
  );

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'aprobada':
        return 'bg-emerald-100 text-emerald-800';
      case 'pendiente':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingCart className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Ventas</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario de Nueva Venta */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Plus className="w-6 h-6 text-blue-600" />
            Nueva Venta
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-emerald-600">
              <CheckCircle className="w-5 h-5" />
              {success}
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-500" />
                Buscar Producto
              </label>
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                placeholder="Buscar producto..."
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-500" />
                Producto
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              >
                <option value="">Selecciona un producto</option>
                {filteredProducts.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name} - Stock: {product.quantity}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-500" />
                Cantidad
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
            </div>

            <button
              onClick={handleSale}
              className="w-full px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Crear Venta
            </button>
          </div>
        </div>

        {/* Lista de Ventas */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-600" />
            Historial de Ventas
          </h2>

          <div className="space-y-2 mb-6">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-500" />
              Buscar Venta
            </label>
            <input
              type="text"
              value={salesSearch}
              onChange={(e) => setSalesSearch(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              placeholder="Buscar por ID de venta..."
            />
          </div>

          <div className="space-y-4">
            {filteredSales.map((sale) => (
              <div key={sale._id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {new Date(sale.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold text-gray-900">${sale.total ? sale.total.toFixed(2) : '0.00'}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(sale.status)}`}>
                      {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {sale.products.map((product, index) => (
                      <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        {product.product ? (
                          <span>{product.product.name} - Cantidad: {product.quantity}</span>
                        ) : (
                          <span className="italic">Producto no disponible</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end gap-2">
                    {sale.status === "pendiente" && (
                      <button
                        onClick={() => handleApproveSale(sale._id)}
                        className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500/20 transition-colors flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Aprobar
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteSale(sale._id)}
                      className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-500/20 transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredSales.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No se encontraron ventas
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;