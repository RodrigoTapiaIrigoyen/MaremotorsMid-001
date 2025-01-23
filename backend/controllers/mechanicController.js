import Mechanic from '../models/mechanicModel.js';
import User from '../models/userModel.js';

// @desc    Get all mechanics
// @route   GET /api/mechanics
// @access  Private
export const getMechanics = async (req, res) => {
  try {
    const mechanics = await Mechanic.find({}).populate('userId', 'name email');
    res.json(mechanics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get mechanic by ID
// @route   GET /api/mechanics/:id
// @access  Private
export const getMechanicById = async (req, res) => {
  try {
    const mechanic = await Mechanic.findById(req.params.id).populate('userId', 'name email');
    
    if (mechanic) {
      res.json(mechanic);
    } else {
      res.status(404).json({ message: 'Mechanic not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new mechanic
// @route   POST /api/mechanics
// @access  Private/Admin
export const createMechanic = async (req, res) => {
  try {
    const { userId, specialties } = req.body;
    
    // Verify if user exists and is not already a mechanic
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(400).json({ message: 'User not found' });
    }

    const mechanicExists = await Mechanic.findOne({ userId });
    if (mechanicExists) {
      return res.status(400).json({ message: 'User is already a mechanic' });
    }

    const mechanic = await Mechanic.create({
      userId,
      specialties,
      available: true,
      currentTasks: []
    });

    // Update user role to mechanic
    userExists.role = 'mechanic';
    await userExists.save();

    res.status(201).json(mechanic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update mechanic
// @route   PUT /api/mechanics/:id
// @access  Private/Admin
export const updateMechanic = async (req, res) => {
  try {
    const { specialties, available } = req.body;
    const mechanic = await Mechanic.findById(req.params.id);

    if (mechanic) {
      mechanic.specialties = specialties || mechanic.specialties;
      mechanic.available = available !== undefined ? available : mechanic.available;

      const updatedMechanic = await mechanic.save();
      res.json(updatedMechanic);
    } else {
      res.status(404).json({ message: 'Mechanic not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete mechanic
// @route   DELETE /api/mechanics/:id
// @access  Private/Admin
export const deleteMechanic = async (req, res) => {
  try {
    const mechanic = await Mechanic.findById(req.params.id);

    if (mechanic) {
      // Update user role back to receptionist
      await User.findByIdAndUpdate(mechanic.userId, { role: 'receptionist' });
      await mechanic.deleteOne();
      res.json({ message: 'Mechanic removed' });
    } else {
      res.status(404).json({ message: 'Mechanic not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add task to mechanic
// @route   POST /api/mechanics/:id/tasks
// @access  Private
export const addTask = async (req, res) => {
  try {
    const { description, deadline } = req.body;
    const mechanic = await Mechanic.findById(req.params.id);

    if (mechanic) {
      mechanic.currentTasks.push({
        description,
        deadline,
        status: 'pending'
      });

      const updatedMechanic = await mechanic.save();
      res.json(updatedMechanic);
    } else {
      res.status(404).json({ message: 'Mechanic not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update task status
// @route   PUT /api/mechanics/:id/tasks/:taskId
// @access  Private
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const mechanic = await Mechanic.findById(req.params.id);

    if (mechanic) {
      const task = mechanic.currentTasks.id(req.params.taskId);
      if (task) {
        task.status = status;
        await mechanic.save();
        res.json(mechanic);
      } else {
        res.status(404).json({ message: 'Task not found' });
      }
    } else {
      res.status(404).json({ message: 'Mechanic not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};