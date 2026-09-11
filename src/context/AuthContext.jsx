import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("nexus_token");
    if (!token) { setLoading(false); return; }

    api.get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem("nexus_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("nexus_token", res.data.token);
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const res = await api.post("/auth/register", payload);
    localStorage.setItem("nexus_token", res.data.token);
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("nexus_token");
    setUser(null);
  }, []);

  const updateLocalUser = useCallback((partial) => {
    setUser((prev) => (prev ? { ...prev, ...partial } : prev));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateLocalUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
