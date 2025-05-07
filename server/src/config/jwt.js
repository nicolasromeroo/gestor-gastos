
import jwt from "jsonwebtoken"
import envsConfig from "./envs.config.js";

export const generateToken = (user) => {
    const payload = {
        id: user._id,
        username: user.username,
    }

    const token = jwt.sign(payload, envsConfig.SECRET_KEY, { expiresIn: "1h" })

    return token
}

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token no proporcionado o inválido." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, envsConfig.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Token inválido o expirado." });
    }
};
