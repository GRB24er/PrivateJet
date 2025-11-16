// frontend/src/context/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import * as authApi from "../api/auth.js";
import { setAuthToken } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // On app start: restore token + fetch /api/auth/me
  useEffect(() => {
    const stored = localStorage.getItem("accessToken");
    if (!stored) {
      setInitializing(false);
      return;
    }

    setAuthToken(stored);

    authApi
      .me()
      .then((u) => setUser(u))
      .catch((err) => {
        console.error("auth.me failed:", err?.response?.status, err);
        setAuthToken(null);
        localStorage.removeItem("accessToken");
      })
      .finally(() => setInitializing(false));
  }, []);

  const login = async (payload) => {
    const data = await authApi.login(payload); // { user, accessToken }
    if (data.accessToken) {
      setAuthToken(data.accessToken);
      localStorage.setItem("accessToken", data.accessToken);
    }
    setUser(data.user || null);
    return data;
  };

  const register = async (payload) => {
    const data = await authApi.register(payload);
    if (data.accessToken) {
      setAuthToken(data.accessToken);
      localStorage.setItem("accessToken", data.accessToken);
    }
    setUser(data.user || null);
    return data;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.warn("logout error ignored:", e?.message);
    }
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem("accessToken");
  };

  const value = {
    user,
    isAuthed: !!user,
    initializing,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
