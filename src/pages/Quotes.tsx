import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import QuoteForm from '../components/QuoteForm';

interface Item {
  productId?: {
    _id: string;
    name: string;
    price: number;
  };
  serviceId?: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
  type: string;
}

interface Quote {
  _id: string;
  reception: string;
  date: string;
  client: string;
  user: string;
  mechanic: string;
  documentType: string;
  status: string;
  discount: number;
  items: Item[];
  total: number;
}

interface Client {
  _id: string;
  name: string;
}

interface Mechanic {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
}

interface Service {
  _id: string;
  name: string;
  price: number;
}

const Quotes: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const quotesResponse = await axios.get('http://localhost:5000/api/quotes');
        const clientsResponse = await axios.get('http://localhost:5000/api/clients');
        const mechanicsResponse = await axios.get('http://localhost:5000/api/mechanics');
        const productsResponse = await axios.get('http://localhost:5000/api/products');
        const servicesResponse = await axios.get('http://localhost:5000/api/services');
        setQuotes(quotesResponse.data);
        setClients(clientsResponse.data);
        setMechanics(mechanicsResponse.data);
        setProducts(productsResponse.data);
        setServices(servicesResponse.data);
      } catch (error) {
        console.error('Error fetching resources:', error);
      }
    };

    fetchResources();
  }, []);

  const getClientName = (clientId: string) => {
    const client = clients.find(client => client._id === clientId);
    return client ? client.name : clientId;
  };

  const getMechanicName = (mechanicId: string) => {
    const mechanic = mechanics.find(mechanic => mechanic._id === mechanicId);
    return mechanic ? mechanic.name : mechanicId;
  };

  const filteredQuotes = quotes.filter((quote) =>
    getClientName(quote.client).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/quotes/${id}`);
      setQuotes(quotes.filter((quote) => quote._id !== id));
    } catch (error) {
      console.error('Error deleting quote:', error);
    }
  };

  const handleEdit = (quote: Quote) => {
    setSelectedQuote(quote);
  };

  const handleFormSubmit = (updatedQuote: Quote) => {
    setQuotes(quotes.map((quote) => (quote._id === updatedQuote._id ? updatedQuote : quote)));
    setSelectedQuote(null);
  };

  const handleGeneratePDF = (quote: Quote) => {
    const client = clients.find(c => c._id === quote.client);
    const mechanic = mechanics.find(m => m._id === quote.mechanic);

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

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Cotización para Mecánico", 105, 55, { align: "center" });

    doc.setFontSize(12);
    doc.text(`CLIENTE: ${client?.name || 'VERONICA'}`, 10, 70);
    doc.text(`MODELO: `, 10, 80);
    doc.text(`TIPO: `, 10, 90);
    doc.text(`COLOR: `, 10, 100);
    doc.text(`PLACAS: `, 10, 110);
    doc.text(`S/. HRS/KMS: `, 10, 120);
    doc.text(`GASOLINA: `, 10, 130);
    doc.text(`MECANICO: ${mechanic?.name || 'Armando'}`, 10, 140);

    const itemsTableData = quote.items.map(item => {
      const itemData = item.type === 'product'
        ? products.find(p => p._id === item.productId?._id)
        : services.find(s => s._id === item.serviceId?._id);

      return [
        itemData?.name || '',
        item.quantity,
      ];
    });

    doc.autoTable({
      startY: 150,
      head: [['ARTÍCULO', 'CANT']],
      body: itemsTableData,
      theme: 'grid',
      styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [0, 0, 0] },
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
    });

    doc.save(`${client?.name || 'quote'}_cotizacion_mecanico.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold text-gray-800 text-center mb-6">Quotes</h1>
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search by client name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-1/2 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-6">
        <QuoteForm onSubmit={handleFormSubmit} initialQuote={selectedQuote} />
      </div>
      {filteredQuotes.length > 0 ? (
        filteredQuotes.map((quote) => (
          <div key={quote._id} className="bg-white shadow-sm rounded-lg p-6 mb-6 border border-gray-200">
            <h2 className="text-2xl font-medium text-gray-800">{getClientName(quote.client)}</h2>
            <p className="text-sm text-gray-600">Date: {new Date(quote.date).toLocaleDateString()}</p>
            <p className="text-sm text-gray-600">
              Status: <span className={`font-semibold ${quote.status === 'approved' ? 'text-green-600' : 'text-yellow-600'}`}>{quote.status}</span>
            </p>
            <p className="text-sm text-gray-600">Reception: {quote.reception}</p>
            <p className="text-sm text-gray-600">Document Type: {quote.documentType}</p>
            <p className="text-sm text-gray-600">User: {quote.user}</p>
            <p className="text-sm text-gray-600">Mechanic: {getMechanicName(quote.mechanic)}</p>
            <p className="text-sm text-gray-600">Discount: ${quote.discount.toFixed(2)}</p>
            <p className="text-sm text-gray-600">Total: ${quote.total.toFixed(2)}</p>
            <h3 className="text-lg font-semibold text-gray-700 mt-4">Items:</h3>
            <ul className="list-none space-y-3">
              {quote.items.map((item, index) => (
                <li key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                  {item.type === 'product' && item.productId && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-700">Product: {item.productId.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-600">Price: ${item.productId.price.toFixed(2)}</p>
                    </div>
                  )}
                  {item.type === 'service' && item.serviceId && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-700">Service: {item.serviceId.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-600">Price: ${item.serviceId.price.toFixed(2)}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => handleEdit(quote)}
                className="mr-4 text-blue-500 hover:text-blue-700 font-semibold"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(quote._id)}
                className="mr-4 text-red-500 hover:text-red-700 font-semibold"
              >
                Delete
              </button>
              <button
                onClick={() => handleGeneratePDF(quote)}
                className="text-green-500 hover:text-green-700 font-semibold"
              >
                Print PDF
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No quotes available.</p>
      )}
    </div>
  );
};

export default Quotes;