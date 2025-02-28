import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
  fuelTank: false,
};

const ReceptionForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [activeTab, setActiveTab] = useState('reception');
  const [receptions, setReceptions] = useState([]);
  const [clients, setClients] = useState([]);
  const [units, setUnits] = useState([]);
  const [editingReception, setEditingReception] = useState(null);

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
      if (editingReception) {
        await axios.put(`http://localhost:5000/api/receptions/${editingReception._id}`, formData);
        alert('Recepción actualizada con éxito');
      } else {
        await axios.post('http://localhost:5000/api/receptions', formData);
        alert('Recepción registrada con éxito');
      }
      setFormData(initialFormData);
      setEditingReception(null);
      const response = await axios.get('http://localhost:5000/api/receptions');
      setReceptions(response.data);
    } catch (error) {
      console.error('Error registrando la recepción:', error.message);
      alert('Error registrando la recepción');
    }
  };

  const handleEdit = (reception) => {
    setFormData(reception);
    setEditingReception(reception);
    setActiveTab('reception');
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/receptions/${id}`);
      alert('Recepción eliminada con éxito');
      const response = await axios.get('http://localhost:5000/api/receptions');
      setReceptions(response.data);
    } catch (error) {
      console.error('Error eliminando la recepción:', error.message);
      alert('Error eliminando la recepción');
    }
  };

  const handlePrintPDF = () => {
    const doc = new jsPDF();
  
    // Cargar el logo
    const logo = new Image();
    logo.src = 'src/logo/Maremotors.png'; // Asegúrate de que la ruta sea correcta
  
    logo.onload = () => {
      // Agregar el logo al PDF
      doc.addImage(logo, 'PNG', 10, 10, 30, 30); // Ajusta las coordenadas y el tamaño según sea necesario
  
      // Encabezado
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0); // Color negro fuerte
      doc.text("Maremotors YAMAHA", 105, 10, { align: "center" });
  
      doc.setFontSize(10);
      doc.text("Carretera Merida Progreso Kilómetro Merida 24", 105, 15, { align: "center" });
      doc.text("San Ignacio, Yucatan", 105, 20, { align: "center" });
      doc.text("Tel: 9992383587 / 9997389040", 105, 25, { align: "center" });
      doc.text("Horario: Lunes a Viernes de 9AM - 5PM, Sábado de 9AM - 1:30PM", 105, 30, { align: "center" });
  
      doc.setFontSize(8);
      doc.setTextColor(50, 50, 50); // Color gris oscuro
      doc.text("EXISTEN ACCESORIOS Y PARTES DE LOS VEHICULOS QUE PUEDEN TENER VICIOS OCULTOS,", 105, 35, { align: "center" });
      doc.text("NO NOS HACEMOS REPONSABLES QUE ESTANDO EN RESGUARDO O EN EL TRANSCURSO", 105, 40, { align: "center" });
      doc.text("QUE SE RECOJAN SE DAÑEN.", 105, 45, { align: "center" });
  
      // Información de la recepción
      const receptionInfo = [
        ["Recepción", formData.reception],
        ["Fecha", formData.date],
        ["Cliente", formData.client],
        ["Teléfono", formData.phone],
        ["Modelo", formData.model],
        ["Tipo", formData.type],
        ["Marca", formData.brand],
        ["Cotización", formData.quotation],
        ["Color", formData.color],
        ["Placas", formData.plates]
      ];
  
      const issuesObservations = [
        ["Fallos / Problema", formData.issues],
        ["Observaciones", formData.observations],
        ["Tanque de Gasolina", formData.fuelTank ? 'SI' : 'NO']
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
        styles: { halign: 'left', textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.1, fontSize: 8, fillColor: [230, 230, 230] },
        headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] }, // Encabezado negro con texto blanco
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
  
      // Firmas
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0); // Color negro fuerte
      doc.text("FIRMA DE CONFORMIDAD DE RECEPCION", 20, finalY + 70);
      doc.text("FIRMA DE CONFORMIDAD DE ENTREGA", 120, finalY + 70);
  
      doc.save(`recepcion_${formData.client}.pdf`);
    };
  };
  const renderOptions = (data) => data.map(item => (
    <option key={item._id} value={item._id}>{item.name}</option>
  ));

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">{editingReception ? 'Editar Recepción' : 'Registrar Recepción'}</h2>

        <div className="tabs">
          <button type="button" className={`tab ${activeTab === 'reception' ? 'active' : ''}`} onClick={() => setActiveTab('reception')}>
            Recepción
          </button>
          <button type="button" className={`tab ${activeTab === 'pdf' ? 'active' : ''}`} onClick={() => setActiveTab('pdf')}>
            Datos para PDF
          </button>
        </div>

        <div className="tab-content">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input label="Recepción" name="reception" value={formData.reception} onChange={handleChange} />
            <Input label="Fecha" type="date" name="date" value={formData.date} onChange={handleChange} />
            <Select label="Cliente" name="client" value={formData.client} onChange={handleChange} options={renderOptions(clients)} />
            <Input label="Teléfono" name="phone" value={formData.phone} onChange={handleChange} />
            <Select label="Modelo" name="model" value={formData.model} onChange={handleChange} options={renderOptions(units)} />
            <Input label="Tipo" name="type" value={formData.type} onChange={handleChange} />
            <Input label="Marca" name="brand" value={formData.brand} onChange={handleChange} />
            <Input label="Cotización" name="quotation" value={formData.quotation} onChange={handleChange} />
            <Input label="Color" name="color" value={formData.color} onChange={handleChange} />
            <Input label="Placas" name="plates" value={formData.plates} onChange={handleChange} />
          </div>

          <Section title="Accesorios" name="accessories" data={formData.accessories} onChange={handleChange} />
          <Section title="Estética e Instrumentos" name="aesthetics" data={formData.aesthetics} onChange={handleChange} />
          <TextArea label="Fallos / Problema" name="issues" value={formData.issues} onChange={handleChange} />
          <TextArea label="Observaciones" name="observations" value={formData.observations} onChange={handleChange} />
          <Section title="Remolque" name="trailer" data={formData.trailer} onChange={handleChange} />
          <Checkbox label="Tanque de Gasolina" name="fuelTank" checked={formData.fuelTank} onChange={handleChange} />
        </div>

        <div className="flex gap-4 mt-6">
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">{editingReception ? 'Actualizar' : 'Registrar'}</button>
          <button type="button" onClick={handlePrintPDF} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">Imprimir PDF</button>
        </div>
      </form>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Recepciones Guardadas</h2>
        <ul className="space-y-4">
          {receptions.map((reception) => {
            const client = clients.find(client => client._id === reception.client);
            const clientName = client ? client.name : 'Desconocido';
            return (
              <li key={reception._id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                <div>
                  <span className="block text-lg font-semibold text-gray-800">{clientName}</span>
                  <span className="block text-gray-600">{reception.model} - {reception.type} - {reception.brand}</span>
                  <span className="block text-gray-600">Teléfono: {reception.phone}</span>
                  <span className="block text-gray-600">Cotización: ${reception.quotation.toFixed(2)}</span>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(reception)} className="bg-yellow-500 text-white px-4 py-2 rounded-md">Editar</button>
                  <button onClick={() => handleDelete(reception._id)} className="bg-red-500 text-white px-4 py-2 rounded-md">Eliminar</button>
                  <button onClick={() => handlePrintPDF(reception._id)} className="bg-blue-500 text-white px-4 py-2 rounded-md">Imprimir PDF</button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-600">{label}:</label>
    <input {...props} className="mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-600">{label}:</label>
    <select {...props} className="mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
      <option value="">Seleccionar {label}</option>
      {options}
    </select>
  </div>
);

const TextArea = ({ label, ...props }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-600">{label}:</label>
    <textarea {...props} className="mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
  </div>
);

const Section = ({ title, name, data, onChange }) => (
  <>
    <h3 className="text-xl font-semibold text-gray-700 mb-4">{title}</h3>
    <div className="grid grid-cols-2 gap-4">
      {Object.keys(data).map(key => (
        <Checkbox key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} name={`${name}.${key}`} checked={data[key]} onChange={onChange} />
      ))}
    </div>
  </>
);

const Checkbox = ({ label, ...props }) => (
  <div className="flex items-center">
    <input type="checkbox" {...props} className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
    <label className="text-sm font-medium text-gray-600">{label}</label>
  </div>
);

export default ReceptionForm;