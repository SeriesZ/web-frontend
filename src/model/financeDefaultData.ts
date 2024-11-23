// default data
import { ICostData, YearData, ICostInputItem } from "./financeType";

// 매출계획표 초기값
export const defaultYearData: YearData = {
  transactionCount: 0,
  staffCount: 0,
  sales: 0,
  salesCost: 0,
  grossProfit: 0,
  salary: 0,
  businessPromotionCost: 0,
  officeRent: 0,
  entertainmentExpenses: 0,
  advertisingCost: 0,
  contingencyExpenses: 0,
  adminExpenses: 0,
  operatingIncome: 0,
  operatingIncomeRate: 0,
};
  
// 초기 데이터 설정
export const defaultCostData: ICostData = {
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
  par_value: 0,
  mean_revenue: 0,
  target_investor_rate: 0,
  max_investor_count: 0,
  max_invest_per: 0,
  id:''
};

export const defaultPriceData: ICostInputItem[] = [
  {
    id: 1,
    name: "직접재료비",
    amount: 0,
    apiId: "direct_material",
    formPath: "PriceCalculator",
  },
  {
    id: 2,
    name: "직접노무비",
    amount: 0,
    apiId: "direct_labor",
    formPath: "PriceCalculator",
  },
  {
    id: 3,
    name: "직접경비",
    amount: 0,
    apiId: "direct_expense",
    formPath: "PriceCalculator",
  },
  {
    id: 4,
    name: "제조간접비",
    amount: 0,
    apiId: "manufacturing_cost",
    formPath: "PriceCalculator",
  },
  {
    id: 11,
    name: "급여(1인 평균)",
    amount: 0,
    apiId: "salary",
    formPath: "PerformanceCalculator",
  },
  {
    id: 12,
    name: "업무추진비",
    amount: 0,
    apiId: "business_expense",
    formPath: "PerformanceCalculator",
  },
  {
    id: 13,
    name: "사무실 임차료",
    amount: 0,
    apiId: "office_rent",
    formPath: "PerformanceCalculator",
  },
  {
    id: 14,
    name: "접대비",
    amount: 0,
    apiId: "maintenance_cost",
    formPath: "PerformanceCalculator",
  },
  {
    id: 15,
    name: "광고선전비",
    amount: 0,
    apiId: "ad_cost",
    formPath: "PerformanceCalculator",
  },
  {
    id: 16,
    name: "예비비용",
    amount: 0,
    apiId: "contingency",
    formPath: "PerformanceCalculator",
  },
  {
    id: 9999,
    name: "급여인상율",
    amount: 0,
    description: "직원 1명당 연봉 인상율",
    apiId: "salary_increase_rate",
    formPath: "IncreaseRateCalulator",
  },
  {
    id: 9999,
    name: "업무추진비 인상율",
    amount: 0,
    description: "직원 증가 시 인상되도록 설정",
    apiId: "business_expense_increase_rate",
    formPath: "IncreaseRateCalulator",
  },
  {
    id: 9999,
    name: "사무실 임차료 인상율",
    amount: 0,
    description: "직원 증가 시 인상되도록 설정",
    apiId: "office_rent_increase_rate",
    formPath: "IncreaseRateCalulator",
  },
  {
    id: 9999,
    name: "접대비 인상율",
    amount: 0,
    description: "예상 및 추정",
    apiId: "maintenance_cost_increase_rate",
    formPath: "IncreaseRateCalulator",
  },
  {
    id: 9999,
    name: "광고선전비 인상율",
    amount: 0,
    description: "예상 및 추정",
    apiId: "ad_cost_increase_rate",
    formPath: "IncreaseRateCalulator",
  },
  {
    id: 9999,
    name: "예비비 인상율",
    amount: 0,
    description: "예상 및 추정",
    apiId: "contingency_increase_rate",
    formPath: "IncreaseRateCalulator",
  },

  {
    id: 9999,
    name: "액면가",
    amount: 0,
    description: "1주의 최소금액은 상법상 100원 이상",
    apiId: "par_value",
    formPath: "StockItems",
    focus: true,
    inputYn: "Y",
  },
  {
    id: 9999,
    name: "총 발생주식 수",
    amount: 0,
    description: "5년차까지 평균매출 x PSR",
    apiId: "total_stock_cnt",
    formPath: "StockItems",
    focus: false,
  },
  {
    id: 9999,
    name: "지분율 당 주식수",
    amount: 0,
    description: "",
    apiId: "number_shares_per_share",
    formPath: "StockItems",
    focus: false,
  },

  {
    id: 9999,
    name: "목표 투자자 지분율",
    amount: 0,
    description: "경영권 유지를 위해 49%이하를 가정해야 함",
    apiId: "target_investor_rate",
    formPath: "InvestItems",
    focus: true,
    strType: "%",
    inputYn: "Y",
  },
  {
    id: 9999,
    name: "투자자 지분 총 주식 수",
    amount: 0,
    description: "",
    apiId: "investor_shares_total_shares",
    formPath: "InvestItems",
    focus: false,
  },
  {
    id: 9999,
    name: "목표 투자자 조달금액",
    amount: 0,
    description: "",
    apiId: "target_investor_amt",
    formPath: "InvestItems",
    focus: false,
  },
  {
    id: 9999,
    name: "1인당 최소투자금",
    amount: 0,
    description: "액면가를 기준으로 자동으로 설정됨",
    apiId: "min_investor_count",
    formPath: "InvestItems",
    focus: false,
  },
  {
    id: 9999,
    name: "1인당 최대투자금",
    amount: 0,
    description: "",
    apiId: "max_investor_count",
    formPath: "InvestItems",
    focus: true,
    inputYn: "Y",
  },
  {
    id: 9999,
    name: "최대 투자자 수 설정(명)",
    amount: 0,
    description: "",
    apiId: "max_invest_per",
    formPath: "InvestItems",
    focus: true,
    inputYn: "Y",
  },
];