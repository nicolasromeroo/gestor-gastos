import React, { useState, useEffect } from "react";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from "chart.js";
import axios from "axios";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

export default function Gastos({ gastos = [], setGastos, sueldoDelMesActual, token, userId }) {
    const [nuevoGasto, setNuevoGasto] = useState("");
    const [categoriaGasto, setCategoriaGasto] = useState("");
    const [totalGastosCalculado, setTotalGastosCalculado] = useState(0);
    const [categorias, setCategorias] = useState([]);
    const [nombre, setNombre] = useState("");
    const [monto, setMonto] = useState("");
    const [categoria, setCategoria] = useState("General");
    const [fecha, setFecha] = useState("");
    const [editando, setEditando] = useState(null);
    const [gastoEditando, setGastoEditando] = useState(null);
    const [salarioMensual, setSalarioMensual] = useState(0);
    const [estadisticasData, setEstadisticasData] = useState({});


    // traer gastos
    useEffect(() => {
        if (!token || !userId) {
            console.log("Token o userId no disponibles.");
            return;
        }

        console.log("Token:", token);
        console.log("User ID:", userId);

        axios
            .get(`https://gestor-gastos.onrender.com/api/gastos/getGasto/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            })
            .then((res) => {
                console.log("Respuesta cruda gastos:", res.data);
                const hoy = new Date();
                const gastosUsuarioMesActual = res.data.filter((g) => {
                    const fecha = new Date(g.fecha);
                    return (
                        g.usuarioId === userId &&
                        fecha.getMonth() === hoy.getMonth() &&
                        fecha.getFullYear() === hoy.getFullYear()
                    );
                });
                setGastos(gastosUsuarioMesActual);

                const gastosAgrupados = agruparGastosPorCategoria(gastosUsuarioMesActual);
                setCategorias(gastosAgrupados);

                if (sueldoDelMesActual) {
                    recalcularTotales(gastosUsuarioMesActual, sueldoDelMesActual);
                }
            })
            .catch((err) => console.error("Error al traer gastos:", err));
    }, [token, userId, sueldoDelMesActual]);

    useEffect(() => {
        recalcularTotales(gastos, sueldoDelMesActual);
    }, [gastos, sueldoDelMesActual]);

    const recalcularTotales = (gastosActualizados, sueldoActual) => {
        if (!gastosActualizados || gastosActualizados.length === 0) {
            setTotalGastosCalculado(0);
            return;
        }

        const total = gastosActualizados.reduce((acc, g) => {
            const monto = parseFloat(g.monto);
            return acc + (!isNaN(monto) && monto >= 0 ? monto : 0);
        }, 0);

        setTotalGastosCalculado(total);
    };

    const handleAgregar = () => {
        const montoValor = parseFloat(monto);
        if (isNaN(montoValor) || !categoria.trim()) return;

        const nuevoGastoObj = {
            usuarioId: userId,
            nombre: nombre,
            categoria: categoria,
            monto: parseFloat(monto),
            prioridad: "Media",
            fecha: fecha,
            createdAt: new Date().toISOString(),
        };

        axios
            .post("https://gestor-gastos.onrender.com/api/gastos/addGasto", nuevoGastoObj, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            })
            .then((res) => {
                const gastoGuardado = {
                    ...res.data,
                    nombre: nombre,
                    fecha: fecha,
                    monto: monto,
                    categoria: categoria,
                };
                console.log("Nuevo gasto guardado:", gastoGuardado);


                const nuevosGastos = [...gastos, gastoGuardado];
                setGastos((prevGastos) => {
                    const nuevosGastos = [...prevGastos, gastoGuardado];
                    return nuevosGastos;
                });
                setCategorias(agruparGastosPorCategoria(nuevosGastos));
                recalcularTotales(nuevosGastos, sueldoDelMesActual);
                setNuevoGasto("");
                setCategoriaGasto("");
            })
            .catch((err) => {
                console.error("Error al guardar el gasto:", err);
            });
    };

    // eliminar gasto
    const eliminarGasto = (id) => {
        fetch(`https://gestor-gastos.onrender.com/api/gastos/deleteGasto/${id}`, {
            method: "DELETE",
        }).then(() => {
            setGastos((prev) => prev.filter((g) => g._id !== id));
        });
    };

    const editarGasto = (id, datosActualizados) => {
        fetch(`https://gestor-gastos.onrender.com/api/gastos/updateGasto/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosActualizados),
        }).then(() => {
            setGastos((prev) =>
                prev.map((g) => (g._id === id ? { ...g, ...datosActualizados } : g))
            );
            resetFormulario();
        });
    };

    const handleEditar = (gasto) => {
        setEditando(true);
        setGastoEditando(gasto);
        setFecha(gasto.fecha ? gasto.fecha.split("T")[0] : "");
        setNombre(gasto.nombre || "");
        setMonto(gasto.monto || "");
        setCategoria(gasto.categoria || "General");
    };

    const handleGuardarEdicion = () => {
        if (!gastoEditando) return;

        const datosActualizados = {
            fecha,
            nombre,
            monto,
            categoria,
        };

        editarGasto(gastoEditando._id, datosActualizados);
        setEditando(false);
        setGastoEditando(null);
    };

    function agruparGastosPorCategoria(gastos) {
        if (!gastos || gastos.length === 0) return [];
        return gastos.reduce((acc, gasto) => {
            const categoria = gasto.categoria || 'General';
            acc[categoria] = (acc[categoria] || 0) + parseFloat(gasto.monto);
            return acc;
        }, {});
    }


    const datosGrafico = () => {
        const gastosPorCategoria = agruparGastosPorCategoria(gastos);
        const categorias = Object.keys(gastosPorCategoria);
        const montos = Object.values(gastosPorCategoria);

        return {
            labels: categorias,
            datasets: [
                {
                    data: montos,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
                    hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
                },
            ],
        };
    };

    const resetFormulario = () => {
        setEditando(null);
        setNombre("");
        setMonto("");
        setCategoria("General");
        setFecha("");
    };

    useEffect(() => {
        if (gastos.length > 0) {
            const meses = [
                "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
            ];

            const hoy = new Date();
            const mesActual = hoy.getMonth();
            const añoActual = hoy.getFullYear();

            const gastosMesActual = gastos.filter(g => {
                const fecha = new Date(g.fecha);
                return fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual;
            });

            const totalActual = gastosMesActual.reduce((acc, g) => acc + parseFloat(g.monto || 0), 0);

            const gastosMesAnterior = gastos.filter(g => {
                const fecha = new Date(g.fecha);
                return fecha.getMonth() === (mesActual === 0 ? 11 : mesActual - 1) &&
                    fecha.getFullYear() === (mesActual === 0 ? añoActual - 1 : añoActual);
            });

            const totalAnterior = gastosMesAnterior.reduce((acc, g) => acc + parseFloat(g.monto || 0), 0);


            const porcentajeComparativa = totalAnterior === 0
                ? 0
                : ((totalActual - totalAnterior) / totalAnterior) * 100;
            const porcentajeFormateado = porcentajeComparativa?.toFixed(2);

            const mensajeComparativa = totalAnterior === 0
                ? "No hay datos del mes anterior para comparar."
                : porcentajeComparativa > 1000
                    ? "Tus gastos aumentaron drásticamente respecto al mes anterior."
                    : `Gastaste un ${Math.abs(porcentajeFormateado)}% ${totalActual < totalAnterior ? "menos" : "más"} que el mes anterior.`;

            const proyeccionAhorro = salarioMensual ? salarioMensual - totalActual : 0;

            const riesgoGastos = gastosMesActual
                .filter(g => g.monto > salarioMensual * 0.1)
                .map(g => `Gasto elevado en "${g.nombre}" de $${g.monto}`);

            setEstadisticasData({
                porcentajeActual: porcentajeComparativa,
                porcentajeAnterior: 0,
                riesgoGastos,
                proyeccionAhorro
            });

        }
    }, [gastos, salarioMensual]);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-10">
                <div className="bg-linear-to-t from-sky-200 to-indigo-200 shadow-xl rounded-2xl p-6 mb-6 flex flex-col items-center">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Total gastos</h2>
                    <p className="text-4xl font-bold text-red-600">
                        ${totalGastosCalculado.toLocaleString()}
                    </p>
                </div>

                <div className="overflow-x-auto rounded-2xl shadow-lg border bg-linear-to-t from-sky-200 to-indigo-200  border-gray-200">
                    <table className="min-w-full table-auto text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Fecha</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Importe</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Concepto</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Clasificación</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(gastos) && gastos.length > 0 ? (
                                gastos.map((gasto) => (
                                    <tr key={gasto._id} className="border-b hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {gasto.fecha ? new Date(gasto.fecha).toLocaleDateString('es-ES') : "-"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {gasto.monto ? `$${parseFloat(gasto.monto).toFixed(2)}` : "-"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {gasto.nombre ? gasto.nombre : "-"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{gasto.categoria}</td>
                                        <td className="px-6 py-4 text-sm flex gap-3">
                                            <button
                                                onClick={() => handleEditar(gasto)}
                                                className="text-blue-600 hover:text-blue-800 transition font-medium"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => eliminarGasto(gasto._id)}
                                                className="text-red-600 hover:text-red-800 transition font-medium"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr key="no-gastos">
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                        No hay gastos registrados
                                    </td>
                                </tr>
                            )
                            }
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 mt-10">
                    <div className="flex-1 bg-linear-to-t from-sky-200 to-indigo-200  p-8 rounded-2xl shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            {editando ? "Editar gasto" : "Agregar gasto"}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <input
                                type="date"
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                                className="p-4 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                            <input
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Concepto"
                                className="p-4 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                            <input
                                value={monto}
                                onChange={(e) => setMonto(e.target.value)}
                                placeholder="Importe"
                                type="number"
                                className="p-4 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                            <select
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                                className="p-4 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            >
                                <option value="General">General</option>
                                <option value="Hogar">Hogar</option>
                                <option value="Transporte">Transporte</option>
                                <option value="Alimentación">Alimentación</option>
                                <option value="Ocio">Ocio</option>
                                <option value="Viajes">Viajes</option>
                            </select>
                            <button
                                onClick={editando ? handleGuardarEdicion : handleAgregar}
                                className="sm:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl shadow-md transition duration-300 font-semibold"
                            >
                                {editando ? "Guardar cambios" : "Agregar gasto"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}