
// CON NAVBAR
// import React, { useState, useEffect } from "react";
// import './assets/styles/tailwind.css'
// import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import 'aos/dist/aos.css';
// import AOS from 'aos';

// import Sueldos from "./components/Sueldos.jsx";
// import Gastos from "./components/Gastos.jsx";
// import Estadisticas from "./components/Estadisticas.jsx";
// import Login from "./components/Login.jsx";
// import Register from "./components/Register.jsx"
// import Dashboard from "./components/Dashboard.jsx";
// import Logout from "./components/Logout.jsx";

// export default function App() {
//   return (
//     <Router>
//       <div className="min-h-screen bg-gray-100">
//         <nav className="bg-blue-600 text-white p-4 shadow">
//           <ul className="flex gap-4">
//             <li><Link to="/">Inicio</Link></li>
//             {/* <Route path="/" element={<Dashboard />} /> */}
//             <li><Link to="/dashboard">Dashboard</Link></li>
//             <li><Link to="/sueldo">Sueldo</Link></li>
//             <li><Link to="/gastos">Gastos</Link></li>
//             <li><Link to="/estadisticas">Estadísticas</Link></li>
//             <li><Link to="/login">Login</Link></li>
//             <li><Link to="/logout">Logout</Link></li>
//             <li><Link to="/register">Registro</Link></li>
//           </ul>
//         </nav>

//         <div className="p-4">
//           <Routes>
//             <Route path="/" element={<h1 className="text-2xl">Gestor de gastos</h1>} />
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/sueldo" element={<Sueldos />} />
//             <Route path="/gastos" element={<Gastos />} />
//             <Route path="/estadisticas" element={<Estadisticas />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/logout" element={<Logout />} />
//             <Route path="/register" element={<Register />} />
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   );
// }

// SIN NAVBAR
import React, { useState, useEffect } from "react";
import './assets/styles/tailwind.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import 'aos/dist/aos.css';
import AOS from 'aos';

import Sueldos from "./components/Sueldos.jsx";
import Gastos from "./components/Gastos.jsx";
import Estadisticas from "./components/Estadisticas.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Logout from "./components/Logout.jsx";
import Home from "./components/Home.jsx";

export default function App() {
  const [sueldos, setSueldos] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
        {/* <div className="flex gap-4 p-4">
          <Link to="/login">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none">
              Iniciar sesión
            </button>
          </Link>
          <Link to="/register">
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none">
              Registrarse
            </button>
          </Link>
          <Link to="/logout">
            <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none">
              Cerrar sesión
            </button>
          </Link>
        </div> */}

        <div className="bg-black">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sueldo" element={<Sueldos />} />
            <Route path="/gastos" element={<Gastos />} />
            <Route path="/estadisticas" element={<Estadisticas />} />

            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={
              <Logout
                setSueldos={setSueldos}
                setGastos={setGastos}
                setUserId={setUserId}
                setToken={setToken}
              />
            } />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
