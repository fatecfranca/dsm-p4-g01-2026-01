import { createContext, useContext, useState } from 'react';
import { setToken as setApiToken } from '../services/api';
import { login as apiLogin, cadastro as apiCadastro } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading] = useState(false);

  async function login(email, senha) {
    const data = await apiLogin(email, senha);
    setApiToken(data.token);
    setToken(data.token);
    setUser(data.usuario);
    return data;
  }

  async function cadastro(nome, email, senha) {
    const data = await apiCadastro(nome, email, senha);
    return data;
  }

  async function logout() {
    setApiToken(null);
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
