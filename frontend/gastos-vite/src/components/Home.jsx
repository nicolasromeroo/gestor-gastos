
import React, { useEffect } from 'react';
import { ReactTyped } from 'react-typed';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link } from 'react-router-dom';
// import ThemeToggle from './ThemeToggle.jsx';
// import '../assets/styles/tailwind.css';

export default function Home() {
    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    return (

        <div className="text-center py-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white dark:from-gray-900 dark:to-black">
            {/* <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div> */}

            <h1 className="text-5xl font-bold mb-4">
                <ReactTyped
                    strings={['Bienvenido a tu gestor de gastos', 'Controlá tu sueldo fácilmente']}
                    typeSpeed={50}
                    backSpeed={30}
                    loop
                />
            </h1>
            <p className="text-lg mb-8">Organiza tus sueldos, gastos y estadísticas en un solo lugar.</p>

            <div className="flex justify-center gap-4">
                <Link to="/login">
                    <button className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700">Iniciar sesión</button>
                </Link>
                <Link to="/register">
                    <button className="bg-green-600 px-6 py-2 rounded hover:bg-green-700">Registrarse</button>
                </Link>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
                <div data-aos="fade-up" className="bg-white dark:bg-gray-800 rounded shadow p-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Sueldos</h3>
                    <p className="text-gray-600 dark:text-gray-300">Gestiona tus ingresos mensuales fácilmente.</p>
                </div>
                <div data-aos="fade-up" data-aos-delay="100" className="bg-white dark:bg-gray-800 rounded shadow p-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Gastos</h3>
                    <p className="text-gray-600 dark:text-gray-300">Registra tus gastos y mantén el control.</p>
                </div>
                <div data-aos="fade-up" data-aos-delay="200" className="bg-white dark:bg-gray-800 rounded shadow p-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Estadísticas</h3>
                    <p className="text-gray-600 dark:text-gray-300">Visualiza gráficos claros de tus finanzas.</p>
                </div>
            </div>
        </div>
    );
}
