import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react'; // <--- Importación de tipo por separado
import api from '../api/axios';

// Definimos qué datos tiene un usuario
interface User {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  username?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_STORAGE_KEY = 'agripres-auth-user';

const normalizeUser = (userData: User): User => ({
  ...userData,
  isAdmin: userData.isAdmin === true || userData.username === 'admin',
});

const getStoredUser = (): User | null => {
  const storedUser = sessionStorage.getItem(AUTH_STORAGE_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return normalizeUser(JSON.parse(storedUser) as User);
  } catch {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [loading, setLoading] = useState(true);

  // Al cargar la web, preguntamos al backend si hay una cookie válida
  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await api.get('/api/me'); // Endpoint que verifica la sesión
        if (res.data?.user) {
          const normalizedUser = normalizeUser(res.data.user);
          setUser(normalizedUser);
          sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(normalizedUser));
        }
      } catch {
        // Si el backend no expone sesión por cookie, mantenemos la sesión del navegador.
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = (userData: User) => {
    const normalizedUser = normalizeUser(userData);
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(normalizedUser));
    setUser(normalizedUser);
  };
  const logout = async () => {
    try {
      await api.post('/api/logout'); // Avisamos al backend para borrar la cookie
    } catch {
      // Aunque falle el backend, cerramos la sesión local para bloquear el acceso en frontend.
    } finally {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
    }
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