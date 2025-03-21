import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FileText, Printer, Trash2, Edit, Plus, ChevronRight, Car, PenTool as Tool, Package, ClipboardCheck, AlertTriangle, Settings, Truck, Search } from 'lucide-react';

const initialFormData = {
  reception: '',
  date: '',
  client: '',
  phone: '',
  model: '',
  type: '',
  brand: '',
  quotation: '',
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
    remolque: false,
    cambiar: false,
    winch: false,
    pata: false,
    baleros: false,
    tablas: false,
    luces: false,
    gomas: false,
    bases: false,
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [receptionsResponse, clientsResponse, unitsResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/receptions'),
          axios.get('http://localhost:5000/api/clients'),
          axios.get('http://localhost:5000/api/units'),
        ]);
        
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
        await axios.put(`http://localhost:5000/api/receptions/${editingReception._id}`, submissionData);
        setSuccessMessage('Recepción actualizada con éxito');
      } else {
        await axios.post('http://localhost:5000/api/receptions', submissionData);
        setSuccessMessage('Recepción registrada con éxito');
      }
      
      setFormData(initialFormData);
      setEditingReception(null);
      const response = await axios.get('http://localhost:5000/api/receptions');
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
      model: reception.model._id || reception.model
    };
    setFormData(editData);
    setEditingReception(reception);
    setActiveTab('reception');
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/receptions/${id}`);
      setSuccessMessage('Recepción eliminada con éxito');
      const response = await axios.get('http://localhost:5000/api/receptions');
      setReceptions(response.data);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage('Error al eliminar la recepción. Por favor, intente nuevamente.');
      console.error('Error eliminando la recepción:', error.message);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedReceptions.map(id => axios.delete(`http://localhost:5000/api/receptions/${id}`)));
      setSuccessMessage('Recepciones eliminadas con éxito');
      const response = await axios.get('http://localhost:5000/api/receptions');
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
  
    const logo = new Image();
    logo.src = 'src/logo/Maremotors.png';
  
    logo.onload = () => {
      doc.addImage(logo, 'PNG', 10, 10, 20, 20);
  
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("Maremotors YAMAHA", 105, 10, { align: "center" });
  
      doc.setFontSize(10);
      doc.text("Carretera Merida Progreso Kilómetro Merida 24", 105, 15, { align: "center" });
      doc.text("San Ignacio, Yucatan", 105, 20, { align: "center" });
      doc.text("Tel: 9992383587 / 9997389040", 105, 25, { align: "center" });
      doc.text("Horario: Lunes a Viernes de 9AM - 5PM, Sábado de 9AM - 1:30PM", 105, 30, { align: "center" });
  
      doc.setFontSize(8);
      doc.setTextColor(50, 50, 50);
      doc.text("EXISTEN ACCESORIOS Y PARTES DE LOS VEHICULOS QUE PUEDEN TENER VICIOS OCULTOS,", 105, 35, { align: "center" });
      doc.text("NO NOS HACEMOS REPONSABLES QUE ESTANDO EN RESGUARDO O EN EL TRANSCURSO", 105, 40, { align: "center" });
      doc.text("QUE SE RECOJAN SE DAÑEN.", 105, 45, { align: "center" });

      const selectedUnit = units.find(unit => unit._id === formData.model);
      const modelName = selectedUnit ? selectedUnit.model || selectedUnit.name : 'Desconocido';
  
      const receptionInfo = [
        ["Recepción", formData.reception],
        ["Fecha", formData.date],
        ["Cliente", formData.client],
        ["Teléfono", formData.phone],
        ["Modelo", modelName],
        ["Tipo", formData.type],
        ["Marca", formData.brand],
        ["Cotización", formData.quotation],
        ["Color", formData.color],
        ["Placas", formData.plates]
      ];
  
      const issuesObservations = [
        ["Fallos / Problema", formData.issues],
        ["Observaciones", formData.observations],
        ["Tanque de Gasolina", formData.fuelTank],
        ["Kilómetros", formData.kilometers]
      ];
  
      const accessories = Object.entries(formData.accessories).map(([key, value]) => [key.toUpperCase(), value ? 'SI' : 'NO']);
      const aesthetics = Object.entries(formData.aesthetics).map(([key, value]) => [key.toUpperCase(), value ? 'SI' : 'NO']);
      const trailer = Object.entries(formData.trailer).map(([key, value]) => [key.toUpperCase(), value ? 'SI' : 'NO']);
  
      const fieldsLeft = [
        ...receptionInfo,
        ...issuesObservations,
        ...accessories
      ];
  
      const fieldsRight = [
        ...aesthetics,
        ...trailer
      ];
  
      const tableOptions = {
        theme: 'grid',
        styles: { halign: 'left', textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.1, fontSize: 8 },
        headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
        columnStyles: {
          0: { cellWidth: 45 },
          1: { cellWidth: 50 }
        },
        startY: 50,
        margin: { top: 50, bottom: 0, left: 10, right: 10 },
        pageBreak: 'auto'
      };
  
      doc.autoTable({
        ...tableOptions,
        body: fieldsLeft,
        margin: { left: 10 }
      });
  
      doc.autoTable({
        ...tableOptions,
        body: fieldsRight,
        startY: 50,
        margin: { left: 110 }
      });
  
      const finalY = Math.max(doc.lastAutoTable.finalY, doc.lastAutoTable.finalY);
  
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text("FIRMA DE CONFORMIDAD DE RECEPCION", 20, finalY + 70);
      doc.text("FIRMA DE CONFORMIDAD DE ENTREGA", 120, finalY + 70);
  
      doc.save(`recepcion_${formData.client}.pdf`);
    };
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const renderOptions = (data) => {
    return data.map(item => {
      const displayName = item.model || item.name || 'Sin nombre';
      return (
        <option key={item._id} value={item._id}>
          {displayName}
        </option>
      );
    });
  };

  const filteredReceptions = receptions.filter((reception) => {
    const client = clients.find((client) => client._id === reception.client._id);
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

        {/* Messages */}
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
                  <Input
                    label="Tipo"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
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
                    label="Cotización"
                    name="quotation"
                    value={formData.quotation}
                    onChange={handleChange}
                    icon={FileText}
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
              const client = clients.find(client => client._id === reception.client._id);
              const unit = units.find(unit => unit._id === reception.model);
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
                        <p className="text-gray-500">Cotización: ${reception.quotation.toFixed(2)}</p>
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
      {Object.keys(data).map(key => (
        <Checkbox
          key={key}
          label={key.charAt(0).toUpperCase() + key.slice(1)}
          name={`${name}.${key}`}
          checked={data[key]}
          onChange={onChange}
        />
      ))}
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