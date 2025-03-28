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
// Get a single currency by ID
export const getCurrencyById = async (req, res) => {
  try {
    const currency = await Currency.findById(req.params.id);
    if (!currency) {
      return res.status(404).json({ message: "Currency not found" });
    }
    res.status(200).json(currency);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving currency" });
  }
};

export const deleteCurrency = async (req, res) => {
  try {
    const currency = await Currency.findByIdAndDelete(req.params.id);
    if (!currency) {
      return res.status(404).json({ message: "Currency not found" });
    }
    res.status(200).json({ message: "Currency deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};