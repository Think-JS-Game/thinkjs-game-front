import React, { createContext, useContext, useState, useEffect } from "react";
import { P, D } from "@/data/colors";

interface ThemeCtxShape {
  isDark: boolean;
  toggle: () => void;
}

export const ThemeCtx = createContext<ThemeCtxShape>({ isDark: false, toggle: () => {} });

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("thinkjs-theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  const toggle = () => {
    setIsDark((d) => {
      const next = !d;
      localStorage.setItem("thinkjs-theme", next ? "dark" : "light");
      return next;
    });
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <ThemeCtx.Provider value={{ isDark, toggle }}>
      <div className={`min-h-screen font-sans transition-colors duration-300 ${isDark ? "dark" : ""}`}>
        {children}
      </div>
    </ThemeCtx.Provider>
  );
};

export const useTheme = () => useContext(ThemeCtx);
export const useC = () => {
  const { isDark } = useTheme();
  return isDark ? D : P;
};
