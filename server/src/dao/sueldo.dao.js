
import Sueldo from "../models/Sueldo.js";

class SueldoDao {
    async getAll() {
        const sueldos = await Sueldo.find()
        return sueldos
    }

    async getById(id) {
        const sueldo = await Sueldo.findById(id)
        return sueldo
    }

    // async getByUserId(uid) {
    //     const sueldo = await Sueldo.findOne({ usuarioId: uid });
    //     return sueldo;
    // }

    async getByUserId(uid) {
        const sueldos = await Sueldo.find({ usuarioId: uid });
        return sueldos;
    }


    async create(data) {
        const sueldo = await Sueldo.create(data)
        return sueldo
    }

    async update(gid, data) {
        const sueldoUpdate = await Sueldo.findByIdAndUpdate(gid, data, { new: true })
        return sueldoUpdate
    }

    async deleteOne(gid) {
        const sueldo = await Sueldo.deleteOne(gid)

        return sueldo
    }
}

export const sueldoDao = new SueldoDao()