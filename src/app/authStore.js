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

const useExpireStore = create(
  persist(
    (set) => ({
      isState:  false,
      setState: (newState) => set({ isState: newState }),
    }),
    {
      name: "isState", // localStorage'da kaydedilecek isim
    }
  )
);

const useLoginModalStore = create((set) => ({
  loginModalState: false,
  setLoginModalState: (newState) => set({ loginModalState: newState }),
}));


export { useAuthStore, useExpireStore, useLoginModalStore };
