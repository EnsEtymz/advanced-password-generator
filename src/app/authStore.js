import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      token: null, // Başlangıçta null
      setToken: (newToken) => set({ token: newToken }),
      clearToken: () => set({ token: null }),
    }),
    {
      name: "auth-storage", // localStorage'da kaydedilecek isim
    }
  )
);

export default useAuthStore;
