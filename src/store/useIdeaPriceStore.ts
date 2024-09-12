import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Store {
  sellingPrice?: number;
  totalPrice?: number;
  sgnaExpenses?: number;
  selectedIndustry?: string;
  setSellingPrice: (data: number) => void;
  removeSellingPrice: () => void;
  setTotalPrice: (data: number) => void;
  removeTotalPrice: () => void;
  setSgnaExpenses: (data: number) => void;
  removeSgnaExpenses: () => void;
  setSelectedInductry: (data: string) => void;
  removeSelectedInductry: () => void;
}

const useIdeaPriceStore = create<Store>((set) => ({
  sellingPrice: 0,
  totalPrice: 0,
  sgnaExpenses: 0,
  selectedIndustry: "",
  setSellingPrice: (data) => set({ sellingPrice: data }),
  removeSellingPrice: () => set({ sellingPrice: 0 }),
  setTotalPrice: (data) => set({ totalPrice: data }),
  removeTotalPrice: () => set({ totalPrice: 0 }),
  setSgnaExpenses: (data) => set({ sgnaExpenses: data }),
  removeSgnaExpenses: () => set({ sgnaExpenses: 0 }),
  setSelectedInductry: (data) => set({ selectedIndustry: data }),
  removeSelectedInductry: () => set({ selectedIndustry: "" }),
}));

export default useIdeaPriceStore;
