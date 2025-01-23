import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import SearchBar from './SearchBar';
import QuotesTable from './QuotesTable';
import QuoteModal from './QuoteModal';
import NewQuoteForm from './newQuoteForm'; // Asegúrate de importar el formulario
interface Quote {
  id: string;
  reception: string;
  date: string;
  client: string;
  unit: string;
  document: string;
  status: 'pending' | 'approved' | 'archived';
}

export default function Quotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await fetch('http://localhost:5000/quotes');
        const data = await response.json();
        console.log('Quotes data:', data); // Verifica que los datos se reciban correctamente
        setQuotes(data);
      } catch (error) {
        console.error('Error fetching quotes:', error);
      }
    };

    fetchQuotes();
  }, []);

  const handleSaveQuote = (quote: Quote) => {
    if (quote.id) {
      setQuotes((prev) => prev.map((q) => (q.id === quote.id ? quote : q)));
    } else {
      setQuotes((prev) => [...prev, { ...quote, id: Date.now().toString() }]);
    }
    setShowModal(false);
  };

  const handleEdit = (quote: Quote) => {
    setCurrentQuote(quote);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setQuotes((prev) => prev.filter((q) => q.id !== id));
  };

  const filteredQuotes = quotes.filter(
    (quote) =>
      quote.client &&
      quote.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Cotizaciones
        </h2>
        <button
          onClick={() => {
            setCurrentQuote(null); // Resetea la cotización actual para una nueva
            setShowModal(true);
          }}
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Cotización
        </button>
      </div>

      {/* Search Bar */}
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Quotes Table */}
      <QuotesTable
        quotes={filteredQuotes}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Quote Modal */}
      {showModal && (
        <QuoteModal
          quote={currentQuote} // Pasa la cotización actual (o null para nueva)
          onClose={() => setShowModal(false)}
          onSave={handleSaveQuote}
        >
          {/* El formulario de cotización debería ser parte del modal */}
          <NewQuoteForm
            initialData={currentQuote} // Pasa los datos iniciales para edición
            onSave={handleSaveQuote}
          />
        </QuoteModal>
      )}
    </div>
  );
}
