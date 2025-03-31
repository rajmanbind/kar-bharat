import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
      (set) => ({
        token: null,
  
        setToken: (token) => set({ token }),
        logout: (token) => set({ token:null }),
  
      
      }),
      {
        name: 'cwb_token', 
        partialize: (state) => ({ 
          token: state.token 
        }),
      }
    )
  );
  
  export default useAuthStore;
  