import { useState } from 'react';

export const currencies = {
  USD: {
    symbol: '$',
    rate: 17.50,
    name: 'USD'
  },
  MXN: {
    symbol: '$',
    rate: 1,
    name: 'MXN'
  }
} as const;

export type CurrencyCode = keyof typeof currencies;

export const useCurrencyConverter = () => {
  const [rates, setRates] = useState(currencies);

  const convert = (amount: number, from: CurrencyCode, to: CurrencyCode, customRate?: number): number => {
    if (!amount || !rates[from] || !rates[to]) return amount;
    const fromRate = customRate || rates[from].rate;
    const toRate = rates[to].rate;
    return (amount * toRate) / fromRate;
  };

  const formatCurrency = (amount: number, currency: CurrencyCode): string => {
    if (!rates[currency]) return `${amount}`;
    return `${rates[currency].symbol}${amount.toFixed(2)} ${currency}`;
  };

  const updateRate = (currency: CurrencyCode, newRate: number) => {
    setRates(prev => ({
      ...prev,
      [currency]: {
        ...prev[currency],
        rate: newRate
      }
    }));
  };

  return { 
    convert, 
    formatCurrency,
    rates,
    updateRate
  };
};