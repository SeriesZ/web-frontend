import { create } from "zustand";

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
  face_value: number;
  total_number_shares_issued: number;
  number_shares_per_share: number;
  target_investor_share_ratio: number;
  investor_shares_total_shares: number;
  target_investor_financing_amount: number;
  mimimum_investment_per_persion: number;
  maximum_investment_per_persion: number;
  set_maximum_investors: number;
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
}

// 초기 데이터 설정
const initialCostData: ICostData = {
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
  trade_counts: [],
  employee_counts: [],
  face_value:  0,
  total_number_shares_issued: 0,
  number_shares_per_share:  0,
  target_investor_share_ratio:  0,
  investor_shares_total_shares:  0,
  target_investor_financing_amount:  0,
  mimimum_investment_per_persion:  0,
  maximum_investment_per_persion:  0,
  set_maximum_investors: 0,
};

// 기본 항목을 ICostItem 배열로 변환
const initialBasicItems: ICostInputItem[] = [
];

// Zustand Store 정의
interface CostStore {
  costData: ICostData;
  basicItems: ICostInputItem[];
  customItems: ICostInputItem[];
  setCostData: (data: ICostData) => void;
  addCustomItem: (item: ICostInputItem) => void;
  updateItemAmount: (apiId: string, amount: number) => void;
}

export const useFinanceStore = create<CostStore>((set) => ({
  costData: initialCostData,
  basicItems: initialBasicItems,
  customItems: [],

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

  addCustomItem: (item) =>
    set((state) => ({
      customItems: [...state.customItems, item],
    })),

  updateItemAmount: (apiId: string, amount: number) =>
    set((state) => {
        // apiId가 ICostData의 키에 해당하는지 체크
        if (apiId in state.costData) {
        // 타입 단언을 사용하여 apiId를 keyof ICostData로 변환
        const key = apiId as keyof ICostData;
    
        // 상태 업데이트
        return {
            ...state,
            costData: {
            ...state.costData,
            [key]: amount,
            },
        };
        }
    
        // apiId가 일치하지 않는 경우 상태를 변경하지 않음
        return state;
    }),
}));
