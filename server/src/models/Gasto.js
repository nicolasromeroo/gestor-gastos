
import mongoose, { Schema } from "mongoose";

const { ObjectId } = mongoose.Types;

const gastoCollection = "gastos"

const gastoSchema = new Schema({
    nombre: {
        type: String
    },
    monto: {
        type: Number
    },
    categoria: {
        type: String
    },
    prioridad: {
        type: String,
        required: false
    },
    fecha: {
        type: Date
    },
    usuarioId: {
        type: ObjectId,
        ref: 'Usuario'
    }
})

const Gasto = mongoose.model("Gasto", gastoSchema, gastoCollection)

export default Gasto