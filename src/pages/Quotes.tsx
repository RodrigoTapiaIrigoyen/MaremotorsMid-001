import React, { useState, useEffect } from 'react';
import { createQuote, getQuotes, updateQuote, deleteQuote } from '../services/quotes.service';
import { FaEdit, FaTrash } from 'react-icons/fa';

const QuotesPage = () => {
  const [quotes, setQuotes] = useState([]);
  const [formData, setFormData] = useState({
    reception: '',
    date: '',
    client: '',
    unit: '',
    document: '',
    status: 'pending',
  });
  const [editingQuote, setEditingQuote] = useState(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const quotesData = await getQuotes();
        setQuotes(quotesData);
      } catch (error) {
        console.error('Error al obtener las cotizaciones:', error);
      }
    };
    fetchQuotes();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingQuote) {
        const updatedQuote = await updateQuote(editingQuote._id, formData);
        setQuotes(quotes.map((quote) => (quote._id === updatedQuote._id ? updatedQuote : quote)));
        setEditingQuote(null);
      } else {
        const newQuote = await createQuote(formData);
        setQuotes([...quotes, newQuote]);
      }
      setFormData({ reception: '', date: '', client: '', unit: '', document: '', status: 'pending' });
    } catch (error) {
      console.error('Error al crear/editar la cotización:', error);
    }
  };

  const handleEdit = (quote) => {
    setEditingQuote(quote);
    setFormData({ ...quote });
  };

  const handleDelete = async (id) => {
    try {
      await deleteQuote(id);
      setQuotes(quotes.filter((quote) => quote._id !== id));
    } catch (error) {
      console.error('Error al eliminar la cotización:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-100 text-emerald-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-amber-100 text-amber-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {editingQuote ? 'Editar Cotización' : 'Nueva Cotización'}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {['reception', 'date', 'client', 'unit', 'document'].map((field) => (
              <div key={field} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {field}:
                </label>
                <input
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  type={field === 'date' ? 'date' : 'text'}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  placeholder={`Ingrese ${field}`}
                />
              </div>
            ))}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Estado:
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              >
                <option value="pending">Pendiente</option>
                <option value="approved">Aprobado</option>
                <option value="archived">Archivado</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 transition-colors"
            >
              {editingQuote ? 'Guardar Cambios' : 'Crear Cotización'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Lista de Cotizaciones</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quotes.map((quote) => (
            <div
              key={quote._id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{quote.client}</h3>
                    <p className="text-sm text-gray-500">{new Date(quote.date).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                    {quote.status === 'pending' ? 'Pendiente' : 
                     quote.status === 'approved' ? 'Aprobado' : 'Archivado'}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Unidad:</span> {quote.unit}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Documento:</span> {quote.document}
                  </p>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(quote)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(quote._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuotesPage;