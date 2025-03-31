
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Authentication store to manage user state
 * @type {import('zustand').StoreApi<{
 *   user: null | {
 *     _id: string, 
 *     name: string, 
 *     email: string, 
 *     phone: string,
 *     type: string,
 *     address: {
 *       street?: string,
 *       city?: string,
 *       state?: string,
 *       zipCode?: string,
 *       country?: string
 *     },
 *     profileImage?: string,
 *     skills?: string[],
 *     rating?: number,
 *     ratingCount?: number,
 *     brokerId?: string,
 *     token: string
 *   },
 *   setUser: (user: any) => void,
 *   logout: () => void
 * }>}
 */
const useUserStore = create(
  persist(
    (set) => ({
      user: null,

      setUser: (user) => set({ user }),

    
    }),
    {
      name: 'cwb_user', 
      partialize: (state) => ({ 
        user: state.user 
      }),
    }
  )
);

export default useUserStore;
