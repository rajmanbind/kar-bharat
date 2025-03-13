
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,

      setUser: (user) => set({ user }),

      logout: () => {
        set({ user: null });
      },
    }),
    {
      name: 'aqua_user', // Key used to store data in localStorage
      partialize: (state) => ({ user: state.user }), // Only persist the user field
    }
  )
);

export default useAuthStore;
