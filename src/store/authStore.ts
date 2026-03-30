/**
 * Authentication Store (Zustand)
 * Manages client-side authentication state with localStorage persistence.
 * Stores the JWT token and user role, which are used by the API layer
 * to attach Authorization headers to outbound requests.
 */
import { create } from "zustand";

interface AuthState {
  /** Current user role: 'student', 'business', or null if not authenticated */
  role: "student" | "business" | null;
  /** JWT access token for API authentication */
  token: string | null;
  /** Whether the user is currently logged in */
  isAuthenticated: boolean;
  /** Store JWT and role after successful login/registration */
  login: (role: "student" | "business", token: string) => void;
  /** Clear auth state and redirect to home */
  logout: () => void;
  /** Update the stored role without affecting the token */
  setRole: (role: "student" | "business") => void;
}

/** Read persisted token from localStorage on initial app load */
const getInitialToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};

/** Read persisted role from localStorage on initial app load */
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
    // Persist to localStorage so auth survives page refresh
    localStorage.setItem("authToken", token);
    localStorage.setItem("authRole", role);
    set({ role, token, isAuthenticated: true });
  },

  logout: () => {
    // Clear persisted auth data
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
