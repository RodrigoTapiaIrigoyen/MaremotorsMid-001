import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import 'jspdf-autotable';
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

interface Client {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
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
  client: Client | null;
}

const Sales: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [selectedClient, setSelectedClient] = useState<string>("");
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
      const [salesRes, productsRes, clientsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/sales"),
        axios.get("http://localhost:5000/api/products"),
        axios.get("http://localhost:5000/api/clients")
      ]);
      setSales(salesRes.data);
      setProducts(productsRes.data);
      setClients(clientsRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Error al cargar los datos. Por favor, intente nuevamente.");
    }
  };

  const handleSale = async () => {
    if (!selectedProduct || quantity <= 0 || !selectedClient) {
      setError("Selecciona un producto, un cliente y una cantidad válida.");
      return;
    }

    try {
      const product = products.find(p => p._id === selectedProduct);
      if (!product) {
        setError("Producto no encontrado.");
        return;
      }

      const client = clients.find(c => c._id === selectedClient);
      if (!client) {
        setError("Cliente no encontrado.");
        return;
      }

      const newSale = {
        products: [{ product: selectedProduct, quantity }],
        total: product.price * quantity,
        date: new Date().toISOString(),
        status: "pendiente",
        client: selectedClient
      };

      await axios.post("http://localhost:5000/api/sales", newSale);
      await fetchData();
      
      setSuccess("Venta realizada con éxito.");
      setError("");
      setSelectedProduct("");
      setSelectedClient("");
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

 
  const handlePrintPDF = (sale: Sale) => {
    if (!sale.client) {
      setError("Cliente no encontrado para esta venta.");
      return;
    }
  
    const applyIVA = window.confirm("¿Quieres aplicar IVA (16%)?");
    const discount = window.prompt("Ingrese el porcentaje de descuento (0-100):", "0");
    const discountValue = parseFloat(discount || "0");
  
    // Cargar el logo
    const logo = new Image();
    logo.src = 'src/logo/Maremotors.png'; // Asegúrate de que la ruta sea correcta
  
    const doc = new jsPDF();
    doc.addImage(logo, 'PNG', 10, 10, 50, 20);
  
    doc.setFontSize(12);
    doc.text("Maremotors YAMAHA", 105, 10, { align: "center" });
    doc.setFontSize(10);
    doc.text("Carretera Merida Progreso Kilómetro Merida 24", 105, 16, { align: "center" });
    doc.text("San Ignacio, Yucatan", 105, 20, { align: "center" });
    doc.text("Tel: 9992383587 / 9997389040", 105, 24, { align: "center" });
    doc.text("Horario: Lunes a Viernes de 9AM - 5PM, Sábado de 9AM - 1:30PM", 120, 28, { align: "center" });
    doc.text("EXISTEN ACCESORIOS Y PARTES DE LOS VEHICULOS QUE PUEDEN TENER VICIOS OCULTOS,", 105, 32, { align: "center" });
    doc.text("NO NOS HACEMOS REPONSABLES QUE ESTANDO EN RESGUARDO O EN EL TRANSCURSO", 105, 36, { align: "center" });
    doc.text("QUE SE RECOJAN SE DAÑEN.", 105, 40, { align: "center" });
  
    const saleData = [
      ["Fecha:", new Date(sale.date).toLocaleDateString()],
      ["Cliente:", sale.client.name],
      ["Teléfono:", sale.client.phone],
      ["Email:", sale.client.email],
      ["Dirección:", sale.client.address],
      ["Estado:", sale.status.charAt(0).toUpperCase() + sale.status.slice(1)]
    ];
  
    const productData = sale.products.map((p, idx) => {
      const price = p.product?.price || 0;
      const subtotal = price * p.quantity;
      const discountAmount = subtotal * (discountValue / 100);
      const totalWithDiscount = subtotal - discountAmount;
      const totalWithIVA = applyIVA ? totalWithDiscount * 1.16 : totalWithDiscount;
  
      return [
        idx + 1,
        p.product?.name || "Producto no disponible",
        p.quantity,
        `$${price.toFixed(2)}`,
        `${discountValue}%`,
        `$${subtotal.toFixed(2)}`,
        `$${totalWithIVA.toFixed(2)}`
      ];
    });
  
    const totals = [
      ["Subtotal:", `$${sale.products.reduce((sum, p) => sum + (p.product?.price || 0) * p.quantity, 0).toFixed(2)}`],
      ["Descuento:", `${discountValue}%`],
      ["IVA:", applyIVA ? "16%" : "0%"],
      ["Total:", `$${(applyIVA ? sale.total * 1.16 : sale.total).toFixed(2)}`]
    ];
  
    doc.autoTable({
      head: [["Campo", "Valor"]],
      body: saleData,
      startY: 50,
      margin: { left: 10, right: 10 },
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
      styles: { lineColor: [0, 0, 0], lineWidth: 0.5, textColor: [0, 0, 0] }
    });
  
    doc.autoTable({
      head: [["#", "Producto", "Cantidad", "Precio Unitario", "Descuento", "Subtotal", "Importe"]],
      body: productData,
      startY: doc.lastAutoTable.finalY + 10,
      margin: { left: 10, right: 10 },
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
      styles: { lineColor: [0, 0, 0], lineWidth: 0.5, textColor: [0, 0, 0] }
    });
  
    doc.autoTable({
      head: [["Campo", "Valor"]],
      body: totals,
      startY: doc.lastAutoTable.finalY + 10,
      margin: { left: 10, right: 10 },
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
      styles: { lineColor: [0, 0, 0], lineWidth: 0.5, textColor: [0, 0, 0] }
    });
  
    doc.text("", 20, doc.lastAutoTable.finalY + 20);
    doc.text("", 140, doc.lastAutoTable.finalY + 20);
  
    doc.save(`venta_${sale._id}.pdf`);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredSales = sales.filter(sale =>
    sale.products.some(product =>
      product.product?.name.toLowerCase().includes(salesSearch.toLowerCase())
    )
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
        <ShoppingCart className="w-8 h-8 text-black" />
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Ventas</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario de Nueva Venta */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Plus className="w-6 h-6 text-black" />
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
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black/20 focus:border-black transition-colors"
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
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black/20 focus:border-black transition-colors"
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
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black/20 focus:border-black transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-500" />
                Cliente
              </label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black/20 focus:border-black transition-colors"
              >
                <option value="">Selecciona un cliente</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSale}
              className="w-full px-6 py-2.5 bg-black text-white font-medium rounded-lg hover:bg-gray-800 focus:ring-4 focus:ring-black/20 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Crear Venta
            </button>
          </div>
        </div>

        {/* Lista de Ventas */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-black" />
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
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black/20 focus:border-black transition-colors"
              placeholder="Buscar por nombre del producto..."
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
                    <button
                      onClick={() => handlePrintPDF(sale)}
                      className="px-4 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 focus:ring-4 focus:ring-black/20 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Imprimir PDF
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