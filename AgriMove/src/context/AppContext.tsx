import { createContext, useContext, useState } from "react";
import type { Language, LoginTab, Page } from "../data/mockData";

interface AppContextType {
  page: Page;
  setPage: (p: Page) => void;
  loginTab: LoginTab;
  goToLogin: (tab?: LoginTab) => void;
  language: Language;
  setLanguage: (l: Language) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [page, setPage] = useState<Page>("landing");
  const [loginTab, setLoginTab] = useState<LoginTab>("login");
  const [language, setLanguage] = useState<Language>("en");

  const goToLogin = (tab: LoginTab = "login") => {
    setLoginTab(tab);
    setPage("login");
  };

  return (
    <AppContext.Provider value={{ page, setPage, loginTab, goToLogin, language, setLanguage }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
