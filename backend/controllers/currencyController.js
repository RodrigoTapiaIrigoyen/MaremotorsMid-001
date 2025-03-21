import Currency from '../models/currencyModel.js';

export const getCurrencies = async (req, res) => {
  try {
    const currencies = await Currency.find();
    res.status(200).json(currencies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCurrency = async (req, res) => {
  const { name, symbol, exchangeRate } = req.body;
  const newCurrency = new Currency({ name, symbol, exchangeRate });

  try {
    await newCurrency.save();
    res.status(201).json(newCurrency);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};