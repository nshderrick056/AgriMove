import { createContext, useContext, useState, useCallback } from "react";
import type { Language, LoginTab, Page } from "../data/mockData";

// ── Auth types ────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: "FARMER" | "TRANSPORTER" | "ADMIN";
}

// ── Context type ──────────────────────────────────────────────────────────────
interface AppContextType {
  // Navigation
  page: Page;
  setPage: (p: Page) => void;
  loginTab: LoginTab;
  goToLogin: (tab?: LoginTab) => void;

  // Auth
  token: string | null;
  user: AuthUser | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;

  // Language
  language: Language;
  setLanguage: (l: Language) => void;
}

const AppContext = createContext<AppContextType | null>(null);

// ── Helper ────────────────────────────────────────────────────────────────────
function getInitialPage(u: AuthUser | null): Page {
  if (!u) return "landing";
  const rolePageMap: Record<string, Page> = {
    FARMER: "farmer",
    TRANSPORTER: "driver",
    ADMIN: "admin",
  };
  return rolePageMap[u.role] ?? "landing";
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [loginTab, setLoginTab] = useState<LoginTab>("login");
  const [language, setLanguage] = useState<Language>("en");

  // Restore token/user from localStorage on first mount
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("agrimove_token")
  );
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem("agrimove_user");
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  });

  const [page, setPage] = useState<Page>(() => getInitialPage(user));

  const goToLogin = (tab: LoginTab = "login") => {
    setLoginTab(tab);
    setPage("login");
  };

  const login = useCallback((newToken: string, newUser: AuthUser) => {
    localStorage.setItem("agrimove_token", newToken);
    localStorage.setItem("agrimove_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);

    // Route to the correct dashboard based on role
    const rolePageMap: Record<string, Page> = {
      FARMER: "farmer",
      TRANSPORTER: "driver",
      ADMIN: "admin",
    };
    setPage(rolePageMap[newUser.role] ?? "landing");
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("agrimove_token");
    localStorage.removeItem("agrimove_user");
    setToken(null);
    setUser(null);
    setPage("landing");
  }, []);

  return (
    <AppContext.Provider
      value={{
        page,
        setPage,
        loginTab,
        goToLogin,
        token,
        user,
        login,
        logout,
        language,
        setLanguage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
