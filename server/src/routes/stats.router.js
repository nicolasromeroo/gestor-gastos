
import { Router } from "express";
import { getStat } from "../controllers/stats.controller.js";
import { verifyToken } from "../config/jwt.js";

const router = Router()

router.get("/estadisticas", verifyToken, getStat)

export default router