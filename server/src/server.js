import express from "express"
import cors from "cors"
import envsConfig from "./config/envs.config.js"
import { baseDeDatos } from "./db/connect.js"
import cookieParser from "cookie-parser"
import gastosRouter from "./routes/gastos.router.js"
import sueldosRouter from "./routes/sueldos.router.js"
import authRouter from "./routes/auth.router.js"

baseDeDatos()

const app = express()

app.use(cookieParser())
app.use(cors())
app.use(express.json())

//RUTAS
app.use("/api/gastos", gastosRouter)
app.use("/api/sueldos", sueldosRouter)
app.use("/api/auth", authRouter)

app.listen(envsConfig.PORT, () => {
    console.log(`Servidor corriendo.`)
})

export default app
