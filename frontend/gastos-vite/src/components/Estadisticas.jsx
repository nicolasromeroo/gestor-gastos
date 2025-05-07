import React from "react";
import { motion } from "framer-motion";
import { FaArrowUp, FaArrowDown, FaExclamationTriangle, FaPiggyBank } from "react-icons/fa";

export default function Estadisticas({ data }) {
    console.log("data stats:", data);

    const {
        gastoActual,
        gastoAnterior,
        riesgoGastos,
        proyeccionAhorro,
    } = data || {};

    let variacion = null;
    if (
        typeof gastoActual === 'number' &&
        typeof gastoAnterior === 'number' &&
        gastoAnterior > 0
    ) {
        variacion = ((gastoActual - gastoAnterior) / gastoAnterior) * 100;
    }

    const esAumento = variacion !== null && variacion > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-linear-to-t from-sky-200 to-indigo-70 rounded-2xl p-8 w-full max-w-4xl mx-auto"
        >
            <motion.h2
                className="text-3xl font-bold text-gray-800 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                Estadísticas
            </motion.h2>

            <motion.div
                className="mb-8"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                    Comparativa mensual
                </h3>
                {variacion !== null ? (
                    <div className="flex items-center space-x-4">
                        {esAumento ? (
                            <FaArrowUp className="text-red-500 text-3xl" />
                        ) : (
                            <FaArrowDown className="text-green-500 text-3xl" />
                        )}
                        <p className="text-lg text-gray-600">
                            {esAumento
                                ? `Gastaste un ${Math.abs(variacion).toFixed(2)}% más que el mes anterior.`
                                : `Gastaste un ${Math.abs(variacion).toFixed(2)}% menos que el mes anterior.`}
                        </p>
                    </div>
                ) : (
                    <p className="text-lg text-gray-600">
                        No hay datos suficientes para calcular la comparación mensual.
                    </p>
                )}
            </motion.div>

            {/* alertas de gastos (EN PROCESO) */}
            <motion.div
                className="mb-8"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
            >
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                    Alertas de gastos
                </h3>
                {Array.isArray(riesgoGastos) && riesgoGastos.length > 0 ? (
                    <ul className="list-disc ml-6 space-y-2">
                        {riesgoGastos.map((riesgo, idx) => (
                            <motion.li
                                key={idx}
                                className="flex items-center text-red-600"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 + idx * 0.2 }}
                            >
                                <FaExclamationTriangle className="mr-2" />
                                {riesgo}
                            </motion.li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-green-600">
                        ¡No se detectaron riesgos este mes!
                    </p>
                )}
            </motion.div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1 }}
            >
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                    Proyección de ahorro
                </h3>
                <div className="flex items-center space-x-4">
                    <FaPiggyBank className="text-blue-500 text-3xl" />
                    <p className="text-lg text-gray-600">
                        Manteniendo tu ritmo actual, ahorrarías{" "}
                        <strong>
                            $
                            {Number.isFinite(proyeccionAhorro)
                                ? proyeccionAhorro.toLocaleString()
                                : "0"}
                        </strong>{" "}
                        este mes.
                    </p>

                </div>
            </motion.div>
        </motion.div>
    );
}
