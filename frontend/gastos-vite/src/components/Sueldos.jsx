import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Swal from 'sweetalert2';

export default function Sueldo() {
    const [monto, setMonto] = useState("");
    const [mes, setMes] = useState("");
    const [sueldos, setSueldos] = useState([]);
    const [usuarioId, setUsuarioId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.error("No se encontró el token");
            return;
        }

        try {
            const decoded = jwtDecode(token);
            setUsuarioId(decoded?.id);
            obtenerSueldos(token);
        } catch (error) {
            console.error("Error al decodificar el token:", error);
        }
    }, []);

    const obtenerSueldos = (token) => {
        axios
            .get("http://localhost:8080/api/sueldos/getSueldos", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setSueldos(res.data))
            .catch((err) => console.error("Error al obtener los sueldos", err));
    };

    const agregarSueldo = () => {
        if (!monto || !mes || !usuarioId) {
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: 'Completa todos los campos.',
                confirmButtonColor: '#3085d6',
            });
            return;
        }

        const token = localStorage.getItem("token");

        axios
            .post(
                "http://localhost:8080/api/sueldos/addSueldo",
                { monto, mes, usuarioId },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then(() => {
                obtenerSueldos(token);
                setMonto("");
                setMes("");
                Swal.fire({
                    icon: 'success',
                    title: '¡Sueldo guardado!',
                    text: 'El sueldo se ha guardado correctamente.',
                    confirmButtonColor: '#3085d6',
                });
            })
            .catch((err) => {
                console.error("Error al agregar sueldo:", err);
                Swal.fire({
                    icon: 'error',
                    title: '¡Error!',
                    text: 'Hubo un problema al guardar el sueldo.',
                    confirmButtonColor: '#3085d6',
                });
            });
    };

    const eliminarSueldo = (id) => {
        const token = localStorage.getItem("token");

        Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`http://localhost:8080/api/sueldos/deleteSueldo/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    .then(() => {
                        obtenerSueldos(token);
                        Swal.fire(
                            '¡Eliminado!',
                            'El sueldo ha sido eliminado.',
                            'success'
                        );
                    })
                    .catch((err) => {
                        console.error("Error al eliminar sueldo", err);
                        Swal.fire({
                            icon: 'error',
                            title: '¡Error!',
                            text: 'Hubo un problema al eliminar el sueldo.',
                            confirmButtonColor: '#3085d6',
                        });
                    });
            }
        });
    };

    return (
        <div className="max-w-xl mx-auto bg-linear-to-t from-sky-200 to-indigo-70 p-8 rounded-2xl shadow-xl transition-transform hover:-translate-y-1 hover:shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-700 tracking-tight">Registrar Sueldo</h2>

            <div className="space-y-4">
                <input
                    type="number"
                    placeholder="Monto"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    className="w-full px-4 py-3 border border-black rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
                <input
                    type="text"
                    placeholder="Mes (Ej: Abril 2025)"
                    value={mes}
                    onChange={(e) => setMes(e.target.value)}
                    className="w-full px-4 py-3 border border-black rounded-xl text-black  focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
                <button
                    onClick={agregarSueldo}
                    className="text-white w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                >
                    Guardar Sueldo
                </button>
            </div>

            <h3 className="mt-8 text-xl font-bold text-gray-700 tracking-tight">Historial de Sueldos</h3>
            <ul className="mt-4 space-y-3">
                {sueldos.map((s) => (
                    <li
                        key={s._id}
                        className="bg-gray-50 px-4 py-3 rounded-xl flex justify-between items-center shadow-sm"
                    >
                        <span className="text-gray-600">
                            {s.mes}: <span className="font-semibold">${s.monto}</span>
                        </span>
                        <button
                            onClick={() => eliminarSueldo(s._id)}
                            className="text-red-500 hover:text-red-600 font-medium transition"
                        >
                            Eliminar
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
