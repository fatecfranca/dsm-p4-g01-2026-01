import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { onUnauthorized } from "../services/api";

const AuthContext = createContext(null);

function getStored() {
  try {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      return { token, user: JSON.parse(user) };
    }
  } catch {
    return { token: null, user: null };
  }
  return { token: null, user: null };
}

export function AuthProvider({ children }) {
  const [{ token, user }, setAuth] = useState(() => {
    const s = getStored();
    return { token: s.token, user: s.user };
  });
  const ready = true;

  const login = useCallback((newToken, newUser) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setAuth({ token: newToken, user: newUser });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({ token: null, user: null });
  }, []);

  useEffect(() => {
    return onUnauthorized(() => {
      logout();
    });
  }, [logout]);

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, login, logout, ready }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve estar dentro de <AuthProvider>");
  return ctx;
}
