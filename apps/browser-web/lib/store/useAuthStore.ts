import { create } from 'zustand';
import { cloudFetch } from '@/lib/api';

interface User {
  id: string;
  username: string;
  phone?: string;
  name?: string;
  roleId?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  restoreAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null,
  user: null,
  isAuthenticated: false,
  setAuth: (token: string, user: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
    set({ token, user, isAuthenticated: true });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
    set({ token: null, user: null, isAuthenticated: false });
  },
  restoreAuth: async () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    try {
      const res = await cloudFetch(`/api/auth/me`);
      const data = await res.json();
      if (data.success) {
        set({ token, user: data.data, isAuthenticated: true });
      } else {
        // Token invalid
        localStorage.removeItem('auth_token');
        set({ token: null, user: null, isAuthenticated: false });
      }
    } catch (e) {
      // API Offline? Retain token but don't force logout just in case it's network error
      console.error("Auth restore failed:", e);
    }
  }
}));
