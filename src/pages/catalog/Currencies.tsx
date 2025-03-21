import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Currency {
  _id: string;
  name: string;
  symbol: string;
  exchangeRate: number;
}

const Currencies: React.FC = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [newCurrency, setNewCurrency] = useState({
    name: '',
    symbol: '',
    exchangeRate: 0,
  });
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/currencies');
        setCurrencies(response.data);
      } catch (error) {
        console.error('Error fetching currencies:', error);
      }
    };

    fetchCurrencies();
  }, []);

  const handleAddCurrency = async () => {
    if (!newCurrency.name || !newCurrency.symbol || !newCurrency.exchangeRate) {
      alert('Por favor complete todos los campos');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/currencies', newCurrency);
      setCurrencies([...currencies, response.data]);
      setNewCurrency({ name: '', symbol: '', exchangeRate: 0 });
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding currency:', error);
    }
  };

  const handleDeleteCurrency = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/currencies/${id}`);
      setCurrencies(currencies.filter((currency) => currency._id !== id));
    } catch (error) {
      console.error('Error deleting currency:', error);
    }
  };

  const handleUpdateExchangeRate = async (id: string, newRate: number) => {
    if (isNaN(newRate)) {
      alert('Por favor ingrese una tasa válida');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/currencies/${id}`, { exchangeRate: newRate });
      setCurrencies(currencies.map(currency => 
        currency._id === id 
          ? { ...currency, exchangeRate: response.data.exchangeRate }
          : currency
      ));
    } catch (error) {
      console.error('Error updating currency exchange rate:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Monedas y Tipos de Cambio</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Agregar Moneda
        </button>
      </div>

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Nombre</th>
            <th className="py-2">Símbolo</th>
            <th className="py-2">Tasa de Cambio</th>
            <th className="py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currencies.map((currency) => (
            <tr key={currency._id}>
              <td className="border px-4 py-2">{currency.name}</td>
              <td className="border px-4 py-2">{currency.symbol}</td>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  value={currency.exchangeRate}
                  onChange={(e) => handleUpdateExchangeRate(currency._id, parseFloat(e.target.value))}
                  className="w-full px-2 py-1 border rounded"
                />
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDeleteCurrency(currency._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Agregar Nueva Moneda</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Nombre</label>
                <input
                  type="text"
                  value={newCurrency.name}
                  onChange={(e) => setNewCurrency({ ...newCurrency, name: e.target.value })}
                  className="w-full px-2 py-1 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Símbolo</label>
                <input
                  type="text"
                  value={newCurrency.symbol}
                  onChange={(e) => setNewCurrency({ ...newCurrency, symbol: e.target.value })}
                  className="w-full px-2 py-1 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Tasa de Cambio</label>
                <input
                  type="number"
                  value={newCurrency.exchangeRate}
                  onChange={(e) => setNewCurrency({ ...newCurrency, exchangeRate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2 py-1 border rounded"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddCurrency}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Currencies;