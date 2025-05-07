
import mongoose from "mongoose"
import envsConfig from "../config/envs.config.js"

export const baseDeDatos = async (req, res) => {
    try {
        const mongoUrl = envsConfig.MONGO_URL

        if (!mongoUrl) {
            return res.status(400).json({ msj: "No se pudo conectar a la base de datos. MongoURL undefined," })
        }

        await mongoose.connect(mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'gastos'
        })

        console.log("Conectado a Mongo.")
    } catch (err) {
        console.error("No se pudo conectar a Mongo", err)
        process.exit(1)
    }
}