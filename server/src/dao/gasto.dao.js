
import Gasto from "../models/Gasto.js";

class GastoDao {
    async getAll() {
        const gastos = await Gasto.find()
        return gastos
    }

    async getByUserId(userId) {
        const gastos = await Gasto.find({ usuarioId: userId });
        return gastos;
    }

    async create(data) {
        const gasto = await Gasto.create(data)
        return gasto
    }

    async update(gid, data) {
        const gastoUpdate = await Gasto.findByIdAndUpdate(gid, data, { new: true })
        return gastoUpdate
    }

    async deleteOne(id) {
        const gasto = await Gasto.deleteOne({ _id: id })
        return gasto
    }
}

export const gastoDao = new GastoDao()