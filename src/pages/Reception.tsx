import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FileText, Printer, Trash2, Edit, Plus, ChevronRight, Car, PenTool as Tool, Package, ClipboardCheck, AlertTriangle, Settings, Truck, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import logoBase64 from '../logo/MaremotorsBase64';

const initialFormData = {
  reception: '',
  date: '',
  client: '',
  phone: '',
  model: '',
  type: '',
  brand: '',
  color: '',
  plates: '',
  accessories: {
    cabo: false,
    ancla: false,
    llaves: false,
    cover: false,
    chalecos: false,
    boyas: false,
    sinchos: false,
    gabeta: false,
    ventana: false,
    manguera: false,
    control: false,
    tapones: false,
  },
  aesthetics: {
    tablero: false,
    prende: false,
    manchado: false,
    agrietado: false,
    golpes: false,
    arranca: false,
    aceite: false,
    ibr: false,
    bateria: false,
  },
  issues: '',
  observations: '',
  trailer: {
    winch: false,
    pata: false,
    baleros: false,
    luces: false,
    gomas: false,
    us: false,
    tornilleria: false,
  },
  fuelTank: '',
  kilometers: '',
};

const ReceptionForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [activeTab, setActiveTab] = useState('reception');
  const [receptions, setReceptions] = useState([]);
  const [clients, setClients] = useState([]);
  const [units, setUnits] = useState([]);
  const [editingReception, setEditingReception] = useState(null);
  const [selectedReceptions, setSelectedReceptions] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [types, setTypes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [receptionsResponse, clientsResponse, unitsResponse] = await Promise.all([
          api.get('/receptions'),
          api.get('/clients'),
          api.get('/units'),
        ]);

        console.log('Recepciones cargadas:', receptionsResponse.data); // Verificar los datos
        setReceptions(receptionsResponse.data);
        setClients(clientsResponse.data);
        setUnits(unitsResponse.data);
      } catch (error) {
        setErrorMessage('Error cargando los datos. Por favor, intente nuevamente.');
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await api.get('/catalog/types');
        setTypes(response.data);
      } catch (error) {
        console.error('Error al cargar los tipos:', error);
      }
    };

    fetchTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const [section, key] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: { ...prev[section], [key]: checked }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submissionData = {
        ...formData,
        model: formData.model
      };

      if (editingReception) {
        await api.put(`/receptions/${editingReception._id}`, submissionData);
        setSuccessMessage('Recepción actualizada con éxito');
      } else {
        await api.post('/receptions', submissionData);
        setSuccessMessage('Recepción registrada con éxito');
      }
      
      setFormData(initialFormData);
      setEditingReception(null);
      const response = await api.get('/receptions');
      setReceptions(response.data);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage('Error al procesar la recepción. Por favor, intente nuevamente.');
      console.error('Error registrando la recepción:', error.message);
    }
  };

  const handleEdit = (reception) => {
    const editData = {
      ...reception,
      client: reception.client ? (reception.client._id || reception.client) : '', // Asegúrate de asignar solo el ID del cliente
      model: reception.model ? (reception.model._id || reception.model) : '', // Asegúrate de asignar solo el ID del modelo
    };

    setFormData(editData);
    setEditingReception(reception);
    setActiveTab('reception');
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/receptions/${id}`);
      setSuccessMessage('Recepción eliminada con éxito');
      const response = await api.get('/receptions');
      setReceptions(response.data);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage('Error al eliminar la recepción. Por favor, intente nuevamente.');
      console.error('Error eliminando la recepción:', error.message);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedReceptions.map(id => api.delete(`/receptions/${id}`)));
      setSuccessMessage('Recepciones eliminadas con éxito');
      const response = await api.get('/receptions');
      setReceptions(response.data);
      setSelectedReceptions([]);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage('Error al eliminar las recepciones. Por favor, intente nuevamente.');
      console.error('Error eliminando las recepciones:', error.message);
    }
  };

  const handleSelectReception = (id) => {
    setSelectedReceptions(prev => 
      prev.includes(id) ? prev.filter(receptionId => receptionId !== id) : [...prev, id]
    );
  };

 
const handlePrintPDF = () => {
  const doc = new jsPDF();

  // Elimino la creación del objeto Image y uso directamente logoBase64
  doc.addImage(logoBase64, 'PNG', 10, 5, 20, 20);

  // Header section
  doc.addImage(logoBase64, 'PNG', 10, 5, 20, 20);
  
  // Título principal con color suavizado
  doc.setFontSize(14);
  doc.setTextColor(51, 51, 51);
  doc.text("Maremotors YAMAHA", 105, 8, { align: "center" });
  
  // Información de contacto con color suavizado
  doc.setFontSize(9);
  doc.setTextColor(68, 68, 68);
  doc.text("Carretera Merida Progreso Kilómetro Merida 24", 105, 12, { align: "center" });
  doc.text("San Ignacio, Yucatan • Tel: 9992383587 / 9997389040", 105, 16, { align: "center" });
  doc.text("Horario: Lunes a Viernes de 9AM - 5PM, Sábado de 9AM - 1:30PM", 105, 20, { align: "center" });

  // Espacio adicional antes del aviso legal
  doc.setFontSize(7);
  doc.setTextColor(85, 85, 85);
  doc.text("EXISTEN ACCESORIOS Y PARTES DE LOS VEHICULOS QUE PUEDEN TENER VICIOS OCULTOS, NO NOS HACEMOS", 105, 27, { align: "center" });
  doc.text("REPONSABLES QUE ESTANDO EN RESGUARDO O EN EL TRANSCURSO QUE SE RECOJAN SE DAÑEN.", 105, 30, { align: "center" });

  const selectedUnit = units.find(unit => unit._id === formData.model);
  const modelName = selectedUnit ? selectedUnit.model || selectedUnit.name : 'Desconocido';

  // Resolver nombre del cliente: formData.client puede ser ID (string) o objeto { _id, name }
  const clientName = formData.client && typeof formData.client === 'object'
    ? (formData.client.name || formData.client._id || '')
    : (clients.find(c => c._id === formData.client)?.name || formData.client || '');

  // Mapear fuelTank a etiqueta legible
  const fuelOptions = [
    { _id: '1/4', name: '1/4 de tanque' },
    { _id: '1/2', name: '1/2 de tanque' },
    { _id: '3/4', name: '3/4 de tanque' },
    { _id: 'full', name: 'Tanque Lleno' },
  ];
  const fuelTankLabel = fuelOptions.find(o => o._id === formData.fuelTank)?.name || formData.fuelTank || '';

  // Main information
  const mainInfo = [
    ["Recepción", formData.reception],
    ["Fecha", formData.date],
    ["Cliente", clientName],
    ["Teléfono", formData.phone],
    ["Modelo", modelName],
    ["Tipo", formData.type],
    ["Marca", formData.brand],
    ["Color", formData.color],
    ["Placas", formData.plates],
  ["Tanque de Gasolina", fuelTankLabel],
    ["Kilómetros", formData.kilometers]
  ];

  const accessories = Object.entries(formData.accessories)
    .map(([key, value]) => [key.toUpperCase(), value ? 'SI' : 'NO']);
  
  const aesthetics = Object.entries(formData.aesthetics)
    .map(([key, value]) => [key.toUpperCase(), value ? 'SI' : 'NO']);
  
  const trailer = Object.entries(formData.trailer)
    .map(([key, value]) => [key.toUpperCase(), value ? 'SI' : 'NO']);

  // Configuración de las tablas con colores suavizados
  const tableConfig = {
    theme: 'grid',
    styles: { 
      fontSize: 8,
      cellPadding: 2,
      lineColor: [128, 128, 128],
      lineWidth: 0.1,
      textColor: [68, 68, 68],
      font: 'helvetica',
      fontStyle: 'normal'
    },
    headStyles: {
      fillColor: [80, 80, 80],
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: {
      fillColor: [255, 255, 255]
    },
    alternateRowStyles: {
      fillColor: [248, 248, 248]
    }
  };

  // Espacio adicional antes de las tablas principales
  const mainTableStartY = 35;

  // First column: Main info
  doc.autoTable({
    ...tableConfig,
    startY: mainTableStartY,
    body: mainInfo,
    columnStyles: {
      0: { cellWidth: 30, fontStyle: 'bold' },
      1: { cellWidth: 30 }
    },
    margin: { left: 10 }
  });

  // Second column: Accessories
  doc.autoTable({
    ...tableConfig,
    startY: mainTableStartY,
    body: accessories,
    columnStyles: {
      0: { cellWidth: 30, fontStyle: 'bold' },
      1: { cellWidth: 15, halign: 'center' }
    },
    margin: { left: 75 }
  });

  // Third column: Aesthetics and Trailer
  doc.autoTable({
    ...tableConfig,
    startY: mainTableStartY,
    body: [...aesthetics, ...trailer],
    columnStyles: {
      0: { cellWidth: 30, fontStyle: 'bold' },
      1: { cellWidth: 15, halign: 'center' }
    },
    margin: { left: 125 }
  });

  // New table for Fallos and Observaciones below the three columns
  const issuesAndObservations = [
    ["Fallos / Problema", formData.issues],
    ["Observaciones", formData.observations]
  ];

  const maxY = Math.max(
    doc.lastAutoTable.finalY,
    doc.lastAutoTable.finalY,
    doc.lastAutoTable.finalY
  );

  const spacingAfterColumns = 15;

  // Issues and Observations table con estilo mejorado
  doc.autoTable({
    ...tableConfig,
    startY: maxY + spacingAfterColumns,
    body: issuesAndObservations,
    columnStyles: {
      0: { cellWidth: 30, fontStyle: 'bold' },
      1: { cellWidth: 160 }
    },
    margin: { left: 10 },
    styles: {
      ...tableConfig.styles,
      minCellHeight: 20,
      fontSize: 9
    }
  });

  // Signature section con colores suavizados
  const finalY = doc.lastAutoTable.finalY + 20;
  
  doc.setFontSize(9);
  doc.setTextColor(68, 68, 68);
  
  // Signature boxes con líneas más suaves
  doc.setLineWidth(0.3);
  doc.rect(20, finalY, 70, 20);
  doc.rect(110, finalY, 70, 20);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text("FIRMA DE CONFORMIDAD DE RECEPCION", 55, finalY + 25, { align: "center" });
  doc.text("FIRMA DE CONFORMIDAD DE ENTREGA", 145, finalY + 25, { align: "center" });

  // Usar clientName en el filename, limpiar espacios
  const safeClient = (clientName || 'cliente').toString().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\-]/g, '');
  doc.save(`recepcion_${safeClient}.pdf`);
};

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleGoToQuotes = (reception) => {
    const selectedData = {
      recepcion: reception.reception,
      cliente: reception.client?.name || 'Cliente no encontrado',
      usuario: reception.user || '', // Enviar el usuario ingresado manualmente
      mecanico: reception.mechanic?.name || 'Mecánico no asignado',
      fecha: reception.date,
    };
  
    navigate('/quotes', { state: selectedData });
  };

  const renderOptions = (data) => {
    return data.map(item => {
      const displayName = (item && (item.model || item.name)) || 'Sin nombre';
      const key = item && item._id ? item._id : Math.random().toString(36).slice(2);
      const value = item && item._id ? item._id : '';
      return (
        <option key={key} value={value}>
          {displayName}
        </option>
      );
    });
  };

  const filteredReceptions = receptions.filter((reception) => {
    const receptionClientId = reception && reception.client ? (reception.client._id || reception.client) : null;
    const client = receptionClientId ? clients.find((c) => c._id === receptionClientId) : null;
    const clientName = client ? client.name.toLowerCase() : '';
    return clientName.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen animate-gradient py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            {editingReception ? 'Editar Recepción' : 'Nueva Recepción'}
          </h2>
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-white/50 rounded-full">
            <span className="text-gray-600">Sistema de Recepciones</span>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <span className="font-semibold text-gray-800">Maremotors YAMAHA</span>
          </div>
        </div>

        {successMessage && (
          <div className="mb-8 transform hover-scale">
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-xl">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ClipboardCheck className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-800">{successMessage}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {errorMessage && (
          <div className="mb-8 transform hover-scale">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-xl">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{errorMessage}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-effect rounded-3xl p-8 shadow-soft mb-12">
          <div className="flex space-x-4 mb-8">
            <button
              type="button"
              onClick={() => setActiveTab('reception')}
              className={`flex items-center px-6 py-3 rounded-xl transition-all duration-300 ${
                activeTab === 'reception'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white/50 text-gray-600 hover:bg-white/80'
              }`}
            >
              <Car className="h-5 w-5 mr-2" />
              <span>Información General</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pdf')}
              className={`flex items-center px-6 py-3 rounded-xl transition-all duration-300 ${
                activeTab === 'pdf'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white/50 text-gray-600 hover:bg-white/80'
              }`}
            >
              <FileText className="h-5 w-5 mr-2" />
              <span>Detalles Adicionales</span>
            </button>
          </div>

          <div className="space-y-8">
            {activeTab === 'reception' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Input
                    label="Recepción"
                    name="reception"
                    value={formData.reception}
                    onChange={handleChange}
                    icon={FileText}
                  />
                  <Input
                    label="Fecha"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    icon={FileText}
                  />
                  <Select
                    label="Cliente"
                    name="client"
                    value={formData.client}
                    onChange={handleChange}
                    options={renderOptions(clients)}
                    icon={FileText}
                  />
                  <Input
                    label="Teléfono"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    icon={FileText}
                  />
                  <Select
                    label="Modelo"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    options={renderOptions(units)}
                    icon={Car}
                  />
                  <Select
                    label="Tipo"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    options={types.map((type) => (
                      <option key={type._id} value={type.name}>
                        {type.name}
                      </option>
                    ))}
                    icon={Tool}
                  />
                  <Input
                    label="Marca"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    icon={Package}
                  />
                  <Input
                    label="Color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    icon={FileText}
                  />
                  <Input
                    label="Placas"
                    name="plates"
                    value={formData.plates}
                    onChange={handleChange}
                    icon={FileText}
                  />
                  <Select
                    label="Tanque de Gasolina"
                    name="fuelTank"
                    value={formData.fuelTank}
                    onChange={handleChange}
                    options={[
                      { _id: '1/4', name: '1/4 de tanque' },
                      { _id: '1/2', name: '1/2 de tanque' },
                      { _id: '3/4', name: '3/4 de tanque' },
                      { _id: 'full', name: 'Tanque Lleno' }
                    ].map(option => (
                      <option key={option._id} value={option._id}>
                        {option.name}
                      </option>
                    ))}
                    icon={FileText}
                  />
                  <Input
                    label="Kilómetros"
                    name="kilometers"
                    value={formData.kilometers}
                    onChange={handleChange}
                    icon={FileText}
                  />
                </div>

                <Section
                  title="Accesorios"
                  name="accessories"
                  data={formData.accessories}
                  onChange={handleChange}
                  icon={Package}
                />

                <Section
                  title="Estética e Instrumentos"
                  name="aesthetics"
                  data={formData.aesthetics}
                  onChange={handleChange}
                  icon={Settings}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextArea
                    label="Fallos / Problema"
                    name="issues"
                    value={formData.issues}
                    onChange={handleChange}
                    icon={AlertTriangle}
                  />
                  <TextArea
                    label="Observaciones"
                    name="observations"
                    value={formData.observations}
                    onChange={handleChange}
                    icon={FileText}
                  />
                </div>

                <Section
                  title="Remolque"
                  name="trailer"
                  data={formData.trailer}
                  onChange={handleChange}
                  icon={Truck}
                />
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-4 pt-8">
            <button
              type="button"
              onClick={handlePrintPDF}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Printer className="h-5 w-5" />
              <span>Generar PDF</span>
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Plus className="h-5 w-5" />
              <span>{editingReception ? 'Actualizar' : 'Registrar'} Recepción</span>
            </button>
          </div>
        </form>

        <div className="glass-effect rounded-3xl p-8 shadow-soft">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-gray-800">Recepciones Guardadas</h2>
            {selectedReceptions.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300"
              >
                <Trash2 className="h-4 w-4" />
                <span>Eliminar Seleccionadas ({selectedReceptions.length})</span>
              </button>
            )}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre del cliente..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-4 mt-4">
            {filteredReceptions.map((reception) => {
              const receptionClientId = reception && reception.client ? (reception.client._id || reception.client) : null;
              const client = receptionClientId ? clients.find(client => client._id === receptionClientId) : null;
              const unit = units.find(unit => unit._id === (reception && reception.model ? (reception.model._id || reception.model) : ''));
              const clientName = client ? client.name : 'Desconocido';
              const modelName = unit ? (unit.model || unit.name) : 'Desconocido';
              
              return (
                <div
                  key={reception._id}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedReceptions.includes(reception._id)}
                        onChange={() => handleSelectReception(reception._id)}
                        className="mt-1.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{clientName}</h3>
                        <p className="text-gray-600">{modelName} - {reception.type} - {reception.brand}</p>
                        <p className="text-gray-500">Teléfono: {reception.phone}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(reception)}
                        className="flex items-center gap-1 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => handleDelete(reception._id)}
                        className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Eliminar</span>
                      </button>
                      <button
                        onClick={() => handlePrintPDF(reception._id)}
                        className="flex items-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <Printer className="h-4 w-4" />
                        <span>Imprimir</span>
                      </button>
                      <button
                        onClick={() => handleGoToQuotes(reception)}
                        className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Ir a Cotización</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, icon: Icon, ...props }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <input
        {...props}
        className={`w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
          Icon ? 'pl-10' : ''
        }`}
        required
      />
    </div>
  </div>
);

const Select = ({ label, options, icon: Icon, ...props }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <select
        {...props}
        className={`w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
          Icon ? 'pl-10' : ''
        }`}
        required
      >
        <option value="">Seleccionar {label}</option>
        {options}
      </select>
    </div>
  </div>
);

const TextArea = ({ label, icon: Icon, ...props }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-3 text-gray-400">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <textarea
        {...props}
        className={`w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[100px] ${
          Icon ? 'pl-10' : ''
        }`}
        required
      />
    </div>
  </div>
);

const Section = ({ title, name, data, onChange, icon: Icon }) => (
  <div className="bg-white/50 rounded-2xl p-6">
    <div className="flex items-center gap-3 mb-6">
      {Icon && (
        <div className="p-2 bg-blue-100 rounded-lg">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Object.keys(data).map((key) => {
        // Personalizar etiquetas
        const label =
          key === 'ibr'
            ? 'Activar IBR'
            : key.charAt(0).toUpperCase() + key.slice(1);

        return (
          <Checkbox
            key={key}
            label={label}
            name={`${name}.${key}`}
            checked={data[key]}
            onChange={onChange}
          />
        );
      })}
    </div>
  </div>
);

const Checkbox = ({ label, ...props }) => (
  <label className="inline-flex items-center">
    <input
      type="checkbox"
      {...props}
      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
    />
    <span className="ml-2 text-sm text-gray-700">{label}</span>
  </label>
);

export default ReceptionForm;

export const getReceptions = async (req, res) => {
  try {
    const receptions = await Reception.find()
      .populate('client') // Poblamos el cliente
      .populate('model'); // Poblamos el modelo
    res.status(200).json(receptions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};