import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import { Search, Plus, Minus, Trash2, Edit2, Check, Printer, ShoppingCart, Users, Package, DollarSign } from 'lucide-react';

interface Client {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  currency: string;
  exchangeRate: number;
}

interface SaleProduct {
  product: Product;
  quantity: number;
  discount: number;
  convertedPrice: number;
}

interface Sale {
  _id: string;
  products: SaleProduct[];
  total: number;
  date: string;
  status: string;
  client: Client;
}

const Sales: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<SaleProduct[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [includeIVA, setIncludeIVA] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [salesSearchTerm, setSalesSearchTerm] = useState<string>("");
  const [productSearchTerm, setProductSearchTerm] = useState<string>("");

  useEffect(() => {
    fetchClients();
    fetchProducts();
    fetchSales();
  }, []);

  useEffect(() => {
    if (editingSale) {
      setSelectedClient(editingSale.client._id);
      const updatedProducts = editingSale.products.map(sp => ({
        ...sp,
        convertedPrice: convertToMXN(sp.product.price, sp.product.currency, sp.product.exchangeRate)
      }));
      setSelectedProducts(updatedProducts);
      setTotal(editingSale.total);
    }
  }, [editingSale]);

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/clients");
      setClients(response.data);
    } catch (err) {
      console.error("Error loading clients", err);
      setError("Error loading clients");
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      setProducts(response.data);
    } catch (err) {
      console.error("Error loading products", err);
      setError("Error loading products");
    }
  };

  const fetchSales = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/sales");
      setSales(response.data);
    } catch (err) {
      console.error("Error loading sales", err);
      setError("Error loading sales");
    }
  };

  const convertToMXN = (price: number, currency: string, exchangeRate: number): number => {
    if (currency === 'MXN') return price;
    return price * exchangeRate;
  };

  const addProduct = (product: Product) => {
    const convertedPrice = convertToMXN(product.price, product.currency, product.exchangeRate);
    const saleProduct: SaleProduct = {
      product,
      quantity: 1,
      discount: 0,
      convertedPrice,
    };
    setSelectedProducts([...selectedProducts, saleProduct]);
    setTotal(total + convertedPrice);
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    if (isNaN(quantity) || quantity < 0) {
      quantity = 0;
    }

    const updatedProducts = [...selectedProducts];
    const product = updatedProducts[index];
    const priceDifference = (quantity - product.quantity) * product.convertedPrice * (1 - (product.discount / 100 || 0));
    product.quantity = quantity;
    setSelectedProducts(updatedProducts);
    setTotal(prevTotal => prevTotal + priceDifference);
  };

  const handleDiscountChange = (index: number, discount: number) => {
    if (isNaN(discount) || discount < 0) {
      discount = 0;
    }

    const updatedProducts = [...selectedProducts];
    const product = updatedProducts[index];
    const oldDiscountAmount = product.quantity * product.convertedPrice * (product.discount / 100 || 0);
    const newDiscountAmount = product.quantity * product.convertedPrice * (discount / 100);
    const priceDifference = newDiscountAmount - oldDiscountAmount;
    product.discount = discount;
    setSelectedProducts(updatedProducts);
    setTotal(prevTotal => prevTotal - priceDifference);
  };

  const removeProduct = (index: number) => {
    const updatedProducts = [...selectedProducts];
    const product = updatedProducts[index];
    const priceDifference = product.quantity * product.convertedPrice * (1 - (product.discount / 100 || 0));
    updatedProducts.splice(index, 1);
    setSelectedProducts(updatedProducts);
    setTotal(prevTotal => prevTotal - priceDifference);
  };

  const handleSale = async () => {
    if (!selectedClient || selectedProducts.length === 0) {
      alert("Selecciona un cliente y al menos un producto.");
      return;
    }

    try {
      const saleProducts = selectedProducts.map((sp) => ({
        product: sp.product._id,
        quantity: sp.quantity,
        discount: sp.discount,
        convertedPrice: sp.convertedPrice,
      }));

      const newSale = {
        client: selectedClient,
        products: saleProducts,
        total,
        status: 'pendiente', // Estado predeterminado
      };

      const response = await axios.post("http://localhost:5000/api/sales", newSale);
      alert("Venta realizada con éxito");
      setSelectedClient("");
      setSelectedProducts([]);
      setTotal(0);
      fetchSales();
    } catch (error) {
      console.error("Error al realizar la venta:", error);
      setError(`Error al realizar la venta: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleUpdateSale = async () => {
    if (!selectedClient || selectedProducts.length === 0) {
      alert("Selecciona un cliente y al menos un producto.");
      return;
    }

    if (!editingSale) {
      alert("No se está editando ninguna venta.");
      return;
    }

    try {
      const saleProducts = selectedProducts.map((sp) => ({
        product: sp.product._id,
        quantity: sp.quantity,
        discount: sp.discount,
        convertedPrice: sp.convertedPrice,
      }));

      const updatedSale = {
        client: selectedClient,
        products: saleProducts,
        total,
        status: editingSale.status, // Incluir el estado seleccionado
      };

      const response = await axios.put(`http://localhost:5000/api/sales/${editingSale._id}`, updatedSale);
      alert("Venta actualizada con éxito");
      setEditingSale(null);
      setSelectedClient("");
      setSelectedProducts([]);
      setTotal(0);
      fetchSales();
    } catch (error) {
      console.error("Error al actualizar la venta:", error);
      setError(`Error al actualizar la venta: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDeleteSale = async (saleId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/sales/${saleId}`);
      setSales(sales.filter(sale => sale._id !== saleId));
      alert("Venta eliminada con éxito");
    } catch (error) {
      console.error("Error al eliminar la venta:", error);
      setError(`Error al eliminar la venta: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleEditSale = (sale: Sale) => {
    setEditingSale(sale);
  };

  const handleApproveSale = async (saleId: string) => {
    try {
      await axios.put(`http://localhost:5000/api/sales/${saleId}`, { status: "aprobada" });
      setSales(sales.map(sale => sale._id === saleId ? { ...sale, status: "aprobada" } : sale));
      alert("Venta aprobada con éxito");
    } catch (error) {
      console.error("Error al aprobar la venta:", error);
      setError(`Error al aprobar la venta: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleArchiveSale = async (saleId: string) => {
    try {
      await axios.put(`http://localhost:5000/api/sales/${saleId}`, { status: 'archivada' });
      setSales(sales.filter((sale) => sale._id !== saleId)); // Eliminar la venta archivada de la lista principal
      alert('Venta archivada con éxito');
    } catch (error) {
      console.error('Error al archivar la venta:', error);
      setError(`Error al archivar la venta: ${error.response?.data?.message || error.message}`);
    }
  };

  const handlePrintPDF = () => {
    const sale = {
      client: clients.find(client => client._id === selectedClient) || { _id: '', name: 'Cliente desconocido' },
      products: selectedProducts,
      date: new Date().toISOString(),
      status: 'Pendiente',
      total,
      _id: editingSale ? editingSale._id : 'nueva'
    };
  
    let totalAmount = sale.total;
    if (includeIVA) {
      totalAmount += totalAmount * 0.16;
    }
  
    const doc = new jsPDF();
    doc.addImage('src/logo/Maremotors.png', 'PNG', 10, 10, 20, 20);
  
    // Header
    doc.setFontSize(20);
    doc.text("Factura de Venta", 105, 20, { align: "center" });
  
    // Company Info
    doc.setFontSize(12);
    doc.text("Maremotors YAMAHA", 105, 30, { align: "center" });
    doc.setFontSize(10);
    doc.text("Carretera Merida Progreso Kilómetro 24", 105, 35, { align: "center" });
    doc.text("San Ignacio, Yucatan", 105, 40, { align: "center" });
    doc.text("Tel: 9992383587 / 9997389040", 105, 45, { align: "center" });
  
    // Sale and Client Info
    const saleInfo = [
      ["Fecha:", new Date(sale.date).toLocaleDateString() ?? "Fecha no disponible"],
      ["Cliente:", sale.client?.name ?? "Cliente desconocido"],
      ["Estado:", sale.status ? sale.status.charAt(0).toUpperCase() + sale.status.slice(1) : "No definido"]
    ];
  
    doc.autoTable({
      head: [["Campo", "Valor"]],
      body: saleInfo,
      startY: 55,
      theme: 'grid',
      headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] }, // Fondo claro
      bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] }, // Fondo blanco
      alternateRowStyles: { fillColor: [245, 245, 245] } // Fondo gris claro para filas alternas
    });
  
    // Products Table
    const productsTableData = sale.products.map((item, index) => {
      const price = parseFloat(item.convertedPrice?.toString() || "0");
      const quantity = parseInt(item.quantity?.toString() || "0");
      const discount = parseFloat(item.discount?.toString() || "0");
  
      const subtotal = price * quantity;
      const discountAmount = (subtotal * discount) / 100;
      const total = subtotal - discountAmount;
  
      return [
        index + 1,
        item.product?.name || "Producto sin nombre",
        quantity,
        price.toFixed(2),
        subtotal.toFixed(2),
        `${discount.toFixed(2)}%`,
        discountAmount.toFixed(2),
        total.toFixed(2),
      ];
    });
  
    doc.autoTable({
      head: [["#", "Producto", "Cantidad", "Precio Unitario (MXN)", "Subtotal (MXN)", "Descuento (%)", "Descuento (MXN)", "Total (MXN)"]],
      body: productsTableData,
      startY: doc.lastAutoTable.finalY + 10,
      theme: 'grid',
      headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] }, // Fondo claro
      bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] }, // Fondo blanco
      alternateRowStyles: { fillColor: [245, 245, 245] } // Fondo gris claro para filas alternas
    });
  
    // Totals
    const totalAmountWithoutIVA = sale.total;
    const ivaAmount = includeIVA ? totalAmountWithoutIVA * 0.16 : 0;
    const totalAmountWithIVA = includeIVA ? totalAmountWithoutIVA + ivaAmount : totalAmountWithoutIVA;
  
    const totalsData = [
      ["Subtotal:", totalAmountWithoutIVA.toFixed(2)],
      ["IVA (16%):", ivaAmount.toFixed(2)],
      ["Total Final:", totalAmountWithIVA.toFixed(2)]
    ];
  
    doc.autoTable({
      body: totalsData,
      startY: doc.lastAutoTable.finalY + 10,
      theme: 'grid',
      styles: { fontStyle: 'bold' },
      headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] }, // Fondo claro
      bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] } // Fondo blanco
    });
  
    // Footer
    doc.setFontSize(8);
    doc.text("EXISTEN ACCESORIOS Y PARTES DE LOS VEHICULOS QUE PUEDEN TENER VICIOS OCULTOS,", 105, doc.lastAutoTable.finalY + 20, { align: "center" });
    doc.text("NO NOS HACEMOS REPONSABLES QUE ESTANDO EN RESGUARDO O EN EL TRANSCURSO", 105, doc.lastAutoTable.finalY + 25, { align: "center" });
    doc.text("QUE SE RECOJAN SE DAÑEN.", 105, doc.lastAutoTable.finalY + 30, { align: "center" });
  
    doc.save(`venta_${sale._id}.pdf`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <ShoppingCart className="mr-2" />
          {editingSale ? "Editar Venta" : "Nueva Venta"}
        </h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label className="flex items-center text-gray-700 text-sm font-semibold mb-2">
            <Users className="mr-2" size={18} />
            Cliente
          </label>
          <select 
            onChange={(e) => setSelectedClient(e.target.value)} 
            value={selectedClient}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Selecciona un cliente</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>{client.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Package className="mr-2" />
            Agregar Productos
          </h2>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar producto..."
                value={productSearchTerm}
                onChange={(e) => setProductSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select 
              onChange={(e) => {
                const productId = e.target.value;
                const product = products.find(product => product._id === productId);
                if (product) addProduct(product);
              }}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecciona un producto</option>
              {products
                .filter(product => product.name.toLowerCase().includes(productSearchTerm.toLowerCase()))
                .map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name} - {product.price} {product.currency}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Productos Seleccionados</h2>
          {selectedProducts.length === 0 ? (
            <p className="text-gray-500 italic">No hay productos seleccionados.</p>
          ) : (
            <div className="space-y-4">
              {selectedProducts.map((sp, index) => (
                <div key={index} className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{sp.product.name}</p>
                    <p className="text-sm text-gray-600">{sp.convertedPrice?.toFixed(2) || '0.00'} MXN</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center">
                      <button
                        onClick={() => handleQuantityChange(index, Math.max(0, sp.quantity - 1))}
                        className="p-1 rounded-l bg-gray-200 hover:bg-gray-300"
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        type="number"
                        value={sp.quantity}
                        onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                        min="0"
                        className="w-16 text-center border-y border-gray-200 py-1"
                      />
                      <button
                        onClick={() => handleQuantityChange(index, sp.quantity + 1)}
                        className="p-1 rounded-r bg-gray-200 hover:bg-gray-300"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <input
                      type="number"
                      value={isNaN(sp.discount) ? '' : sp.discount}
                      onChange={(e) => handleDiscountChange(index, parseInt(e.target.value))}
                      min="0"
                      max="100"
                      step="0.1"
                      placeholder="Descuento %"
                      className="w-24 p-2 border border-gray-300 rounded"
                    />
                    <button 
                      onClick={() => removeProduct(index)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="flex items-center text-gray-700 text-sm font-semibold mb-2">
            Estado de la Venta
          </label>
          <select
            value={editingSale?.status || 'pendiente'}
            onChange={(e) => {
              if (editingSale) {
                setEditingSale({ ...editingSale, status: e.target.value });
              }
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="pendiente">Pendiente</option>
            <option value="aprobada">Aprobada</option>
            <option value="archivada">Archivada</option>
          </select>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <DollarSign className="mr-2" />
              Total: MXN {isNaN(total) ? '0.00' : total.toFixed(2)}
            </h3>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeIVA}
                onChange={(e) => setIncludeIVA(e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600"
              />
              <span className="text-gray-700">Incluir IVA (16%)</span>
            </label>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={handlePrintPDF}
              className="flex items-center justify-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Printer className="mr-2" size={20} />
              Imprimir PDF
            </button>
            <button 
              onClick={editingSale ? handleUpdateSale : handleSale}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Check className="mr-2" size={20} />
              {editingSale ? "Actualizar Venta" : "Confirmar Venta"}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Ventas Realizadas</h2>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar ventas por cliente..."
            value={salesSearchTerm}
            onChange={(e) => setSalesSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {sales.length === 0 ? (
          <p className="text-gray-500 italic">No hay ventas realizadas.</p>
        ) : (
          <div className="space-y-4">
            {sales
              .filter((sale) => sale.status !== 'archivada') // Excluir ventas archivadas
              .filter((sale) => sale.client.name.toLowerCase().includes(salesSearchTerm.toLowerCase()))
              .map((sale) => (
                <div key={sale._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">{sale.client.name}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        sale.status === 'aprobada'
                          ? 'bg-green-100 text-green-800'
                          : sale.status === 'pendiente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800' // Estilo para 'archivada'
                      }`}
                    >
                      {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)} {/* Capitalizar el estado */}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">Total: MXN {sale.total?.toFixed(2) || '0.00'}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproveSale(sale._id)}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                      <Check size={16} className="mr-1" />
                      Aprobar
                    </button>
                    <button
                      onClick={() => handleEditSale(sale)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      <Edit2 size={16} className="mr-1" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleArchiveSale(sale._id)} // Botón para archivar
                      className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                    >
                      <Trash2 size={16} className="mr-1" />
                      Archivar
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sales;