import React from 'react';

interface Quote {
  id: string;
  reception: string;
  date: string;
  client: string;
  unit: string;
  document: string;
  status: 'pending' | 'approved' | 'archived';
}

interface QuotesTableProps {
  quotes: Quote[];
  onEdit: (quote: Quote) => void;
  onDelete: (id: string) => void;
}

const QuotesTable: React.FC<QuotesTableProps> = ({
  quotes,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
              Recepción
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
              Fecha
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
              Cliente
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
              Unidad
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
              Documento
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
              Estatus
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((quote) => (
            <tr key={quote.id} className="border-b">
              <td className="px-4 py-2 text-sm text-gray-800">
                {quote.reception}
              </td>
              <td className="px-4 py-2 text-sm text-gray-800">{quote.date}</td>
              <td className="px-4 py-2 text-sm text-gray-800">
                {quote.client}
              </td>
              <td className="px-4 py-2 text-sm text-gray-800">{quote.unit}</td>
              <td className="px-4 py-2 text-sm text-gray-800">
                {quote.document}
              </td>
              <td className="px-4 py-2 text-sm text-gray-800">
                {quote.status}
              </td>
              <td className="px-4 py-2 text-sm text-gray-800">
                <button
                  onClick={() => onEdit(quote)}
                  className="text-blue-600 hover:text-blue-800 mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(quote.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuotesTable;
