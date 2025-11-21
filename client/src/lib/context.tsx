import { createContext, useContext, useState, ReactNode } from "react";

interface AppContextType {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  notifications: boolean;
  setNotifications: (value: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (value: boolean) => void;
  selectedTheme: string;
  setSelectedTheme: (value: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState("forest");

  const value = {
    darkMode,
    setDarkMode,
    notifications,
    setNotifications,
    soundEnabled,
    setSoundEnabled,
    selectedTheme,
    setSelectedTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppSettings() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppSettings must be used within AppProvider");
  }
  return context;
}
