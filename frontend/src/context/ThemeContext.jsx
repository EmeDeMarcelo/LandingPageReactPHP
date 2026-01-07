// src/context/ThemeContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import { apiFetch } from "../lib/api";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [activeTheme, setActiveTheme] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar tema activo al iniciar
  useEffect(() => {
    const loadActiveTheme = async () => {
      try {
        const res = await apiFetch("/theme/active.php");
        if (res?.data) {
          setActiveTheme(res.data);
        }
      } catch (err) {
        console.error("Error cargando tema activo:", err);
      } finally {
        setLoading(false);
      }
    };
    loadActiveTheme();
  }, []);

  const value = { activeTheme, setActiveTheme, loading };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Hook para usar el context fácilmente
export const useTheme = () => useContext(ThemeContext);
