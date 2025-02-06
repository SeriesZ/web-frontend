import { create } from "zustand";
import { defaultCostData, defaultYearData, defaultPriceData } from "./financeDefaultData"; 

// ICostData 타입 정의
export interface ICostData {
  direct_material: number;
  direct_expense: number;
  direct_labor: number;
  manufacturing_cost: number;
  profit_rate: number;
  sale_price: number;
  salary: number;
  office_rent: number;
  ad_cost: number;
  business_expense: number;
  maintenance_cost: number;
  contingency: number;
  total_expense: number;
  salary_increase_rate: number;
  office_rent_increase_rate: number;
  ad_cost_increase_rate: number;
  business_expense_increase_rate: number;
  maintenance_cost_increase_rate: number;
  contingency_increase_rate: number;
  trade_counts: number[];
  employee_counts: number[];
  par_value: number;
  mean_revenue: number;
  target_investor_rate: number;
  max_investor_count: number;
  max_invest_per: number;
  id?:string;
  total_stock_cnt?:number;
  number_shares_per_share?:number;
  target_investor_amt?:number;
  investor_shares_total_shares?:number;
  min_investor_count?:number;
}

// ICostItem 타입 정의
export interface ICostInputItem {
  id: number;
  name: string;
  amount: number;
  description?: string;
  apiId: keyof ICostData;
  formPath: string;
  focus?:boolean;
  strType?:string;
  inputYn?:string;
  toolTip?:number;
}

// YearData 타입 정의
export interface YearData {
  transactionCount: number;
  staffCount: number;
  sales: number;
  salesCost: number;
  grossProfit: number;
  salary: number;
  businessPromotionCost: number;
  officeRent: number;
  entertainmentExpenses: number;
  advertisingCost: number;
  contingencyExpenses: number;
  adminExpenses: number;
  operatingIncome: number;
  operatingIncomeRate: number;
  calSalesTotalProfit?:number;
  calMarketCap?:number;
  calTotalStockCnt?:number;
  calOwnerShiCnt?:number;
  calValuePerShare?:number;
  calStockValueHeld?:number;
  calExitProfit?:number;
  calTransferTax?:number;
  calFinalProfis?:number;
  calProtitRate?:number;
  calMultiple?:number;
}

// 기본 항목을 ICostItem 배열로 변환
const initialBasicItems: ICostInputItem[] = [
];

// Zustand Store 정의
interface CostStore {
  costData: ICostData;
  basicItems: ICostInputItem[];
  customItems: ICostInputItem[];
  financeCalCulData: YearData;
  setCostData: (data: ICostData) => void;
  setCostDataAll: (data:ICostInputItem[]) => void
  setFinanceCalCulData: (data: YearData) => void;
  addCustomItem: (item: ICostInputItem) => void;
  updateItemAmount: (apiId: string, amount: number) => void;
  getAmountByApiId: (apiId: string) => number | 0;
  setCostDataFromServer: (serverData: ICostData & { ideation_id: string }) => void; 
}

export const useFinanceStore = create<CostStore>((set, get) => ({
  costData: defaultCostData,
  basicItems: initialBasicItems,
  customItems: [],
  financeCalCulData: defaultYearData,

  setCostData: (data) =>
    set({
      costData: data,
      basicItems: initialBasicItems.map((item) => {
        const value = data[item.apiId];
        return {
          ...item,
          amount: typeof value === "number" ? value : 0,
        };
      }),
    }),

  setCostDataAll: (data) =>
    set(() => ({
      customItems: data,
    })),

  setFinanceCalCulData: (data) =>
    set(() => ({
      financeCalCulData: data,
    })),

  addCustomItem: (item) =>
    set((state) => ({
      customItems: [...state.customItems, item],
    })),

  updateItemAmount: (apiId: string, amount: number) =>
    set((state) => {
        if (apiId in state.costData) {
        const key = apiId as keyof ICostData;
        return {
            ...state,
            costData: {
            ...state.costData,
            [key]: amount,
            },
        };
        }
        return state;
    }),

  getAmountByApiId: (apiId: string) => {
    const item = get().customItems.find((item) => item.apiId === apiId);
    return item ? item.amount : 0;
  },

  // 서버 데이터를 기반으로 costData 및 basicItems를 업데이트하는 메서드
  setCostDataFromServer: (serverData: ICostData & { ideation_id: string }) =>
    set((state) => {
      // 서버 데이터를 기반으로 costData 업데이트
      const updatedCostData: ICostData = {
        ...state.costData,
        ...serverData, // 서버 데이터로 업데이트
      };

      // basicItems 업데이트 (apiId와 매칭되는 amount 설정)
      const updatedBasicItems = defaultPriceData.map((item) => {
        const amount = serverData[item.apiId];
        return {
          ...item,
          amount: typeof amount === "number" ? amount : item.amount,
        };
      });

      return {
        costData: updatedCostData,
        basicItems: updatedBasicItems,
      };
    }),
}));

// 상품가격결정 데이터를 서버로 보내기 위한 작업
interface ServerPayload extends ICostData {
  ideation_id: string; 
}

export const transformDataForServer = (
  items: ICostInputItem[],
  ideationId: string
): ServerPayload => {
  // ICostData의 기본 구조 생성
  const data: ICostData = {
    direct_material: 0,
    direct_expense: 0,
    direct_labor: 0,
    manufacturing_cost: 0,
    profit_rate: 0,
    sale_price: 0,
    salary: 0,
    office_rent: 0,
    ad_cost: 0,
    business_expense: 0,
    maintenance_cost: 0,
    contingency: 0,
    total_expense: 0,
    salary_increase_rate: 0,
    office_rent_increase_rate: 0,
    ad_cost_increase_rate: 0,
    business_expense_increase_rate: 0,
    maintenance_cost_increase_rate: 0,
    contingency_increase_rate: 0,
    trade_counts: [0],
    employee_counts: [0],
    par_value: 0,
    mean_revenue: 0,
    target_investor_rate: 0,
    max_investor_count: 0,
    max_invest_per: 0,
    id:""
  };

  // items 배열을 매핑하여 data를 업데이트
  items.forEach((item) => {
    if (item.apiId in data) {
      if (Array.isArray(data[item.apiId])) {
        // 배열 타입 처리
        (data[item.apiId] as number[])[0] = item.amount;
      } else {
        // number 타입 처리
        (data[item.apiId] as number) = item.amount;
      }
    }
  });

  return {
    ...data,
    ideation_id: ideationId, // 추가적으로 ideation_id 포함
  };
};


export function updatePriceDataFromServer(
  defaultData: ICostInputItem[],
  serverData: Record<string, any>
): ICostInputItem[] {
  // Map through defaultData and update the amount if apiId matches a key in serverData
  return defaultData.map((item) => {
    // Check if the apiId exists as a key in serverData
    if (serverData[item.apiId] !== undefined) {
      return {
        ...item,
        amount: serverData[item.apiId], // Update amount with value from serverData
      };
    }
    // Return the item as-is if there's no matching key
    return item;
  });
}