import { create } from "zustand";
import { login as authLogin, logout as authLogout, isAuthenticated, getSessionToken } from "@/lib/auth";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async (password: string) => {
    set({ isLoading: true, error: null });
    try {
      const success = await authLogin(password);
      if (success) {
        set({ isAuthenticated: true, isLoading: false, error: null });
        return true;
      } else {
        set({ isLoading: false, error: "Invalid password" });
        return false;
      }
    } catch {
      set({ isLoading: false, error: "Login failed. Please try again." });
      return false;
    }
  },
  logout: () => {
    authLogout();
    set({ isAuthenticated: false, error: null });
  },
  checkAuth: () => {
    const authed = isAuthenticated();
    set({ isAuthenticated: authed });
  },
}));
