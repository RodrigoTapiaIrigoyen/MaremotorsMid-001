import express from "express";
import { getSales, createSale, updateSale, deleteSale, approveSale, getArchivedSales } from "../controllers/salesController.js";

const router = express.Router();

router.get("/", getSales); // Ruta para obtener todas las ventas
router.post("/", createSale);
router.put("/:id", updateSale);
router.delete("/:id", deleteSale);
router.put("/:id/approve", approveSale);
router.get("/archived", getArchivedSales); // Nueva ruta para ventas archivadas

export default router;