import React, { useState, useEffect } from 'react';
import { FileText, ShoppingCart, ClipboardList, FileDown, Printer, Calendar } from 'lucide-react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Define status types for better type safety
type StatusType = 'aprobada' | 'pendiente';
type StatusFilterType = 'all' | StatusType;

interface Product {
  product: string;
  quantity: number;
}

interface Item {
  productId?: string;
  serviceId?: string;
  quantity: number;
}

interface Report {
  _id: string;
  client: any;
  date: string;
  status?: string;
  total?: number;
  products?: Product[];
  items?: Item[];
  accessories?: Record<string, boolean>;
  aesthetics?: Record<string, boolean>;
  user?: string;
  documentType?: string;
  reception?: string;
}

const statusMap: { [key: string]: string } = {
  'aprobada': 'approved',
  'pendiente': 'pending',
  'approved': 'aprobada',
  'pending': 'pendiente'
};

const Reports: React.FC = () => {
  const [salesReports, setSalesReports] = useState<Report[]>([]);
  const [quotationReports, setQuotationReports] = useState<Report[]>([]);
  const [receptionReports, setReceptionReports] = useState<Report[]>([]);
  const [products, setProducts] = useState<{ [key: string]: any }>({});
  const [services, setServices] = useState<{ [key: string]: any }>({});
  const [clients, setClients] = useState<{ [key: string]: any }>({});
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'sales' | 'quotes' | 'receptions'>('sales');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [includeIVA, setIncludeIVA] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const [salesResponse, quotationsResponse, receptionsResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/reports/sales'),
        axios.get('http://localhost:5000/api/reports/quotes'),
        axios.get('http://localhost:5000/api/reports/receptions')
      ]);

      setSalesReports(salesResponse.data);
      setQuotationReports(quotationsResponse.data);
      setReceptionReports(receptionsResponse.data);

      const clientIds = new Set([
        ...salesResponse.data.map((report: Report) => report.client._id || report.client),
        ...quotationsResponse.data.map((report: Report) => report.client._id || report.client),
      ]);

      const productIds = new Set([
        ...salesResponse.data.flatMap((report: Report) => report.products?.map(product => product.product) || []),
        ...quotationsResponse.data.flatMap((report: Report) => report.items?.map(item => item.productId) || []),
      ]);

      const serviceIds = new Set([
        ...quotationsResponse.data.flatMap((report: Report) => report.items?.map(item => item.serviceId) || [])
      ]);

      const clientData: { [key: string]: any } = {};
      await Promise.all(
        Array.from(clientIds).map(async (clientId) => {
          if (clientId) {
            try {
              const clientResponse = await axios.get(`http://localhost:5000/api/clients/${clientId}`);
              clientData[clientId] = clientResponse.data;
            } catch (error) {
              console.error(`Error fetching client with ID ${clientId}:`, error);
            }
          }
        })
      );

      const productData: { [key: string]: any } = {};
      await Promise.all(
        Array.from(productIds).map(async (productId) => {
          if (productId) {
            try {
              const productResponse = await axios.get(`http://localhost:5000/api/products/${productId}`);
              productData[productId] = productResponse.data;
            } catch (error) {
              if (axios.isAxiosError(error) && error.response?.status === 404) {
                console.error(`Product with ID ${productId} not found.`);
              } else {
                console.error(`Error fetching product with ID ${productId}:`, error);
              }
            }
          }
        })
      );

      const serviceData: { [key: string]: any } = {};
      await Promise.all(
        Array.from(serviceIds).map(async (serviceId) => {
          if (serviceId) {
            try {
              const serviceResponse = await axios.get(`http://localhost:5000/api/services/${serviceId}`);
              serviceData[serviceId] = serviceResponse.data;
            } catch (error) {
              if (axios.isAxiosError(error) && error.response?.status === 404) {
                console.error(`Service with ID ${serviceId} not found.`);
              } else {
                console.error(`Error fetching service with ID ${serviceId}:`, error);
              }
            }
          }
        })
      );

      setClients(clientData);
      setProducts(productData);
      setServices(serviceData);

    } catch (error) {
      console.error("Error loading reports", error);
      setError("Error al cargar los reportes. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const getItemName = (itemId: string) => {
    return products[itemId]?.name || services[itemId]?.name || 'Sin descripción';
  };

  const handlePrintPDF = (type: string, report: Report) => {
    const doc = new jsPDF();
    const title = `Reporte Individual - ${clients[report.client]?.name || 'Cliente'}`;
    doc.addImage('src/logo/Maremotors.png', 'PNG', 10, 10, 20, 20);
    
    // Header
    doc.setFontSize(20);
    doc.text(title, 105, 20, { align: "center" });
    
    // Company Info
    doc.setFontSize(12);
    doc.text("Maremotors YAMAHA", 105, 30, { align: "center" });
    doc.setFontSize(10);
    doc.text("Carretera Merida Progreso Kilómetro 24", 105, 35, { align: "center" });
    doc.text("San Ignacio, Yucatan", 105, 40, { align: "center" });
    doc.text("Tel: 9992383587 / 9997389040", 105, 45, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date(report.date).toLocaleDateString()}`, 20, 60);

    const tableData = [];
    if (type === 'sales') {
      tableData.push(
        ['Cliente', report.client?.name || 'N/A'],
        ['Fecha', new Date(report.date).toLocaleDateString()],
        ['Estado', report.status || 'N/A'],
        ['Total', formatCurrency(report.total || 0)],
        ['Productos', report.products?.map((p) => `${getItemName(p.product)} (${p.quantity})`).join(', ') || '']
      );
    } else if (type === 'quotes') {
      tableData.push(
        ['Cliente', clients[report.client]?.name || 'N/A'],
        ['Fecha', new Date(report.date).toLocaleDateString()],
        ['Estado', report.status || 'N/A'],
        ['Usuario', report.user || 'N/A'],
        ['Tipo de Documento', report.documentType || 'N/A'],
        ['Recepción', report.reception || 'N/A'],
        ['Descripción', report.items?.map((i) => `${getItemName(i.productId || i.serviceId || '')} (${i.quantity})`).join(', ') || ''],
        ['Total', formatCurrency(report.total || 0)]
      );
    } else {
      tableData.push(
        ['Cliente', report.client?.name || 'N/A'],
        ['Fecha', new Date(report.date).toLocaleDateString()],
        ['Accesorios', Object.entries(report.accessories || {})
          .filter(([_, value]) => value)
          .map(([key]) => key)
          .join(', ')],
        ['Estética', Object.entries(report.aesthetics || {})
          .filter(([_, value]) => value)
          .map(([key]) => key)
          .join(', ')]
      );
    }

    doc.autoTable({
      body: tableData,
      startY: 70,
      theme: 'grid',
      styles: { fontSize: 10, textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.5 },
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], lineColor: [0, 0, 0], lineWidth: 0.5 }
    });

    // Totals
    const totalAmountWithoutIVA = report.total || 0;
    const ivaAmount = includeIVA ? totalAmountWithoutIVA * 0.16 : 0;
    const totalAmountWithIVA = includeIVA ? totalAmountWithoutIVA + ivaAmount : totalAmountWithoutIVA;

    const totalsData = [
      ["Subtotal:", totalAmountWithoutIVA.toFixed(2)],
      ["IVA (16%):", ivaAmount.toFixed(2)],
      ["Total Final:", totalAmountWithIVA.toFixed(2)]
    ];

    doc.autoTable({
      body: totalsData,
      startY: doc.lastAutoTable.finalY + 10,
      theme: 'grid',
      styles: { fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.5 }
    });

    // Footer
    doc.setFontSize(8);
    doc.text("EXISTEN ACCESORIOS Y PARTES DE LOS VEHICULOS QUE PUEDEN TENER VICIOS OCULTOS,", 105, doc.lastAutoTable.finalY + 20, { align: "center" });
    doc.text("NO NOS HACEMOS REPONSABLES QUE ESTANDO EN RESGUARDO O EN EL TRANSCURSO", 105, doc.lastAutoTable.finalY + 25, { align: "center" });
    doc.text("QUE SE RECOJAN SE DAÑEN.", 105, doc.lastAutoTable.finalY + 30, { align: "center" });

    doc.save(`reporte-individual-${type}-${report._id}.pdf`);
  };

  const handlePrintPDFWithIVA = (type: string, report: Report) => {
    const includeIVA = window.confirm("¿Desea incluir el 16% de IVA en el PDF?");
    setIncludeIVA(includeIVA);
    handlePrintPDF(type, report);
  };

  const handleMonthlyReportDownload = () => {
    const doc = new jsPDF();
    const [year, month] = selectedMonth.split('-');
    const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleString('es-ES', { month: 'long' });
    
    // Title
    doc.setFontSize(20);
    doc.text(`Reporte Mensual - ${monthName} ${year}`, 105, 20, { align: "center" });

    // Company Info
    doc.setFontSize(12);
    doc.text("Maremotors YAMAHA", 105, 30, { align: "center" });
    doc.setFontSize(10);
    doc.text("Carretera Merida Progreso Kilómetro 24", 105, 35, { align: "center" });
    doc.text("San Ignacio, Yucatan", 105, 40, { align: "center" });
    doc.text("Tel: 9992383587 / 9997389040", 105, 45, { align: "center" });

    // Filter reports for selected month
    const filterReportsByMonth = (reports: Report[]) => {
      return reports.filter(report => {
        const reportDate = new Date(report.date);
        return reportDate.getFullYear() === parseInt(year) && 
               reportDate.getMonth() === parseInt(month) - 1;
      });
    };

    const monthlyQuotes = filterReportsByMonth(quotationReports);
    const monthlySales = filterReportsByMonth(salesReports);
    const monthlyReceptions = filterReportsByMonth(receptionReports);

    // Sales Summary
    const salesData = monthlySales.map(sale => [
      new Date(sale.date).toLocaleDateString(),
      sale.client?.name || clients[sale.client]?.name || 'N/A',
      formatCurrency(sale.total || 0),
      sale.status || 'N/A'
    ]);

    if (salesData.length > 0) {
      doc.setFontSize(14);
      doc.text("Resumen de Ventas", 20, 60);
      doc.autoTable({
        head: [['Fecha', 'Cliente', 'Total', 'Estado']],
        body: salesData,
        startY: 65,
        theme: 'grid'
      });
    }

    // Quotes Summary
    const quotesData = monthlyQuotes.map(quote => [
      new Date(quote.date).toLocaleDateString(),
      clients[quote.client]?.name || 'N/A',
      formatCurrency(quote.total || 0),
      quote.status || 'N/A'
    ]);

    if (quotesData.length > 0) {
      doc.setFontSize(14);
      doc.text("Resumen de Cotizaciones", 20, doc.lastAutoTable?.finalY + 20 || 120);
      doc.autoTable({
        head: [['Fecha', 'Cliente', 'Total', 'Estado']],
        body: quotesData,
        startY: doc.lastAutoTable?.finalY + 25 || 125,
        theme: 'grid'
      });
    }

    // Monthly Totals
    const totalSales = monthlySales.reduce((sum, sale) => sum + (sale.total || 0), 0);
    const totalQuotes = monthlyQuotes.reduce((sum, quote) => sum + (quote.total || 0), 0);

    const summaryData = [
      ['Total de Ventas', formatCurrency(totalSales)],
      ['Total de Cotizaciones', formatCurrency(totalQuotes)],
      ['Número de Recepciones', monthlyReceptions.length.toString()]
    ];

    doc.autoTable({
      body: summaryData,
      startY: doc.lastAutoTable?.finalY + 20 || 180,
      theme: 'grid',
      styles: { fontStyle: 'bold' }
    });

    doc.save(`reporte-mensual-${monthName}-${year}.pdf`);
  };

  const filteredReports = (reports: Report[]) => {
    return reports.filter(report => {
      const clientName = report.client?.name || clients[report.client]?.name || '';
      let productNames = '';
      
      if (report.products) {
        productNames = report.products.map(p => getItemName(p.product)).join(' ');
      } else if (report.items) {
        productNames = report.items.map(i => getItemName(i.productId || i.serviceId || '')).join(' ');
      }
  
      // Search term matching
      const searchMatch = 
        clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        productNames.toLowerCase().includes(searchTerm.toLowerCase());
  
      // If status filter is 'all', only apply search filter
      if (statusFilter === 'all') {
        return searchMatch;
      }
  
      // Get the report status, defaulting to empty string if undefined
      const reportStatus = (report.status || '').toLowerCase().trim();
  
      // Map the status filter to the corresponding value in the other language
      const mappedStatusFilter = statusMap[statusFilter.toLowerCase()] || statusFilter.toLowerCase();
  
      // Debug log to check status values
      console.log(`Report ID: ${report._id}, Status: ${reportStatus}, Filter: ${mappedStatusFilter}`);
  
      // Return true if both search and status match
      return searchMatch && (reportStatus === statusFilter.toLowerCase() || reportStatus === mappedStatusFilter);
    });
  };

  const TabButton: React.FC<{
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
  }> = ({ active, onClick, icon, label }) => (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
        active
          ? 'bg-blue-500 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );

  const ReportCard: React.FC<{
    report: Report;
    type: 'sales' | 'quotes' | 'receptions';
  }> = ({ report, type }) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            {type === 'quotes' ? clients[report.client]?.name || 'Cliente no especificado' : report.client?.name || 'Cliente no especificado'}
          </h3>
          <p className="text-gray-600">
            {new Date(report.date).toLocaleDateString()}
          </p>
          {type !== 'receptions' && report.status && (
            <p className={`text-sm font-medium ${
              report.status.toLowerCase().trim() === 'aprobada' ? 'text-green-600' : 'text-yellow-600'
            }`}>
              Estado: {report.status}
            </p>
          )}
        </div>
        <button
          onClick={() => handlePrintPDFWithIVA(type, report)}
          className="flex items-center px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          <Printer size={18} />
          <span className="ml-2">Imprimir</span>
        </button>
      </div>

      {type === 'sales' && report.products && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Productos:</h4>
          <ul className="list-disc list-inside space-y-1">
            {report.products.map((product, index) => (
              <li key={index} className="text-gray-600">
                {getItemName(product.product)} - Cantidad: {product.quantity}
              </li>
            ))}
          </ul>
          <p className="text-right font-semibold text-gray-800">
            Total: {formatCurrency(report.total || 0)}
          </p>
        </div>
      )}

      {type === 'quotes' && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Detalles de la Cotización:</h4>
          <div className="mb-2 text-sm text-gray-600">
            <p>Usuario: {report.user || 'N/A'}</p>
            <p>Tipo de Documento: {report.documentType || 'N/A'}</p>
            {report.reception && <p>Recepción: {report.reception}</p>}
          </div>
          {report.items && (
            <ul className="list-disc list-inside space-y-1">
              {report.items.map((item, index) => (
                <li key={index} className="text-gray-600">
                  {getItemName(item.productId || item.serviceId || '')} - Cantidad: {item.quantity}
                </li>
              ))}
            </ul>
          )}
          <p className="text-right font-semibold text-gray-800">
            Total: {formatCurrency(report.total || 0)}
          </p>
        </div>
      )}

      {type === 'receptions' && (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Accesorios:</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(report.accessories || {})
                .filter(([_, value]) => value)
                .map(([key]) => (
                  <span key={key} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {key}
                  </span>
                ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Estética:</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(report.aesthetics || {})
                .filter(([_, value]) => value)
                .map(([key]) => (
                  <span key={key} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {key}
                  </span>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const StatusFilter: React.FC = () => (
    <div className="mb-6 flex items-center">
      <label htmlFor="statusFilter" className="mr-4 text-gray-700">Filtrar por estado:</label>
      <select
        id="statusFilter"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value as StatusFilterType)}
        className="px-4 py-2 border rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="all">Todos</option>
        <option value="aprobada">Aprobados</option>
        <option value="pendiente">Pendientes</option>
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Reportes</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleMonthlyReportDownload}
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Calendar className="w-5 h-5 mr-2" />
                <span>Reporte Mensual</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="flex space-x-4 mb-6">
          <TabButton
            active={activeTab === 'sales'}
            onClick={() => setActiveTab('sales')}
            icon={<ShoppingCart size={20} />}
            label="Ventas"
          />
          <TabButton
            active={activeTab === 'quotes'}
            onClick={() => setActiveTab('quotes')}
            icon={<FileText size={20} />}
            label="Cotizaciones"
          />
          <TabButton
            active={activeTab === 'receptions'}
            onClick={() => setActiveTab('receptions')}
            icon={<ClipboardList size={20} />}
            label="Recepciones"
          />
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por cliente o productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {(activeTab === 'sales' || activeTab === 'quotes') && <StatusFilter />}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab === 'sales' && filteredReports(salesReports).map(report => (
              <ReportCard key={report._id} report={report} type="sales" />
            ))}
            {activeTab === 'quotes' && filteredReports(quotationReports).map(report => (
              <ReportCard key={report._id} report={report} type="quotes" />
            ))}
            {activeTab === 'receptions' && filteredReports(receptionReports).map(report => (
              <ReportCard key={report._id} report={report} type="receptions" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;