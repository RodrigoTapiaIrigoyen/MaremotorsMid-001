import React, { useState } from 'react';

import {
  BarChart3,
  Download,
  FileSpreadsheet,
  Filter,
  Calendar,
  ClipboardList,
  DollarSign,
  FileText,
  FileText as FilePdf, // Cambia aquí para usar FileText como sustituto
} from 'lucide-react';

interface ReportFilter {
  startDate: string;
  endDate: string;
  type: 'inventory' | 'quotes' | 'receptions' | 'sales';
  status?: string;
  category?: string;
}

export default function Reports() {
  const [filters, setFilters] = useState<ReportFilter>({
    startDate: '',
    endDate: '',
    type: 'inventory',
  });

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateReport = (format: 'pdf' | 'excel') => {
    // Implementation for report generation
    console.log(`Generating ${format} report with filters:`, filters);
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Reportes
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Generación de reportes detallados del sistema
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Filtros del Reporte
          </h3>
          <div className="mt-6 grid grid-cols-1 gap- y-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha Inicial
              </label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha Final
              </label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo de Reporte
              </label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="inventory">Inventario</option>
                <option value="quotes">Cotizaciones</option>
                <option value="receptions">Recepciones</option>
                <option value="sales">Ventas</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Estado
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Todos</option>
                <option value="active">Activo</option>
                <option value="archived">Archivado</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Inventory Report */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Reporte de Inventario
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    Stock actual y movimientos
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleGenerateReport('pdf')}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FilePdf className="h-4 w-4 mr-2" />
                PDF
              </button>
              <button
                onClick={() => handleGenerateReport('excel')}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel
              </button>
            </div>
          </div>
        </div>

        {/* Quotes Report */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Reporte de Cotizaciones
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    Historial de cotizaciones
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleGenerateReport('pdf')}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FilePdf className="h-4 w-4 mr-2" />
                PDF
              </button>
              <button
                onClick={() => handleGenerateReport('excel')}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel
              </button>
            </div>
          </div>
        </div>

        {/* Receptions Report */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClipboardList className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Reporte de Recepciones
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    Historial de recepciones
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleGenerateReport('pdf')}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FilePdf className="h-4 w-4 mr-2" />
                PDF
              </button>
              <button
                onClick={() => handleGenerateReport('excel')}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel
              </button>
            </div>
          </div>
        </div>

        {/* Sales Report */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Reporte de Ventas
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    Historial de ventas
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleGenerateReport('pdf')}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FilePdf className="h-4 w-4 mr-2" />
                PDF
              </button>
              <button
                onClick={() => handleGenerateReport('excel')}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}