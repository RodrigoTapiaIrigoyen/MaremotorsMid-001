import ExchangeRate from '../models/exchangeRateModel.js';

export const getExchangeRates = async (req, res) => {
  try {
    const exchangeRates = await ExchangeRate.find().populate('fromCurrency toCurrency');
    res.status(200).json(exchangeRates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createExchangeRate = async (req, res) => {
  const { fromCurrency, toCurrency, rate } = req.body;
  const newExchangeRate = new ExchangeRate({ fromCurrency, toCurrency, rate });

  try {
    await newExchangeRate.save();
    res.status(201).json(newExchangeRate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};