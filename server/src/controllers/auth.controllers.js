import { generateToken } from "../config/jwt.js"
import bcrypt from "bcrypt"
import { userDao } from "../dao/user.dao.js"

export const register = async (req, res) => {
    const { username, password } = req.body

    try {
        const usuarioExiste = await userDao.getByUsername(username)

        if (usuarioExiste) return res.status(400).json({ msg: "Usuario existente" })

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await userDao.create({
            username,
            password: hashedPassword
        })
        const usuarioGuardado = await newUser.save();

        const token = generateToken({ id: usuarioGuardado._id });

        res.json({
            id: usuarioGuardado._id,
            username: usuarioGuardado.username,
            token: token
        });

    } catch (err) {
        console.error("Error al registrar el usuario:", err);
        return res.status(500).json({ msg: "Error al realizar el registro", error: err.message });
    }

}

export const login = async (req, res) => {
    const { username, password } = req.body

    try {
        const usuarioEncontrado = await userDao.getByUsername(username)

        if (!usuarioEncontrado) return res.status(400).json({ msg: "Usuario inexistente." })

        const siCoincide = await bcrypt.compare(password, usuarioEncontrado.password)

        if (!siCoincide) return res.status(500).json({ msg: "Usuario o contraseña incorrectos." })

        const token = generateToken(usuarioEncontrado)

        res.cookie("token", token, { httpOnly: true })

        res.json({
            id: usuarioEncontrado._id,
            username: usuarioEncontrado.username,
            token: token
        })

    } catch (err) {
        return res.status(500).json({ msg: "Error al realizar el login." })
    }
}

export const logout = (req, res) => {
    res.cookie("token", "", { expires: new Date(0) })

    return res.sendStatus(200)
}

export const profile = async (req, res) => {
    if (!req.user || !req.user.id) return res.status(401).json({ msg: "Usuario no autenticado" })

    const usuarioEncontrado = await userDao.getById(req.user.id)

    if (!usuarioEncontrado) return res.status(400).json({ msg: "Usuario no encontrado" })

    return res.json({
        id: usuarioEncontrado._id,
        username: usuarioEncontrado.username
    })
}