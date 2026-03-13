import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react'; // <--- Importación de tipo por separado
import api from '../api/axios';

// Definimos qué datos tiene un usuario
interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Al cargar la web, preguntamos al backend si hay una cookie válida
  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await api.get('/api/me'); // Endpoint que verifica la sesión
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = (userData: User) => setUser(userData);
  const logout = () => {
    api.post('/api/logout'); // Avisamos al backend para borrar la cookie
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};