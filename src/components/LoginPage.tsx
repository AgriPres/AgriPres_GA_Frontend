import React, { useState } from 'react';
import api from '../api/axios'; // Importamos la instancia que configuramos
import { useAuth } from '../context/AuthContext.tsx'; // Para actualizar el estado global
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth(); // Función que creamos en el contexto
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1. Enviamos los datos al backend
      const response = await api.post('/api/auth/login', { username, password });

      // 2. Si el backend responde OK, guardamos los datos del usuario en el contexto
      // Nota: La cookie se guarda sola en el navegador, no hay que tocarla aquí.
      login(response.data.user);

      // 3. Redirigimos al usuario al inicio o dashboard
      const isAdmin = response.data?.user?.isAdmin === true || response.data?.user?.username === 'admin';
      navigate(isAdmin ? '/DashboardAdmin' : '/Dashboard');
      
      alert('¡Bienvenido de nuevo!');
    } catch (error: any) {
      console.error('Error en el login:', error);
      alert(error.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form 
        onSubmit={handleSubmit} 
        className="p-8 bg-white shadow-md rounded-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Usuario</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Contraseña</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default LoginPage;