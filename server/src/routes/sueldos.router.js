
import { Router } from "express";
import { addSueldo, deleteSueldo, getSueldos, getSueldoUserId, updateSueldo } from "../controllers/sueldos.controller.js";
import { verifyToken } from "../config/jwt.js";

const router = Router()

router.get("/getSueldos", verifyToken, getSueldos)
router.get("/getSueldo/:uid", verifyToken, getSueldoUserId)
router.post("/addSueldo", verifyToken, addSueldo)
router.put("/updateSueldo", verifyToken, updateSueldo)
router.delete("/deleteSueldo/:id", verifyToken, deleteSueldo)

export default router

