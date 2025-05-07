
import Gasto from "../models/Gasto.js.js";

export const getStat = async (req, res) => {
    try {
        const gastos = await Gasto.find({ userId: req.user._id });

        const totalGastos = gastos.reduce((acc, g) => acc + g.monto, 0);

        const porCategoria = {};
        gastos.forEach((g) => {
            porCategoria[g.categoria] = (porCategoria[g.categoria] || 0) + g.monto;
        });

        const porcentajePorCategoria = {};
        for (let cat in porCategoria) {
            porcentajePorCategoria[cat] = ((porCategoria[cat] / totalGastos) * 100).toFixed(2);
        }

        res.json({
            totalGastos,
            porcentajePorCategoria,
            categorias: porCategoria,
        });
    } catch (err) {
        return res.status(500).json({ msg: "No se pudo obtener la estadística." })
    }
}