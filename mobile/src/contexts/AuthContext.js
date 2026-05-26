import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as apiLogin, cadastro as apiCadastro } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const storedToken = await AsyncStorage.getItem('@ecosense_token');
        const storedUser = await AsyncStorage.getItem('@ecosense_user');
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function login(email, senha) {
    const data = await apiLogin(email, senha);
    await AsyncStorage.setItem('@ecosense_token', data.token);
    await AsyncStorage.setItem('@ecosense_user', JSON.stringify(data.usuario));
    setToken(data.token);
    setUser(data.usuario);
    return data;
  }

  async function cadastro(nome, email, senha) {
    const data = await apiCadastro(nome, email, senha);
    return data;
  }

  async function logout() {
    await AsyncStorage.removeItem('@ecosense_token');
    await AsyncStorage.removeItem('@ecosense_user');
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, cadastro, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
