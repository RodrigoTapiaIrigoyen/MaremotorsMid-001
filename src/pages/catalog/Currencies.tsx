import React, { useState, useEffect } from 'react';
import { DollarSign, RefreshCw, Trash2, Plus, Calculator } from 'lucide-react';

interface Currency {
  id: number;
  code: string;
  name: string;
  rate: number;
  lastUpdated: string;
}

interface ConversionResult {
  fromAmount: number;
  toAmount: number;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
}

const Currencies: React.FC = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([
    { id: 1, code: 'USD', name: 'US Dollar', rate: 1, lastUpdated: new Date().toISOString() },
    { id: 2, code: 'MXN', name: 'Mexican Peso', rate: 17.05, lastUpdated: new Date().toISOString() },
    { id: 3, code: 'EUR', name: 'Euro', rate: 0.92, lastUpdated: new Date().toISOString() },
  ]);
  
  const [newCurrency, setNewCurrency] = useState({
    code: '',
    name: '',
    rate: 0,
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [conversion, setConversion] = useState<ConversionResult | null>(null);
  const [conversionForm, setConversionForm] = useState({
    amount: '',
    fromCurrency: 'USD',
    toCurrency: 'MXN',
  });

  const handleAddCurrency = () => {
    if (!newCurrency.code || !newCurrency.name || !newCurrency.rate) {
      alert('Por favor complete todos los campos');
      return;
    }

    const newId = Math.max(...currencies.map(c => c.id), 0) + 1;
    setCurrencies([...currencies, {
      id: newId,
      ...newCurrency,
      lastUpdated: new Date().toISOString()
    }]);
    setNewCurrency({ code: '', name: '', rate: 0 });
    setShowAddModal(false);
  };

  const handleDeleteCurrency = (id: number) => {
    if (currencies.length <= 1) {
      alert('Debe mantener al menos una moneda en el sistema');
      return;
    }
    setCurrencies(currencies.filter((currency) => currency.id !== id));
  };

  const handleUpdateRate = (id: number, newRate: number) => {
    setCurrencies(currencies.map(currency => 
      currency.id === id 
        ? { ...currency, rate: newRate, lastUpdated: new Date().toISOString() }
        : currency
    ));
  };

  const handleConvert = () => {
    const amount = parseFloat(conversionForm.amount);
    if (isNaN(amount)) {
      alert('Por favor ingrese un monto válido');
      return;
    }

    const fromCurrency = currencies.find(c => c.code === conversionForm.fromCurrency);
    const toCurrency = currencies.find(c => c.code === conversionForm.toCurrency);

    if (!fromCurrency || !toCurrency) {
      alert('Por favor seleccione monedas válidas');
      return;
    }

    const rate = toCurrency.rate / fromCurrency.rate;
    const result: ConversionResult = {
      fromAmount: amount,
      toAmount: amount * rate,
      fromCurrency: fromCurrency.code,
      toCurrency: toCurrency.code,
      rate: rate
    };

    setConversion(result);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <DollarSign className="h-8 w-8 text-yellow-500" />
          <div>
            <h2 className="text-2xl font-bold leading-7 text-gray-900">
              Monedas y Tipos de Cambio
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Gestión de monedas y tasas de cambio
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowConvertModal(true)}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Calculator className="h-4 w-4 mr-2" />
            Convertir
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center rounded-md bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Moneda
          </button>
        </div>
      </div>

      {/* Currency List */}
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Código</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Nombre</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Tasa vs USD</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Última Actualización</th>
              <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currencies.map((currency) => (
              <tr key={currency.id}>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{currency.code}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{currency.name}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={currency.rate}
                      onChange={(e) => handleUpdateRate(currency.id, parseFloat(e.target.value))}
                      className="w-24 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                    />
                    <button
                      onClick={() => handleUpdateRate(currency.id, currency.rate)}
                      className="rounded-full p-1 text-gray-400 hover:text-gray-500"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {new Date(currency.lastUpdated).toLocaleString()}
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <button
                    onClick={() => handleDeleteCurrency(currency.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Currency Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Agregar Nueva Moneda
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Código
                </label>
                <input
                  type="text"
                  value={newCurrency.code}
                  onChange={(e) => setNewCurrency({ ...newCurrency, code: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                  placeholder="USD"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  value={newCurrency.name}
                  onChange={(e) => setNewCurrency({ ...newCurrency, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                  placeholder="US Dollar"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tasa vs USD
                </label>
                <input
                  type="number"
                  value={newCurrency.rate}
                  onChange={(e) => setNewCurrency({ ...newCurrency, rate: parseFloat(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                  placeholder="1.0"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddCurrency}
                className="rounded-md bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Currency Converter Modal */}
      {showConvertModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Convertir Moneda
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Monto
                </label>
                <input
                  type="number"
                  value={conversionForm.amount}
                  onChange={(e) => setConversionForm({ ...conversionForm, amount: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                  placeholder="100"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    De
                  </label>
                  <select
                    value={conversionForm.fromCurrency}
                    onChange={(e) => setConversionForm({ ...conversionForm, fromCurrency: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                  >
                    {currencies.map(c => (
                      <option key={c.code} value={c.code}>{c.code}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    A
                  </label>
                  <select
                    value={conversionForm.toCurrency}
                    onChange={(e) => setConversionForm({ ...conversionForm, toCurrency: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                  >
                    {currencies.map(c => (
                      <option key={c.code} value={c.code}>{c.code}</option>
                    ))}
                  </select>
                </div>
              </div>

              {conversion && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">Resultado:</p>
                  <p className="text-lg font-medium">
                    {conversion.fromAmount.toFixed(2)} {conversion.fromCurrency} =
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {conversion.toAmount.toFixed(2)} {conversion.toCurrency}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Tasa: 1 {conversion.fromCurrency} = {conversion.rate.toFixed(4)} {conversion.toCurrency}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowConvertModal(false);
                  setConversion(null);
                }}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cerrar
              </button>
              <button
                onClick={handleConvert}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Convertir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Currencies;