
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,

      setUser: (user) => set({ user }),

      logout: () => {
        set({ user: null });
      },
    }),
    {
      name: 'aqua_user', // Key used to store data in localStorage
      partialize: (state) => ({ 
        user: state.user,
        setUser: state.setUser,
        logout: state.logout
      }),
    }
  )
);

export default useAuthStore;
