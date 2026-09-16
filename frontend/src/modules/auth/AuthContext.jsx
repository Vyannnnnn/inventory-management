import { createContext, useContext, useMemo, useState } from 'react';
import { api } from '../../shared/api';

const AuthContext = createContext(null);

const STORAGE_KEY = 'inventory-auth';

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { token: null, user: null };
  });

  const login = async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    const nextSession = { token: response.data.token, user: response.data.user };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSession({ token: null, user: null });
  };

  const value = useMemo(
    () => ({
      token: session.token,
      user: session.user,
      login,
      logout,
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
