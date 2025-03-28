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

interface Reception {
  _id: string;
  model: {
    _id: string;
    name: string;
  };
  type: string;
  color: string;
  plates: string;
  kilometers: string;
  fuelTank: string;
}

interface Unit {
  _id: string;
  model: string;
}

const Quotes: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReception, setSelectedReception] = useState<string | null>(null);
  const [receptions, setReceptions] = useState<Reception[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedQuotes, setSelectedQuotes] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const quotesResponse = await axios.get('http://localhost:5000/api/quotes');
        const clientsResponse = await axios.get('http://localhost:5000/api/clients');
        const mechanicsResponse = await axios.get('http://localhost:5000/api/mechanics');
        const productsResponse = await axios.get('http://localhost:5000/api/products');
        const servicesResponse = await axios.get('http://localhost:5000/api/services');
        const unitsResponse = await axios.get('http://localhost:5000/api/units');
        
        setQuotes(quotesResponse.data);
        setClients(clientsResponse.data);
        setMechanics(mechanicsResponse.data);
        setProducts(productsResponse.data);
        setServices(servicesResponse.data);
        setUnits(unitsResponse.data);
      } catch (error) {
        console.error('Error fetching resources:', error);
      }
    };

    fetchResources();
  }, []);

  useEffect(() => {
    const fetchReceptions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/receptions');
        setReceptions(response.data);
      } catch (error) {
        console.error('Error fetching receptions:', error);
      }
    };

    fetchReceptions();
  }, []);

  const fetchReceptions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/receptions');
      setReceptions(response.data);
    } catch (error) {
      console.error('Error fetching receptions:', error);
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(client => client._id === clientId);
    return client ? client.name : clientId;
  };

  const getMechanicName = (mechanicId: string) => {
    const mechanic = mechanics.find(mechanic => mechanic._id === mechanicId);
    return mechanic ? mechanic.name : mechanicId;
  };

  const filteredQuotes = quotes.filter((quote) =>
    quote.status !== 'archived' && // Excluir cotizaciones archivadas
    getClientName(quote.client).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/quotes/${id}`);
      setQuotes(quotes.filter((quote) => quote._id !== id));
      setSelectedQuotes(new Set([...selectedQuotes].filter(quoteId => quoteId !== id)));
    } catch (error) {
      console.error('Error deleting quote:', error);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const deletePromises = Array.from(selectedQuotes).map(id =>
        axios.delete(`http://localhost:5000/api/quotes/${id}`)
      );
      await Promise.all(deletePromises);
      setQuotes(quotes.filter(quote => !selectedQuotes.has(quote._id)));
      setSelectedQuotes(new Set());
    } catch (error) {
      console.error('Error deleting selected quotes:', error);
    }
  };

  const handleSelectQuote = (id: string) => {
    const newSelected = new Set(selectedQuotes);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedQuotes(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedQuotes.size === filteredQuotes.length) {
      setSelectedQuotes(new Set());
    } else {
      setSelectedQuotes(new Set(filteredQuotes.map(quote => quote._id)));
    }
  };

  const handleEdit = (quote: Quote) => {
    setSelectedQuote(quote);
  };

  const handleFormSubmit = (updatedQuote: Quote) => {
    if (updatedQuote.status === 'archived') {
      // Si el estado es 'archived', eliminar la cotización de la lista principal
      setQuotes(quotes.filter((quote) => quote._id !== updatedQuote._id));
    } else {
      // Si no está archivada, actualizar la cotización en la lista principal
      setQuotes(quotes.map((quote) => (quote._id === updatedQuote._id ? updatedQuote : quote)));
    }
    setSelectedQuote(null); // Limpiar la cotización seleccionada
  };

  const handleGeneratePDF = (quote: Quote) => {
    setSelectedQuote(quote);
    setIsModalOpen(true);
    fetchReceptions();
  };

  const generatePDFWithReception = async () => {
    try {
      if (!selectedReception || !selectedQuote || !selectedModel) {
        console.error('No reception, quote, or model selected');
        return;
      }

      const reception = receptions.find(r => r._id === selectedReception);
      const client = clients.find(c => c._id === selectedQuote.client);
      const mechanic = mechanics.find(m => m._id === selectedQuote.mechanic);

      const doc = new jsPDF();

      // Add logo
      doc.addImage('src/logo/Maremotors.png', 'PNG', 10, 10, 20, 20);

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
      doc.text(`CLIENTE: ${client?.name || 'Desconocido'}`, 10, 70);
      doc.text(`MODELO: ${selectedModel}`, 10, 80);
      doc.text(`TIPO: ${reception?.type || 'Desconocido'}`, 10, 90);
      doc.text(`COLOR: ${reception?.color || 'Desconocido'}`, 10, 100);
      doc.text(`PLACAS: ${reception?.plates || 'Desconocido'}`, 10, 110);
      doc.text(`S/. HRS/KMS: ${reception?.kilometers || 'Desconocido'}`, 10, 120);
      doc.text(`GASOLINA: ${reception?.fuelTank || 'Desconocido'}`, 10, 130);
      doc.text(`MECANICO: ${mechanic?.name || 'Desconocido'}`, 10, 140);

      const itemsTableData = selectedQuote.items.map(item => {
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
      setIsModalOpen(false);
      setSelectedReception(null);
      setSelectedModel(null);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="bg-white pb-4 shadow-sm">
        <h1 className="text-3xl font-semibold text-gray-800 text-center mb-6">Quotes</h1>
        <div className="flex items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Search by client name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mb-6">
        <QuoteForm onSubmit={handleFormSubmit} initialQuote={selectedQuote} />
      </div>

      {/* Botón de eliminar seleccionados */}
      {selectedQuotes.size > 0 && (
        <div className="mb-4">
          <button
            onClick={handleDeleteSelected}
            className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Delete Selected ({selectedQuotes.size})
          </button>
        </div>
      )}

      {filteredQuotes.length > 0 ? (
        filteredQuotes.map((quote) => (
          <div key={quote._id} className="bg-white shadow-sm rounded-lg p-6 mb-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedQuotes.has(quote._id)}
                  onChange={() => handleSelectQuote(quote._id)}
                  className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <h2 className="text-2xl font-medium text-gray-800 ml-4">{getClientName(quote.client)}</h2>
              </div>
            </div>
            <p className="text-sm text-gray-600">Date: {new Date(quote.date).toLocaleDateString()}</p>
            <p className="text-sm text-gray-600">
              Status:{' '}
              <span
                className={`font-semibold ${
                  quote.status === 'approved' ? 'text-green-600' : 'text-yellow-600'
                }`}
              >
                {quote.status}
              </span>
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
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Seleccionar Recepción</h2>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              onChange={(e) => setSelectedReception(e.target.value)}
            >
              <option value="">Selecciona una recepción</option>
              {receptions.map((reception) => (
                <option key={reception._id} value={reception._id}>
                  {reception.model.name} - {reception.type} - {reception.color}
                </option>
              ))}
            </select>

            <div>
              <h3 className="text-lg font-semibold mb-2">Seleccionar Modelo</h3>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                onChange={(e) => setSelectedModel(e.target.value)}
                value={selectedModel || ''}
              >
                <option value="">Selecciona un modelo</option>
                {units.map((unit) => (
                  <option key={unit._id} value={unit.model}>
                    {unit.model}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedModel(null);
                  setSelectedReception(null);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancelar
              </button>
              <button
                onClick={generatePDFWithReception}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                disabled={!selectedReception || !selectedModel}
              >
                Generar PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quotes;