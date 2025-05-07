
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [form, setForm] = useState({ username: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(form)
            await axios.post("http://localhost:8080/api/auth/register", form);
            navigate("/login");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black">
            <div className="w-full max-w-md bg-gradient-to-b from-gray-800 to-black rounded-xl shadow-md p-8">            <h2 className="text-2xl text-white font-semibold mb-4 text-center">Registro</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        className="text-white w-full px-4 py-2 border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        type="text"
                        name="username"
                        placeholder="Usuario"
                        onChange={handleChange}
                    />
                    <input
                        className="text-white w-full px-4 py-2 border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        onChange={handleChange}
                    />
                    <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                        Registrarse
                    </button>
                </form>
            </div>
        </div>
    );
}
