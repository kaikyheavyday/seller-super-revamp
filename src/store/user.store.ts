import { IAuthResponseUserProfile } from "@/interfaces/auth/auth.response.interface";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface IMerchantData {
  merchantId: number;
  merchantUuid: string;
  merchantSlug: string;
}

interface IStoreStateUser {
  user: IAuthResponseUserProfile | null;
  setUser: (user: IAuthResponseUserProfile | null) => void;
  merchant: IMerchantData | null;
  setMerchant: (merchant: IMerchantData | null) => void;
  clearStore: () => void;
}

export const useUserStore = create<IStoreStateUser>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      merchant: null,
      setMerchant: (merchant) => set({ merchant }),
      clearStore: () => set({ user: null, merchant: null }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
