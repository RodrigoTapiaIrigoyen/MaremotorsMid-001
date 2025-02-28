import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Plus, Trash2 } from 'lucide-react';

const INITIAL_ITEM = { productId: '', serviceId: '', quantity: 1, type: 'product', discount: 0 };

const QuoteForm = ({ onSubmit, initialQuote }) => {
  const [formData, setFormData] = useState({
    reception: '',
    date: '',
    client: '',
    user: '',
    mechanic: '',
    documentType: 'fiscal',
    status: 'pending',
    discount: 0,
    items: [INITIAL_ITEM],
  });

  const [resources, setResources] = useState({ products: [], services: [], clients: [], mechanics: [] });
  const [showIVAModal, setShowIVAModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const [products, services, clients, mechanics] = await Promise.all([
          axios.get('http://localhost:5000/api/products'),
          axios.get('http://localhost:5000/api/services'),
          axios.get('http://localhost:5000/api/clients'),
          axios.get('http://localhost:5000/api/mechanics'),
        ]);
        setResources({ products: products.data, services: services.data, clients: clients.data, mechanics: mechanics.data });
      } catch (error) {
        console.error('Error fetching resources:', error);
      }
    };
    fetchResources();
  }, []);

  useEffect(() => {
    if (initialQuote) {
      setFormData({
        ...initialQuote,
        items: initialQuote.items.map(item => ({
          ...item,
          productId: item.productId?._id || '',
          serviceId: item.serviceId?._id || ''
        }))
      });
    }
  }, [initialQuote]);

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
      const price = item.type === 'product'
        ? resources.products.find(p => p._id === item.productId)?.price || 0
        : resources.services.find(s => s._id === item.serviceId)?.price || 0;
      const itemTotal = price * item.quantity * (1 - (item.discount || 0) / 100);
      return sum + itemTotal;
    }, 0);
    const afterDiscount = subtotal - (subtotal * (discount || 0) / 100);
    return withIVA ? afterDiscount * 1.16 : afterDiscount;
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

      const total = calculateTotal(validItems, discount);
      const quoteData = { ...formData, items: validItems, total };

      let response;
      if (initialQuote?._id) {
        response = await axios.put(`http://localhost:5000/api/quotes/${initialQuote._id}`, quoteData);
        window.location.reload(); // Recargar la página después de actualizar la cotización
      } else {
        response = await axios.post('http://localhost:5000/api/quotes', quoteData);
      }

      // If the status is approved, update the product stock and customer history
      if (status === 'approved') {
        for (const item of validItems) {
          if (item.type === 'product' && item.productId) {
            const product = resources.products.find(p => p._id === item.productId);
            if (product) {
              const newStock = product.stock - item.quantity;
              await axios.put(`http://localhost:5000/api/products/${item.productId}`, { stock: newStock });
            }
          }
        }

        // Add the sale to the customer's history
        const sale = {
          date: formData.date,
          total,
          items: validItems,
        };
        await axios.post(`http://localhost:5000/api/clients/${formData.client}/sales`, sale);
      }

      setSuccessMessage('Quote created successfully!');
      setErrorMessage(null);
      onSubmit(response.data); // Llamar a la función onSubmit con los datos de la cotización creada o actualizada
    } catch (error) {
      console.error('Error saving quote:', error);
      setErrorMessage('Error saving quote. Please try again.');
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
    doc.addImage('src/logo/Maremotors.png', 'PNG', 10, 10, 30, 20);

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
      const importe = price * item.quantity;
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
    <>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          {initialQuote ? 'Edit Quote' : 'Create Quote'}
        </h2>

        {successMessage && <p className="text-green-500">{successMessage}</p>}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input label="Reception" name="reception" value={formData.reception} onChange={handleChange} />
          <Input label="Date" type="date" name="date" value={formData.date} onChange={handleChange} />
          <Select label="Client" name="client" value={formData.client || ''} onChange={handleChange} options={resources.clients} />
          <Input label="User" name="user" value={formData.user} onChange={handleChange} />
          <Select label="Mechanic" name="mechanic" value={formData.mechanic || ''} onChange={handleChange} options={resources.mechanics} />
          <Select label="Document Type" name="documentType" value={formData.documentType} onChange={handleChange} options={[{ _id: 'fiscal', name: 'Fiscal' }, { _id: 'no fiscal', name: 'No Fiscal' }]} />
          <Select label="Status" name="status" value={formData.status} onChange={handleChange} options={[{ _id: 'pending', name: 'Pending' }, { _id: 'approved', name: 'Approved' }]} />
          <Input label="Discount (%)" type="number" name="discount" value={formData.discount} onChange={handleChange} />
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Items</h3>
          {formData.items.map((item, index) => (
            <div key={index} className="border p-4 rounded-md mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Select label="Type" value={item.type} onChange={(e) => handleItemChange(index, 'type', e.target.value)} options={[{ _id: 'product', name: 'Product' }, { _id: 'service', name: 'Service' }]} />
                {item.type === 'product' ? (
                  <Select label="Product" value={item.productId || ''} onChange={(e) => handleItemChange(index, 'productId', e.target.value)} options={resources.products} />
                ) : (
                  <Select label="Service" value={item.serviceId || ''} onChange={(e) => handleItemChange(index, 'serviceId', e.target.value)} options={resources.services} />
                )}
                <Input label="Quantity" type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))} min={1} />
                <Input label="Discount (%)" type="number" value={item.discount} onChange={(e) => handleItemChange(index, 'discount', Number(e.target.value))} min={0} max={100} />
                <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700 font-semibold">
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>
            </div>
          ))}

          <button type="button" onClick={() => setFormData(prev => ({ ...prev, items: [...prev.items, INITIAL_ITEM] }))} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Add Item
          </button>
        </div>

        <div className="flex gap-4 mt-6">
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            {initialQuote ? 'Update Quote' : 'Create Quote'}
          </button>
          <button type="button" onClick={handleGeneratePDF} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
            Download PDF
          </button>
        </div>
      </form>

      {showIVAModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">¿Desea incluir IVA (16%)?</h3>
            <p className="mb-4">
              Subtotal: ${calculateTotal(formData.items, formData.discount).toFixed(2)}
              <br />
              Total con IVA: ${calculateTotal(formData.items, formData.discount, true).toFixed(2)}
            </p>
            <div className="flex justify-end gap-4">
              <button onClick={() => generatePDF(false)} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                Sin IVA
              </button>
              <button onClick={() => generatePDF(true)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Con IVA
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const Input = ({ label, ...props }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-600">{label}:</label>
    <input {...props} className="mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-600">{label}:</label>
    <select {...props} className="mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option._id} value={option._id}>
          {option.name}
        </option>
      ))}
    </select>
  </div>
);

export default QuoteForm;