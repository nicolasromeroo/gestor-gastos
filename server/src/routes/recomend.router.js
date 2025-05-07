
import { Router } from "express";
import { sueldoDao } from "../dao/sueldo.dao.js";
import { gastoDao } from "../dao/gasto.dao.js";

const router = Router()

router.get("/recomendaciones", verifyToken, async (req, res) => {
    const sueldo = await sueldoDao.findOne({ userId: req.user._id });
    const gastos = await gastoDao.find({ userId: req.user._id });

    const totalGastos = gastos.reduce((acc, g) => acc + g.monto, 0);
    const porcentaje = ((totalGastos / sueldo.monto) * 100).toFixed(2);

    const recomendaciones = [];

    if (porcentaje > 70) {
        recomendaciones.push("Estás gastando más del 70% de tu sueldo. Considera reducir gastos.");
        // futura logica p/referir gastos especificos
    }

    const porCategoria = {};
    gastos.forEach((g) => {
        porCategoria[g.categoria] = (porCategoria[g.categoria] || 0) + g.monto;
    });

    for (let cat in porCategoria) {
        const porcentajeCat = ((porCategoria[cat] / totalGastos) * 100).toFixed(2);
        if (porcentajeCat > 40) {
            recomendaciones.push(`El ${porcentajeCat}% se fue en ${cat}. Podés recortar ahí.`);
        }
    }

    res.json({ totalGastos, porcentaje, recomendaciones });
});

export default router