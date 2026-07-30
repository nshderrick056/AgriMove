import { createContext, useContext, useState, useCallback } from "react";
import type { LoginTab, Page } from "../data/mockData";

// ── Auth types ────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: "FARMER" | "TRANSPORTER" | "ADMIN";
  status?: string;
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
}

const AppContext = createContext<AppContextType | null>(null);

// ── Helper ────────────────────────────────────────────────────────────────────
function getInitialPage(u: AuthUser | null): Page {
  // If the URL contains a password reset token, always go to login page
  if (window.location.hash.includes("reset-password")) return "login";
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

    // Reset URL hash so user lands on main Dashboard tab (index 0) upon login
    if (window.location.hash) {
      try {
        history.replaceState("", document.title, window.location.pathname + window.location.search);
      } catch {
        window.location.hash = "";
      }
    }

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

    // Reset URL hash upon logout
    if (window.location.hash) {
      try {
        history.replaceState("", document.title, window.location.pathname + window.location.search);
      } catch {
        window.location.hash = "";
      }
    }

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
