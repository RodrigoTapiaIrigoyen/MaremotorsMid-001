import Setting from '../models/settingModel.js';

// @desc    Get all settings
// @route   GET /api/settings
// @access  Private/Admin
export const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    
    if (!settings) {
      settings = await Setting.create({});
    }
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = async (req, res) => {
  try {
    const { company, system, notifications, security } = req.body;
    
    let settings = await Setting.findOne();
    
    if (settings) {
      settings.company = company || settings.company;
      settings.system = system || settings.system;
      settings.notifications = notifications || settings.notifications;
      settings.security = security || settings.security;
      
      const updatedSettings = await settings.save();
      res.json(updatedSettings);
    } else {
      settings = await Setting.create({
        company,
        system,
        notifications,
        security
      });
      res.status(201).json(settings);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get company settings
// @route   GET /api/settings/company
// @access  Private
export const getCompanySettings = async (req, res) => {
  try {
    const settings = await Setting.findOne().select('company');
    res.json(settings?.company || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update company settings
// @route   PUT /api/settings/company
// @access  Private/Admin
export const updateCompanySettings = async (req, res) => {
  try {
    const companyData = req.body;
    
    let settings = await Setting.findOne();
    
    if (settings) {
      settings.company = companyData;
      const updatedSettings = await settings.save();
      res.json(updatedSettings.company);
    } else {
      settings = await Setting.create({
        company: companyData
      });
      res.status(201).json(settings.company);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};