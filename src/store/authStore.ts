import { create } from "zustand";

interface User {
  id?: string;
  email?: string;
  role?: "student" | "business" | "employer";
  userInfo?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: "student" | "business" | "employer";
  };
  userProfile?: {
    course?: string;
    skills?: string[];
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

// Helper to reliably get token from localStorage on initial load
const getInitialToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null, // Initially null, we'll fetch details if token exists
  token: getInitialToken(),
  isAuthenticated: !!getInitialToken(),

  login: (user, token) => {
    localStorage.setItem("authToken", token);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("authToken");
    set({ user: null, token: null, isAuthenticated: false });
    // Optional: force clear any cached data or redirect
    window.location.href = "/";
  },

  setUser: (user) => {
    set({ user, isAuthenticated: true });
  },
}));
