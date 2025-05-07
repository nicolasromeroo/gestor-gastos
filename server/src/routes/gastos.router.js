
import { Router } from "express";
import { addGasto, deleteGasto, getGastos, getGastosPorMonto, getGastosUsuario, updateGasto } from "../controllers/gastos.controllers.js";
import { verifyToken } from "../config/jwt.js";

const router = Router()

router.get("/getGastos", verifyToken, getGastos)
router.get("/getGasto/:id", verifyToken, getGastosUsuario)
router.get("/porMonto", verifyToken, getGastosPorMonto)
router.post("/addGasto", verifyToken, addGasto)
router.put("/updateGasto/:id", updateGasto)
router.delete("/deleteGasto/:id", deleteGasto)

export default router