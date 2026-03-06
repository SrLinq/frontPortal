import { create } from "zustand";

interface AuthState {
  role: "student" | "business" | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (role: "student" | "business", token: string) => void;
  logout: () => void;
  setRole: (role: "student" | "business") => void;
}

// Helper to reliably get token from localStorage on initial load
const getInitialToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};

// Helper to reliably get role from localStorage on initial load
const getInitialRole = (): "student" | "business" | null => {
  if (typeof window !== "undefined") {
    const role = localStorage.getItem("authRole");
    if (role === "student" || role === "business") {
      return role;
    }
  }
  return null;
};

export const useAuthStore = create<AuthState>((set) => ({
  role: getInitialRole(),
  token: getInitialToken(),
  isAuthenticated: !!getInitialToken(),

  login: (role, token) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("authRole", role);
    set({ role, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authRole");
    set({ role: null, token: null, isAuthenticated: false });
    window.location.href = "/";
  },

  setRole: (role) => {
    localStorage.setItem("authRole", role);
    set({ role, isAuthenticated: true });
  },
}));
