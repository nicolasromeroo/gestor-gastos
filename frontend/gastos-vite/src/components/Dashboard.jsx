
import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Gastos from "./Gastos.jsx";
import Sueldo from "./Sueldos.jsx";
import Estadisticas from "./Estadisticas.jsx";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from "chart.js";
import Logout from "./Logout.jsx";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

export default function Dashboard() {
    const [sueldos, setSueldos] = useState([]);
    const [sueldoDelMesActual, setSueldoDelMesActual] = useState(null);
    const [gastos, setGastos] = useState([]);
    const [restante, setRestante] = useState(0);
    const [estadisticasData, setEstadisticasData] = useState({});

    const token = localStorage.getItem("token");
    const decoded = token ? jwtDecode(token) : null;
    const userId = decoded?.id;

    useEffect(() => {
        if (token && userId) {
            axios
                .get("https://gestor-gastos.onrender.com/api/sueldos/getSueldos", {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => {
                    console.log("Sueldos recibidos:", res.data);
                    const sueldosDelUsuario = res.data.filter(
                        (sueldo) => sueldo.usuarioId === userId
                    );
                    setSueldos(sueldosDelUsuario);

                    const hoy = new Date();

                    const mesActual = hoy.toLocaleString('es-ES', { month: 'long' });
                    const mesCapitalizado = mesActual.charAt(0).toUpperCase() + mesActual.slice(1);
                    const anioActual = hoy.getFullYear();
                    const mesAnioActual = `${mesCapitalizado} ${anioActual}`;

                    const sueldoActual = sueldosDelUsuario.find((sueldo) => {
                        return sueldo.mes.toLowerCase().trim() === mesAnioActual.toLowerCase().trim();
                    });

                    console.log("Sueldo del mes actual:", sueldoActual);

                    if (sueldoActual) {
                        setSueldoDelMesActual(sueldoActual);
                    } else {
                        setSueldoDelMesActual(null);
                    }
                })
                .catch((err) => console.error("Error al traer sueldos:", err));
        }
    }, [token, userId]);

    function agruparGastosPorCategoria(gastos) {
        if (!gastos || gastos.length === 0) return [];
        return gastos.reduce((acc, gasto) => {
            const categoria = gasto.categoria || 'General';
            acc[categoria] = (acc[categoria] || 0) + gasto.monto;
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

    useEffect(() => {
        if (sueldoDelMesActual) {
            const totalGastos = gastos.reduce((acc, gasto) => acc + Number(gasto.monto), 0);
            const restante = Number(sueldoDelMesActual.monto) - totalGastos;
            setRestante(restante);
        }
    }, [gastos, sueldoDelMesActual]);

    const totalGastos = gastos.reduce((acc, gasto) => acc + Number(gasto.monto), 0);
    const cantidadGastos = gastos.length;
    const gastoPromedio = cantidadGastos > 0 ? totalGastos / cantidadGastos : 0;

    useEffect(() => {
        const fetchGastos = async () => {
            if (!token || !userId) {
                console.log("Token o userId no disponibles.");
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8080/api/gastos/getGasto/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const gastos = response.data;
                if (gastos.length > 0) {
                    const hoy = new Date();
                    const mesActual = hoy.getMonth();
                    const anioActual = hoy.getFullYear();

                    const mesPasado = mesActual === 0 ? 11 : mesActual - 1;
                    const anioMesPasado = mesActual === 0 ? anioActual - 1 : anioActual;

                    const gastosMesActual = gastos.filter(g => {
                        const fecha = new Date(g.fecha);
                        return fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual;
                    });

                    const gastosMesPasado = gastos.filter(g => {
                        const fecha = new Date(g.fecha);
                        return fecha.getMonth() === mesPasado && fecha.getFullYear() === anioMesPasado;
                    });

                    const totalMesActual = gastosMesActual.reduce((acc, g) => acc + Number(g.monto), 0);
                    const totalMesPasado = gastosMesPasado.reduce((acc, g) => acc + Number(g.monto), 0);

                    setEstadisticasData({
                        gastoActual: totalMesActual,
                        gastoAnterior: totalMesPasado,
                        riesgoGastos: [],
                        proyeccionAhorro: sueldoDelMesActual ? sueldoDelMesActual.monto - totalMesActual : 0,
                    });
                }
            } catch (error) {
                console.error("Error al obtener gastos:", error);
            }
        };

        fetchGastos();
    }, [token, userId, sueldoDelMesActual]);

    return (
        <>
            <div className="bg-linear-to-t from-sky-500 to-indigo-500">
                <div className="pt-3 pl-5">
                    <Logout />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-4">
                    {/* sueldos */}
                    <div className="bg-white shadow-xl rounded-2xl p-6 flex flex-col justify-between transition-transform transform hover:-translate-y-2 hover:shadow-2xl hover:bg-gray-50">
                        <h2 className="text-gray-700 text-2xl font-bold mb-4 tracking-tight">Sueldo de este mes</h2>
                        <p className={`text-4xl font-extrabold ${sueldoDelMesActual ? 'text-green-500' : 'text-gray-400'} mb-6`}>
                            {sueldoDelMesActual ? `$${sueldoDelMesActual.monto.toLocaleString()}` : "Ingresá tu sueldo"}
                        </p>
                        <Sueldo />
                    </div>

                    {/* restante */}
                    <div className="bg-white shadow-xl rounded-2xl p-6 flex flex-col justify-between transition-transform transform hover:-translate-y-2 hover:shadow-2xl hover:bg-gray-50">
                        <h2 className="text-gray-700 text-2xl font-bold mb-4 tracking-tight">Restante</h2>
                        <p className="text-4xl font-extrabold text-blue-500 mb-6">
                            ${restante.toLocaleString()}
                        </p>
                        {estadisticasData ? (
                            <Estadisticas data={estadisticasData} />
                        ) : (
                            <p className="text-gray-500">Cargando estadísticas...</p>
                        )}
                    </div>

                    {/* estadísticas y grafico */}
                    <div className="bg-linear-to-t from-bordo-100 to-red-100 shadow-xl rounded-2xl p-6 flex flex-col justify-between transition-transform transform hover:-translate-y-2 hover:shadow-2xl">
                        <div className="mt-6 flex items-center justify-center">
                            <Pie data={datosGrafico()} />
                        </div>
                        <div className="mt-4 space-y-2">
                            <p className="text-white">
                                <span className="font-semibold">Total de gastos:</span> ${totalGastos.toLocaleString()}
                            </p>
                            <p className="text-white">
                                <span className="font-semibold">Cantidad de gastos:</span> {cantidadGastos}
                            </p>
                            <p className="text-white">
                                <span className="font-semibold">Gasto promedio:</span>{" "}
                                ${gastoPromedio.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="p-10">
                    <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 transition-transform transform hover:-translate-y-2 hover:shadow-2xl hover:bg-gray-50">
                        <Gastos
                            gastos={gastos}
                            setGastos={setGastos}
                            sueldoDelMesActual={sueldoDelMesActual}
                            token={token}
                            userId={userId}
                        />
                    </div>
                </div>
            </div>

        </>
    );


}
