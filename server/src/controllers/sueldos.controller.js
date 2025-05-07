
import mongoose from "mongoose";
import { sueldoDao } from "../dao/sueldo.dao.js";

export const getSueldos = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Usuario no autenticado" });
        }

        const usuarioId = req.user.id;
        console.log("Usuario autenticado:", usuarioId);

        const sueldos = await sueldoDao.getByUserId(usuarioId);

        res.json(sueldos);
    } catch (err) {
        console.error("Error en getSueldos:", err);
        return res.status(500).json({ msg: "Error al cargar sueldos." });
    }
};


export const getSueldoUserId = async (req, res) => {
    const { uid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(uid)) {
        return res.status(400).json({ message: "ID de usuario inválido" });
    }

    try {
        const sueldo = await sueldoDao.getByUserId(uid);

        if (!sueldo) {
            return res.status(404).json({ message: "Sueldo no encontrado para el usuario" });
        }

        res.status(200).json(sueldo);
    } catch (error) {
        console.error("Error al buscar sueldo:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
};

export const addSueldo = async (req, res) => {
    const { monto, mes, usuarioId } = req.body;

    if (!monto || !mes || !usuarioId) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
        return res.status(400).json({ message: "ID de usuario inválido" });
    }

    try {
        const newSueldo = await sueldoDao.create({ monto, mes, usuarioId });
        res.status(201).json({ message: "Sueldo agregado con éxito.", newSueldo });
    } catch (err) {
        console.error("Error en addSueldo:", err);
        res.status(500).json({ msg: "Error al añadir sueldo.", error: err.message });
    }
};


export const updateSueldo = async (req, res) => {
    const { id } = re.params

    const { monto } = req.body

    try {
        const updatedSueldo = await sueldoDao.update(id, { monto })

        if (!updatedSueldo) return res.status(404).json({ msg: "No se pudo actualizar el sueldo." })

        res.json(updatedSueldo)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ msg: "Error al actualizar sueldo." })
    }
}

export const deleteSueldo = async (req, res) => {
    const { id } = req.params

    try {
        const deletedSueldo = await sueldoDao.deleteOne({ _id: id })

        if (!deletedSueldo) return res.status(404).json({ mesg: "No se pudo eliminar el sueldo." })

        console.log(deletedSueldo)
        res.json({ message: "Sueldo eliminado." })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ msg: "Error al eliminar sueldo." })
    }
}