import express from "express";
import Mechanic from "../models/mechanicModel.js";

const router = express.Router(); // ✅ Corrección aquí

// Obtener todos los mecánicos
router.get("/", async (req, res) => {
  try {
    const mechanics = await Mechanic.find();
    res.json(mechanics);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los mecánicos" });
  }
});

// Crear un mecánico
router.post("/", async (req, res) => {
  try {
    const { name, phone } = req.body;
    const newMechanic = new Mechanic({ name, phone });
    await newMechanic.save();
    res.status(201).json(newMechanic);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el mecánico" });
  }
});

// Editar un mecánico
router.put("/:id", async (req, res) => {
  try {
    const { name, phone } = req.body;
    const updatedMechanic = await Mechanic.findByIdAndUpdate(
      req.params.id,
      { name, phone },
      { new: true }
    );
    res.json(updatedMechanic);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el mecánico" });
  }
});

// Eliminar un mecánico
router.delete("/:id", async (req, res) => {
  try {
    await Mechanic.findByIdAndDelete(req.params.id);
    res.json({ message: "Mecánico eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el mecánico" });
  }
});

export default router; // ✅ Asegúrate de exportar correctamente
