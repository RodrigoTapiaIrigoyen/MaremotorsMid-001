import React, { useState } from 'react';
import { Search, Plus, Archive, Edit, Trash, FileText, Printer } from 'lucide-react';

interface SaleItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Sale {
  id: string;
  userId: string;
  employeeName: string;
  clientName: string;
  date: string;
  documentType: 'fiscal' | 'no-fiscal';
  status: 'pending' | 'completed' | 'archived';
  total: number;
  items: SaleItem[];
}

export default function Sales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentSale, setCurrentSale] = useState<Sale>({
    id: '',
    userId: '',
    employeeName: '',
    clientName: '',
    date: new Date().toISOString().split('T')[0],
    documentType: 'no-fiscal',
    status: 'pending',
    total: 0,
    items: [],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCurrentSale((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentSale.id) {
      setSales((prev) =>
        prev.map((s) => (s.id === currentSale.id ? currentSale : s))
      );
    } else {
      setSales((prev) => [
        ...prev,
        { ...currentSale, id: Date.now().toString() },
      ]);
    }
    closeModal();
  };

  const handleEdit = (sale: Sale) => {
    setCurrentSale(sale);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setSales((prev) => prev.filter((s) => s.id !== id));
  };

  const handleArchive = (id: string) => {
    setSales((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: 'archived' as const } : s
      )
    );
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentSale({
      id: '',
      userId: '',
      employeeName: '',
      clientName: '',
      date: new Date().toISOString().split('T')[0],
      documentType: 'no-fiscal',
      status: 'pending',
      total: 0,
      items: [],
    });
  };

  const handlePrint = (sale: Sale) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Comprobante de Venta - ${sale.clientName}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #0284c7; padding-bottom: 20px; }
              .logo { margin-bottom: 10px; }
              .company-info { margin-bottom: 20px; }
              .sale-details { margin-bottom: 30px; }
              .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              .items-table th { background-color: #f8fafc; }
              .total { text-align: right; margin-top: 20px; font-weight: bold; }
              .footer { margin-top: 40px; text-align: center; font-size: 0.9em; color: #64748b; }
              @media print {
                button { display: none; }
                body { padding: 0; }
                .header { border-bottom-color: #000; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">
                <h1>Maremotors Waverunners</h1>
              </div>
              <div class="company-info">
                <p>Servicio Especializado en Motos Acuáticas</p>
                <p>Tel: (123) 456-7890</p>
              </div>
            </div>
            
            <div class="sale-details">
              <h2>Comprobante de Venta</h2>
              <p><strong>Cliente:</strong> ${sale.clientName}</p>
              <p><strong>Empleado:</strong> ${sale.employeeName}</p>
              <p><strong>Fecha:</strong> ${sale.date}</p>
              <p><strong>Tipo de Documento:</strong> ${sale.documentType}</p>
            </div>

            <table class="items-table">
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${sale.items.map((item) => `
                  <tr>
                    <td>${item.description}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.unitPrice.toFixed(2)}</td>
                    <td>$${item.total.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="total">
              <p>Total: $${sale.total.toFixed(2)}</p>
            </div>

            <div class="footer">
              <p>Atendido por: ${sale.employeeName}</p>
              <p>Gracias por su compra</p>
              <p>Maremotors Waverunners</p>
            </div>

            <button onclick="window.print()">Imprimir</button>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  // Filter sales based on search term
  const filteredSales = sales.filter((sale) =>
    sale.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Ventas
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Venta
        </button>
      </div>

      {/* Search */}
      <div className="flex justify-between items-center">
        <div className="max-w-lg w-full lg:max-w-xs">
          <div className="relative">
            <Search className="absolute inset-y-0 left-0 h-5 w-5 text-gray-400 pl-3" />
            <input
              type="search"
              placeholder="Buscar por cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-1.5 rounded-md border ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Cliente</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Empleado</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Fecha</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Documento</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Estatus</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total</th>
              <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredSales.map((sale) => (
              <tr key={sale.id}>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{sale.clientName}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{sale.employeeName}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{sale.date}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{sale.documentType}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      sale.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : sale.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {sale.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  ${sale.total.toFixed(2)}
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(sale)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(sale.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Eliminar"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleArchive(sale.id)}
                      className="text-gray-600 hover:text-gray-900"
                      title="Archivar"
                    >
                      <Archive className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handlePrint(sale)}
                      className="text-gray-600 hover:text-gray-900"
                      title="Imprimir comprobante"
                    >
                      <Printer className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cliente
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    value={currentSale.clientName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Empleado
                  </label>
                  <input
                    type="text"
                    name="employeeName"
                    value={currentSale.employeeName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Fecha
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={currentSale.date}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tipo de Documento
                  </label>
                  <select
                    name="documentType"
                    value={currentSale.documentType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  >
                    <option value="fiscal">Fiscal</option>
                    <option value="no-fiscal">No Fiscal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Estatus
                  </label>
                  <select
                    name="status"
                    value={currentSale.status}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  >
                    <option value="pending">Pendiente</option>
                    <option value="completed">Completado</option>
                    <option value="archived">Archivado</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md border px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}