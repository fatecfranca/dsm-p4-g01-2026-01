import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as apiLogin, cadastro as apiCadastro } from '../services/authService';
import { onUnauthorized } from '../services/api';

const AuthContext = createContext(null);

async function getStored() {
  try {
    const [token, userJson] = await Promise.all([
      AsyncStorage.getItem('token'),
      AsyncStorage.getItem('user'),
    ]);
    if (token && userJson) {
      return { token, user: JSON.parse(userJson) };
    }
  } catch {
    return { token: null, user: null };
  }
  return { token: null, user: null };
}

async function persistAuth(token, user) {
  await AsyncStorage.setItem('token', token);
  await AsyncStorage.setItem('user', JSON.stringify(user));
}

async function clearAuth() {
  await AsyncStorage.multiRemove(['token', 'user']);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await getStored();
      setToken(stored.token);
      setUser(stored.user);
      setReady(true);
    })();
  }, []);

  const login = useCallback(async (email, senha) => {
    const data = await apiLogin(email, senha);
    await persistAuth(data.token, data.usuario);
    setToken(data.token);
    setUser(data.usuario);
    return data;
  }, []);

  const cadastro = useCallback(async (nome, email, senha) => {
    const data = await apiCadastro(nome, email, senha);
    await persistAuth(data.token, data.usuario);
    setToken(data.token);
    setUser(data.usuario);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await clearAuth();
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const unsubscribe = onUnauthorized(() => {
      clearAuth().finally(() => {
        setToken(null);
        setUser(null);
      });
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        ready,
        loading: !ready,
        login,
        cadastro,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
}
