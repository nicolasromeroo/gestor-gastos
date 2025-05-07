import mongoose from "mongoose"
import { gastoDao } from "../dao/gasto.dao.js"

export const getGastos = async (req, res) => {
    try {
        const gastos = await gastoDao.getAll()

        res.json(gastos)
    } catch (err) {
        return res.status(500).json({ msg: "Error al cargar gastos." })
    }
}

export const getGastosPorMonto = async (req, res) => {
    try {
        const orden = req.query.orden || "desc";
        const gastos = await gastoDao.find({ userId: req.user._id }).sort({ monto: orden === "asc" ? 1 : -1 });
        res.json(gastos);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Error al obtener los gastos ordenados." });
    }
}

export const getGastosUsuario = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "ID de usuario no válido" });
        }

        const userGastos = await gastoDao.getByUserId(userId);

        res.json(userGastos);
    } catch (error) {
        console.error("Error al obtener los gastos:", error);
        res.status(500).json({ message: "Error al obtener los gastos del usuario" });
    }
};

export const addGasto = async (req, res) => {
    const userId = req.user.id;
    const { nombre, monto, categoria, prioridad, fecha } = req.body

    try {
        const newGasto = await gastoDao.create({
            nombre: nombre,
            monto: monto,
            categoria: categoria,
            prioridad: prioridad,
            fecha: new Date(fecha),
            usuarioId: userId
        })

        await newGasto.save()

        res.status(201).json({ message: "Gasto agregado con éxito.", newGasto });
    } catch (err) {
        console.error(err)
        return res.status(500).json({ msg: "Error al añadir gasto." })
    }
}

export const updateGasto = async (req, res) => {
    const { id } = req.params

    const { nombre, monto, categoria, prioridad, fecha } = req.body

    try {
        const updatedGasto = await gastoDao.update(id, { nombre, monto, categoria, prioridad, fecha })

        if (!updatedGasto) return res.status(404).json({ msg: "No se pudo actualizar el gasto." })

        res.json(updatedGasto)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ msg: "Error al actualizar gasto." })
    }
}

export const deleteGasto = async (req, res) => {
    const { id } = req.params

    try {
        const deletedGasto = await gastoDao.deleteOne({ _id: id })

        if (!deletedGasto) return res.status(404).json({ mesg: "No se pudo eliminar el gasto." })

        console.log(deletedGasto)
        res.json({ message: "Gasto eliminado." })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ msg: "Error al eliminar gasto." })
    }
}