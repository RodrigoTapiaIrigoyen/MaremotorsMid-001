import React, { useState } from 'react';

interface QuoteFormProps {
  onSave: (quote: Quote) => void;
  onClose: () => void;
  quote?: Quote;
}

interface Quote {
  id?: string;
  reception: string;
  date: string;
  client: string;
  unit: string;
  document: string;
  status: 'pending' | 'approved' | 'archived';
}

const NewQuoteForm: React.FC<QuoteFormProps> = ({ onSave, onClose, quote }) => {
  // Estado para manejar los campos del formulario
  const [reception, setReception] = useState(quote?.reception || '');
  const [date, setDate] = useState(quote?.date || '');
  const [client, setClient] = useState(quote?.client || '');
  const [unit, setUnit] = useState(quote?.unit || '');
  const [document, setDocument] = useState(quote?.document || '');
  const [status, setStatus] = useState(quote?.status || 'pending');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newQuote = { reception, date, client, unit, document, status };
    onSave(newQuote); // Llamar a la función onSave para guardar la cotización
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Recepción</label>
          <input
            type="text"
            value={reception}
            onChange={(e) => setReception(e.target.value)}
            placeholder="Ingrese recepción"
            className="input"
          />
        </div>

        <div>
          <label>Fecha</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input"
          />
        </div>

        <div>
          <label>Cliente</label>
          <input
            type="text"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            placeholder="Ingrese cliente"
            className="input"
          />
        </div>

        <div>
          <label>Unidad</label>
          <input
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="Ingrese unidad"
            className="input"
          />
        </div>

        <div>
          <label>Documento</label>
          <input
            type="text"
            value={document}
            onChange={(e) => setDocument(e.target.value)}
            placeholder="Ingrese documento"
            className="input"
          />
        </div>

        <div>
          <label>Estatus</label>
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as 'pending' | 'approved' | 'archived')
            }
            className="input"
          >
            <option value="pending">Pendiente</option>
            <option value="approved">Aprobado</option>
            <option value="archived">Archivado</option>
          </select>
        </div>

        <div className="flex justify-between">
          <button type="button" onClick={onClose} className="btn-cancel">
            Cancelar
          </button>
          <button type="submit" className="btn-save">
            Guardar Cotización
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewQuoteForm;
