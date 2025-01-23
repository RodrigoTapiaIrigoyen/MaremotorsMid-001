import React, { useState } from 'react';
import { createQuote } from '../services/quotes.service';

const QuoteForm = () => {
  const [reception, setReception] = useState('');
  const [date, setDate] = useState('');
  const [client, setClient] = useState('');
  const [unit, setUnit] = useState('');
  const [document, setDocument] = useState('');
  const [status, setStatus] = useState<'pending' | 'approved' | 'archived'>(
    'pending'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const quote = await createQuote({
        reception,
        date,
        client,
        unit,
        document,
        status,
      });
      console.log('Cotización creada:', quote);
    } catch (error) {
      console.error('Error al crear la cotización:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block">Recepción:</label>
        <input
          value={reception}
          onChange={(e) => setReception(e.target.value)}
          type="text"
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>

      <div>
        <label className="block">Fecha:</label>
        <input
          value={date}
          onChange={(e) => setDate(e.target.value)}
          type="date"
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>

      <div>
        <label className="block">Cliente:</label>
        <input
          value={client}
          onChange={(e) => setClient(e.target.value)}
          type="text"
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>

      <div>
        <label className="block">Unidad:</label>
        <input
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          type="text"
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>

      <div>
        <label className="block">Documento:</label>
        <input
          value={document}
          onChange={(e) => setDocument(e.target.value)}
          type="text"
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>

      <div>
        <label className="block">Estatus:</label>
        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as 'pending' | 'approved' | 'archived')
          }
          className="w-full border border-gray-300 p-2 rounded"
        >
          <option value="pending">Pendiente</option>
          <option value="approved">Aprobado</option>
          <option value="archived">Archivado</option>
        </select>
      </div>

      <button
        type="submit"
        className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Guardar Cotización
      </button>
    </form>
  );
};

export default QuoteForm;
