import React, { useState, useEffect } from 'react';

interface Quote {
  id: string;
  reception: string;
  date: string;
  client: string;
  unit: string;
  document: string;
  status: 'pending' | 'approved' | 'archived';
}

interface QuoteModalProps {
  quote: Quote | null;
  onClose: () => void;
  onSave: (quote: Quote) => void;
}

const QuoteModal: React.FC<QuoteModalProps> = ({ quote, onClose, onSave }) => {
  const [formData, setFormData] = useState<Quote>({
    id: '',
    reception: '',
    date: '',
    client: '',
    unit: '',
    document: '',
    status: 'pending',
  });

  useEffect(() => {
    if (quote) {
      setFormData(quote);
    }
  }, [quote]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id) {
      // Si hay id, actualizar cotización
      await fetch(`http://localhost:5000/quotes/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } else {
      // Crear nueva cotización
      await fetch('http://localhost:5000/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    }
    onSave(formData);
  };

  return (
    <div>
      <div>
        <h2>{quote ? 'Editar Cotización' : 'Nueva Cotización'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="reception"
            value={formData.reception}
            onChange={handleInputChange}
            placeholder="Recepción"
          />
          <input
            type="text"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            placeholder="Fecha"
          />
          <input
            type="text"
            name="client"
            value={formData.client}
            onChange={handleInputChange}
            placeholder="Cliente"
          />
          <input
            type="text"
            name="unit"
            value={formData.unit}
            onChange={handleInputChange}
            placeholder="Unidad"
          />
          <input
            type="text"
            name="document"
            value={formData.document}
            onChange={handleInputChange}
            placeholder="Documento"
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="pending">Pendiente</option>
            <option value="approved">Aprobada</option>
            <option value="archived">Archivada</option>
          </select>
          <button type="submit">Guardar</button>
        </form>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default QuoteModal;
