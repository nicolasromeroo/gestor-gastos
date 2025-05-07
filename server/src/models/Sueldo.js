
import mongoose, { Schema } from "mongoose";

const { ObjectId } = mongoose.Types;

const sueldoCollection = "sueldos";

const sueldoSchema = new Schema({
    monto: {
        type: Number,
    },
    mes: {
        type: String, // como por ej "Abril 2025"
    },
    usuarioId: {
        type: ObjectId,
        ref: "user",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Sueldo = mongoose.model("Sueldo", sueldoSchema, sueldoCollection);

export default Sueldo;
