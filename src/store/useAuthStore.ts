
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
      // Fixed partialize function to return only the user field as a partial state
      // that conforms to the AuthState type
      partialize: (state) => ({ 
        user: state.user,
        setUser: state.setUser,
        logout: state.logout
      }),
    }
  )
);

export default useAuthStore;
