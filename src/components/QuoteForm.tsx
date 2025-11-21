import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Plus, Trash2, FileText, Download, ClipboardCheck, ChevronRight, Package2, Wrench, DollarSign } from 'lucide-react';
import { useLocation } from 'react-router-dom'; // Importar useLocation
import logoBase64 from '../logo/MaremotorsBase64';

const INITIAL_ITEM = { productId: '', serviceId: '', quantity: 1, type: 'product', discount: 0, currency: 'USD' };

const QuoteForm = ({ onSubmit, initialQuote }) => {
  const location = useLocation();
  const { state } = location; // Recibir los datos enviados desde Reception.tsx

  const [formData, setFormData] = useState({
    reception: state?.recepcion || '',
    date: state?.fecha || '',
    client: state?.cliente || '',
    user: state?.usuario || '', // Prellenar con el usuario recibido
    mechanic: '',
    documentType: 'fiscal',
    status: 'pending',
    discount: 0,
    items: [{ productId: '', serviceId: '', quantity: 1, type: 'product', discount: 0, currency: 'USD' }],
  });

  const [resources, setResources] = useState({ products: [], services: [], clients: [], mechanics: [] });
  const [showIVAModal, setShowIVAModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const [products, services, clients, mechanics] = await Promise.all([
          api.get('/products'),
          api.get('/services'),
          api.get('/clients'),
          api.get('/mechanics'),
        ]);
        setResources({ products: products.data, services: services.data, clients: clients.data, mechanics: mechanics.data });
      } catch (error) {
        console.error('Error fetching resources:', error);
      }
    };
    fetchResources();
  }, []);

  useEffect(() => {
    if (initialQuote && resources.products.length > 0 && resources.services.length > 0) {
      const mappedItems = initialQuote.items.map(item => {
        // Determine if it's a product or service based on the presence of productId or serviceId
        const isProduct = !!item.productId;
        const type = isProduct ? 'product' : 'service';

        // item.productId/serviceId can be either an Object with _id or a plain id string
        let id = '';
        if (isProduct) {
          if (typeof item.productId === 'string') id = item.productId;
          else if (item.productId && item.productId._id) id = item.productId._id;
        } else {
          if (typeof item.serviceId === 'string') id = item.serviceId;
          else if (item.serviceId && item.serviceId._id) id = item.serviceId._id;
        }

        return {
          type,
          productId: isProduct ? id : '',
          serviceId: !isProduct ? id : '',
          quantity: item.quantity,
          discount: item.discount || 0,
          currency: item.currency || 'USD'
        };
      });

      setFormData({
        ...initialQuote,
        items: mappedItems,
        status: initialQuote.status || 'pending',
        discount: initialQuote.discount || 0
      });
    }
  }, [initialQuote, resources.products, resources.services]);

  useEffect(() => {
    if (state) {
      setFormData((prev) => ({
        ...prev,
        reception: state.recepcion || '',
        date: state.fecha || '',
        client: resources.clients.find(c => c.name === state.cliente)?._id || '',
        user: state.usuario || '', // Asignar el usuario recibido desde Reception
        mechanic: resources.mechanics.find(m => m.name === state.mecanico)?._id || '',
      }));
    }
  }, [state, resources.clients, resources.mechanics]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));
  };

  const handleRemoveItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };
  
  const calculateTotal = (items, discount, withIVA = false) => {
    const subtotal = items.reduce((sum, item) => {
      const product = resources.products.find(p => p._id === item.productId);
      const price = item.type === 'product'
        ? product?.price || 0
        : resources.services.find(s => s._id === item.serviceId)?.price || 0;
      const exchangeRate = item.type === 'product' ? product?.exchangeRate || 1 : 1;
      const itemTotal = (price * item.quantity * exchangeRate) * (1 - (item.discount || 0) / 100);
      return sum + itemTotal;
    }, 0);
    const afterDiscount = subtotal - (subtotal * (discount || 0) / 100);
    return withIVA ? afterDiscount * 1.16 : afterDiscount;
  };

  const calculateItemTotal = (item) => {
    const itemData = item.type === 'product'
      ? resources.products.find(p => p._id === item.productId)
      : resources.services.find(s => s._id === item.serviceId);

    const price = itemData?.price || 0;
    const exchangeRate = item.type === 'product' ? itemData?.exchangeRate || 1 : 1;
    const importe = price * item.quantity * exchangeRate;
    const importeConDescuento = importe * (1 - (item.discount || 0) / 100);
    
    return {
      price,
      importe,
      importeConDescuento,
      itemData
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { items, discount, status, ...rest } = formData;
      if (Object.values(rest).some(value => value === '' || value === null || value === undefined)) {
        alert('Please complete all required fields.');
        return;
      }

      const validItems = items.map(item => ({
        ...item,
        serviceId: item.type === 'product' ? undefined : item.serviceId,
        productId: item.type === 'service' ? undefined : item.productId,
      }));

      // Validaciones básicas: cada ítem debe tener el id correspondiente y cantidad >= 1
      for (const [i, it] of validItems.entries()) {
        if (it.type === 'product' && !it.productId) {
          alert(`El artículo ${i + 1} es un producto pero no tiene productId.`);
          return;
        }
        if (it.type === 'service' && !it.serviceId) {
          alert(`El artículo ${i + 1} es un servicio pero no tiene serviceId.`);
          return;
        }
        if (!it.quantity || it.quantity <= 0) {
          alert(`La cantidad del artículo ${i + 1} debe ser mayor a 0.`);
          return;
        }
      }

      const total = calculateTotal(validItems, discount);
      const quoteData = { ...formData, items: validItems, total };

      // Loguear payload para depuración si algo falla en el servidor
      console.debug('Preparing to send quote:', quoteData);

      let response;
      if (initialQuote?._id) {
        response = await api.put(`/quotes/${initialQuote._id}`, quoteData);
        window.location.reload();
      } else {
        response = await api.post('/quotes', quoteData);
      }

      // El backend ahora maneja el descuento de inventario cuando status === 'approved'
      // Solo registramos la venta en el cliente si es necesario
      if (status === 'approved') {
        const sale = {
          date: formData.date,
          total,
          items: validItems,
        };
        try {
          await api.post(`/clients/${formData.client}/sales`, sale);
        } catch (err) {
          console.error('Failed to record sale for client:', formData.client, err);
        }
      }

      setSuccessMessage('Quote created successfully!');
      setErrorMessage(null);
      onSubmit(response.data);
      window.location.reload();
    } catch (error) {
      console.error('Error saving quote:', error);
      // Si es un error de axios, mostrar detalles útiles
      if (axios.isAxiosError(error)) {
        console.error('Axios response:', error.response?.status, error.response?.data);
        const serverMessage = error.response?.data?.message || error.response?.data || error.message;
        setErrorMessage(typeof serverMessage === 'string' ? serverMessage : 'Error saving quote (server error)');
      } else {
        setErrorMessage('Error saving quote. Please try again.');
      }
      setSuccessMessage(null);
    }
  };

  const handleGeneratePDF = () => {
    setShowIVAModal(true);
  };

  const generatePDF = (withIVA) => {
    const subtotal = calculateTotal(formData.items, formData.discount, false);
    const iva = withIVA ? subtotal * 0.16 : 0;
    const total = subtotal + iva;
    const client = resources.clients.find(c => c._id === formData.client)?.name;

    const doc = new jsPDF();
    doc.addImage(logoBase64, 'PNG', 10, 10, 20, 20);

    doc.setFontSize(16);
    doc.setTextColor(40);
    doc.text("Maremotors YAMAHA", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text("Carretera Merida Progreso Kilómetro Merida 24", 105, 30, { align: "center" });
    doc.text("San Ignacio, Yucatan", 105, 35, { align: "center" });
    doc.text("Tel: 9992383587 / 9997389040", 105, 40, { align: "center" });
    doc.text("Horario: Lunes a Viernes de 9AM - 5PM, Sábado de 9AM - 1:30PM", 105, 45, { align: "center" });
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("EXISTEN ACCESORIOS Y PARTES DE LOS VEHICULOS QUE PUEDEN TENER VICIOS OCULTOS,", 105, 55, { align: "center" });
    doc.text("NO NOS HACEMOS REPONSABLES QUE ESTANDO EN RESGUARDO O EN EL TRANSCURSO", 105, 60, { align: "center" });
    doc.text("QUE SE RECOJAN SE DAÑEN.", 105, 65, { align: "center" });

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Cotización", 105, 75, { align: "center" });

    doc.autoTable({
      startY: 85,
      head: [['Campo', 'Valor']],
      body: [
        ['Recepción', formData.reception],
        ['Fecha', formData.date],
        ['Cliente', client || ''],
        ['Usuario', formData.user],
        ['Mecánico', resources.mechanics.find(m => m._id === formData.mechanic)?.name || ''],
        ['Tipo de Documento', formData.documentType],
        ['Estado', formData.status],
      ],
      theme: 'grid',
      styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0] },
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
    });

    const itemsTableData = formData.items.map(item => {
      const itemData = item.type === 'product'
        ? resources.products.find(p => p._id === item.productId)
        : resources.services.find(s => s._id === item.serviceId);

      const price = itemData?.price || 0;
      const discount = item.discount || 0;
      const exchangeRate = item.type === 'product' ? itemData?.exchangeRate || 1 : 1;
      const importe = price * item.quantity * exchangeRate;
      const importeConDescuento = importe * (1 - discount / 100);

      return [
        item.type,
        itemData?.name || '',
        item.quantity,
        `$${price.toFixed(2)}`,
        `${discount}%`,
        `$${importe.toFixed(2)}`,
        `$${importeConDescuento.toFixed(2)}`,
      ];
    });

    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 10,
      head: [['Tipo', 'Nombre', 'Cantidad', 'Precio', 'Descuento', 'Importe', 'Importe con Descuento']],
      body: itemsTableData,
      theme: 'grid',
      styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0] },
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
    });

    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 10,
      head: [['Campo', 'Valor']],
      body: [
        ['Descuento', `${formData.discount}%`],
        ['Subtotal', `$${subtotal.toFixed(2)}`],
        ['IVA (16%)', `$${iva.toFixed(2)}`],
        ['Total', `$${total.toFixed(2)}`],
      ],
      theme: 'grid',
      styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0] },
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
    });

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Gracias por su confianza", 105, doc.autoTable.previous.finalY + 20, { align: "center" });
    doc.text("Si tiene alguna duda sobre esta cotización, póngase en contacto con nosotros", 105, doc.autoTable.previous.finalY + 30, { align: "center" });
    doc.text("Tel: 9992383587 / 9997389040", 105, doc.autoTable.previous.finalY + 40, { align: "center" });

    doc.save(`${client || 'quote'}_cotizacion.pdf`);
    setShowIVAModal(false);
  };

  return (
    <div className="min-h-screen animate-gradient py-12 px-4">
      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
        <div className="glass-effect rounded-3xl p-8 shadow-soft">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              {initialQuote ? 'Editar Cotización' : 'Nueva Cotización'}
            </h2>
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-white/50 rounded-full">
              <span className="text-gray-600">Sistema de Cotizaciones</span>
              <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
              <span className="font-semibold text-gray-800">Maremotors YAMAHA</span>
            </div>
          </div>

          {/* Messages */}
          {successMessage && (
            <div className="mb-8 transform hover-scale">
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-xl">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ClipboardCheck className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-800">{successMessage}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {errorMessage && (
            <div className="mb-8 transform hover-scale">
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-xl">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Trash2 className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{errorMessage}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-6">
              <Input label="Recepción" name="reception" value={formData.reception} onChange={handleChange} />
              <Input label="Fecha" type="date" name="date" value={formData.date} onChange={handleChange} />
              <SelectWithSearch
                label="Cliente"
                name="client"
                value={formData.client || ''} // El valor debe ser el ID del cliente
                onChange={handleChange}
                options={resources.clients} // Lista de clientes
              />
              <Input
                label="Usuario"
                name="user"
                value={formData.user} // Mostrar el usuario recibido o permitir que se escriba manualmente
                onChange={handleChange}
              />
            </div>
            <div className="space-y-6">
              <Select
                label="Mecánico"
                name="mechanic"
                value={formData.mechanic || ''} // El valor debe ser el ID del mecánico
                onChange={handleChange}
                options={resources.mechanics} // Lista de mecánicos
              />
              <Select label="Tipo de Documento" name="documentType" value={formData.documentType} onChange={handleChange} options={[{ _id: 'fiscal', name: 'Fiscal' }, { _id: 'no fiscal', name: 'No Fiscal' }]} />
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Estado</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                  className="border p-2 w-full rounded"
                >
                  <option value="pending">Pendiente</option>
                  <option value="approved">Aprobado</option>
                  <option value="archived">Archivado</option> {/* Cambiar a 'archived' */}
                </select>
              </div>
              <Input label="Descuento (%)" type="number" name="discount" value={formData.discount} onChange={handleChange} />
            </div>
          </div>

          {/* Items Section */}
          <div className="bg-white/50 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package2 className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Artículos</h3>
              </div>
            </div>

            <div className="space-y-6">
              {formData.items.map((item, index) => {
                const { price, importe, importeConDescuento, itemData } = calculateItemTotal(item);
                
                return (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-md hover-scale">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="col-span-1 md:col-span-2 lg:col-span-1">
                        <Select
                          label="Tipo"
                          value={item.type}
                          onChange={(e) => handleItemChange(index, 'type', e.target.value)}
                          options={[
                            { _id: 'product', name: 'Producto' },
                            { _id: 'service', name: 'Servicio' }
                          ]}
                          icon={item.type === 'product' ? Package2 : Wrench}
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-1">
                        {item.type === 'product' ? (
                          <SelectWithSearch
                            label="Producto"
                            value={item.productId || ''}
                            onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                            options={resources.products}
                            icon={Package2}
                          />
                        ) : (
                          <SelectWithSearch
                            label="Servicio"
                            value={item.serviceId || ''}
                            onChange={(e) => handleItemChange(index, 'serviceId', e.target.value)}
                            options={resources.services}
                            icon={Wrench}
                          />
                        )}
                      </div>
                      <Input
                        label="Cantidad"
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                        min={1}
                      />
                      <Input
                        label="Descuento (%)"
                        type="number"
                        value={item.discount}
                        onChange={(e) => handleItemChange(index, 'discount', Number(e.target.value))}
                        min={0}
                        max={100}
                      />

                      {itemData && (
                        <div className="col-span-1 md:col-span-2 lg:col-span-4">
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-gray-600">Precio unitario:</span>
                              <span className="font-semibold text-blue-600">${price.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-gray-600">Subtotal:</span>
                              <span className="font-semibold text-blue-600">${importe.toFixed(2)}</span>
                            </div>
                            {item.discount > 0 && (
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Total con descuento:</span>
                                <span className="font-semibold text-green-600">${importeConDescuento.toFixed(2)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="mt-4 flex items-center gap-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                );
              })}

              {/* Botón de agregar artículo fijo */}
              <div className="sticky bottom-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, items: [...prev.items, INITIAL_ITEM] }))}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <Plus className="h-4 w-4" />
                  <span>Agregar Artículo</span>
                </button>
              </div>
            </div>
          </div>

          {/* Total Summary */}
          <div className="bg-white rounded-xl p-6 shadow-md mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Resumen</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-xl font-semibold">${calculateTotal(formData.items, 0).toFixed(2)}</span>
              </div>
              {formData.discount > 0 && (
                <div className="flex justify-between items-center text-green-600">
                  <span>Descuento general ({formData.discount}%):</span>
                  <span className="text-xl font-semibold">
                    -${(calculateTotal(formData.items, 0) * (formData.discount / 100)).toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="text-gray-800 font-medium">Total:</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${calculateTotal(formData.items, formData.discount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={handleGeneratePDF}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Download className="h-5 w-5" />
              <span>Generar PDF</span>
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <ClipboardCheck className="h-5 w-5" />
              <span>{initialQuote ? 'Actualizar' : 'Crear'} Cotización</span>
            </button>
          </div>
        </div>
      </form>

      {/* IVA Modal */}
      {showIVAModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl transform hover-scale">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">¿Incluir IVA (16%)?</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-xl font-semibold">${calculateTotal(formData.items, formData.discount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-gray-600">Total con IVA</span>
                <span className="text-xl font-semibold text-blue-600">${calculateTotal(formData.items, formData.discount, true).toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => generatePDF(false)}
                className="px-6 py-3 text-gray-700 hover:text-gray-900 transition-colors duration-200"
              >
                Sin IVA
              </button>
              <button
                onClick={() => generatePDF(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Con IVA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      {...props}
      className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 input-focus"
      required
    />
  </div>
);

const Select = ({ label, options, icon: Icon, ...props }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <select
        {...props}
        className={`w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 input-focus ${Icon ? 'pl-10' : ''}`}
        required
      >
        <option value="">Seleccionar {label}</option>
        {options.map((option) => (
          <option key={option._id} value={option._id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  </div>
);

const SelectWithSearch = ({ label, options, icon: Icon, value, onChange, ...props }) => {
  const [searchText, setSearchText] = useState(''); // Estado para el texto de búsqueda
  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(searchText.toLowerCase())
  ); // Filtrar las opciones según el texto de búsqueda

  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div className={`relative ${Icon ? 'pl-10' : ''}`}>
          <input
            type="text"
            placeholder={`Buscar ${label}...`}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-t-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          <select
            value={value}
            onChange={onChange}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-b-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            {...props}
          >
            <option value="">Seleccionar {label}</option>
            {filteredOptions.map((option) => (
              <option key={option._id} value={option._id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default QuoteForm;