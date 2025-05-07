
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { LogOut } from "lucide-react";

export default function Logout() {
    const navigate = useNavigate();

    const handleLogout = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token || typeof token !== "string") {
            console.error("Token no válido o no encontrado");
            return;
        }

        try {
            const response = await axios.post(
                "https://gestor-gastos.onrender.com/api/auth/logout",
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.status === 200) {
                localStorage.removeItem("token");
                localStorage.removeItem("userId");

                Swal.fire({
                    icon: "success",
                    title: "¡Sesión cerrada!",
                    text: "Has cerrado sesión correctamente.",
                    confirmButtonText: "Ir a Login",
                }).then(() => {
                    navigate("/");
                });
            } else {
                throw new Error("Error en el cierre de sesión");
            }
        } catch (err) {
            console.log("Error al cerrar sesión", err.response || err);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un problema al cerrar sesión. Intenta nuevamente.",
                confirmButtonText: "Intentar nuevamente",
            });
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm shadow-md transition"
        >
            <LogOut className="w-4 h-4" />
            <span>Cerrar sesión</span>
        </button>
    );
}
