import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserCnt {
  year: number;
  value: number;
}


interface Store {
  sellingPrice: number;
  totalPrice: number;
  sgnaExpenses?: number;       /* 판관비 계 */
  totalMarketPrice?: number;   /* 시가총액 */
  selectedIndustry?: string;
  yearUserCnt?: UserCnt[];   /* 거래발생 수 */
  sgaExpensesItem?: ICostItem[];  /* 판관비 항목 */
  sgnaExpensesIncreaseRateItem?: ICostItem[];  /* 판관비 항목 */
  //sgnaExpensesIncreaseRate?: number;       /* 판관비 계(인상율) */
  
  setSellingPrice: (data: number) => void;
  removeSellingPrice: () => void;

  setTotalPrice: (data: number) => void;
  removeTotalPrice: () => void;

  setSgnaExpenses: (data: number) => void;
  removeSgnaExpenses: () => void;

  //setSgnaExpensesIncreaseRate: (data: number) => void;
  //removeSgnaExpensesIncreaseRate: () => void;

  setTotalMarketPrice: (data: number) => void;
  removeTotalMarketPrice: () => void;
  
  setSelectedInductry: (data: string) => void;
  removeSelectedInductry: () => void;

  setYearUserCnt: (data: UserCnt[]) => void;
  removeYearUserCnt: () => void;

  setSgaExpensesItem: (data: ICostItem[]) => void;
  removeSgaExpensesItem: () => void;

  setSgnaExpensesIncreaseRateItem: (data: ICostItem[]) => void;
  removeSgnaExpensesIncreaseRateItem: () => void;
}

const useIdeaPriceStore = create<Store>((set) => ({
  sellingPrice: 0,
  totalPrice: 0,
  sgnaExpenses: 0,
  //sgnaExpensesIncreaseRate:0,
  totalMarketPrice: 0,
  selectedIndustry: "",
  yearUserCnt:[],
  sgaExpensesItem:[],
  sgnaExpensesIncreaseRateItem:[],

  setSellingPrice: (data) => set({ sellingPrice: data }),
  removeSellingPrice: () => set({ sellingPrice: 0 }),

  setTotalPrice: (data) => set({ totalPrice: data }),
  removeTotalPrice: () => set({ totalPrice: 0 }),

  setSgnaExpenses: (data) => set({ sgnaExpenses: data }),
  removeSgnaExpenses: () => set({ sgnaExpenses: 0 }),

  //setSgnaExpensesIncreaseRate: (data) => set({ sgnaExpensesIncreaseRate: data }),
  //removeSgnaExpensesIncreaseRate: () => set({ sgnaExpensesIncreaseRate: 0 }),

  setTotalMarketPrice: (data) => set({ totalMarketPrice: data }),
  removeTotalMarketPrice: () => set({ totalMarketPrice: 0 }),

  setSelectedInductry: (data) => set({ selectedIndustry: data }),
  removeSelectedInductry: () => set({ selectedIndustry: "" }),

  setYearUserCnt: (data) => set({ yearUserCnt: data  }),
  removeYearUserCnt: () => set({ yearUserCnt: [] }),

  setSgaExpensesItem: (data) => set({ sgaExpensesItem: data  }),
  removeSgaExpensesItem: () => set({ sgaExpensesItem: [] }),

  setSgnaExpensesIncreaseRateItem: (data) => set({ sgnaExpensesIncreaseRateItem: data  }),
  removeSgnaExpensesIncreaseRateItem: () => set({ sgnaExpensesIncreaseRateItem: [] }),
}));

export default useIdeaPriceStore;
