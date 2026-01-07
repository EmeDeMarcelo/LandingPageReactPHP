import { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function login(email, password) {
    const data = await apiFetch('/auth/login.php', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    setUser(data.user);
    return data;
  }

  async function logout() {
    await apiFetch('/auth/logout.php', { method: 'POST' });
    setUser(null);
  }

  async function checkAuth() {
    try {
      const data = await apiFetch('/auth/me.php');
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  // useEffect(() => {
  //   checkAuth();
  // }, []);
  useEffect(() => {
  if (window.location.pathname.startsWith("/admin")) {
    checkAuth();
  } else {
    setLoading(false); // MUY IMPORTANTE
  }
}, []);


  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
