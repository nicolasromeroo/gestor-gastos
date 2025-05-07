// components/Login.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8080/api/auth/login", {
                username,
                password,
            });

            const { token, id } = res.data;

            localStorage.setItem("token", token);
            localStorage.setItem("userId", id);

            Swal.fire({
                icon: "success",
                title: "¡Bienvenido!",
                text: "Has iniciado sesión con éxito.",
                confirmButtonText: "Ir al Dashboard",
            }).then(() => {
                navigate("/dashboard");
            });
        } catch (err) {
            console.log("Error al iniciar sesión", err);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo iniciar sesión. Verifica tus credenciales.",
                confirmButtonText: "Intentar nuevamente",
            });
        }
    };
    // min-h-screen bg-gradient-to-b from-gray-900 to-black
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black">
            <div className="w-full max-w-md bg-gradient-to-b from-gray-800 to-black rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-center text-white mb-6">
                    Iniciar Sesión
                </h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        className="text-white w-full px-4 py-2 border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Usuario"
                    />
                    <input
                        className="text-white w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña"
                        type="password"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}
