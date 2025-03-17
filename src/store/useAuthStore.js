
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Authentication store to manage user state
 * @type {import('zustand').StoreApi<{
 *   user: null | {id: string, email: string, name?: string, school?: string, schoolID?: string, adminID?: string, userId?: string},
 *   setUser: (user: any) => void,
 *   logout: () => void
 * }>}
 */
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
        user: state.user 
      }),
    }
  )
);

export default useAuthStore;
