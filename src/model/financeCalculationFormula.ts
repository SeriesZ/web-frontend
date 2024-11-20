import { YearData } from "@/model/financeType";

// 매출계획표 계산 함수
export const calculateYearData = (
    year: number,
    transactionCount: number,
    staffCount: number,
    salesPerTransaction: number,
    salesCostPerTransaction: number,
    salaryPerStaff: number,
    businessPromotionCost: number,
    officeRent: number,
    entertainmentExpenses: number,
    advertisingCost: number,
    contingencyExpenses: number,
    previousStaffCount: number,
    previousBusinessPromotionCost: number,
    businessPromotionIncreaseRate: number,
    previousOfficeRent: number,
    officeRentIncreaseRate: number
  ): YearData => {
    // 매출: 매출단위X거래발생수
    const sales = transactionCount * salesPerTransaction;
  
    // 매출원가: 원가단위X거래발생수
    const salesCost = transactionCount * salesCostPerTransaction;
  
    // 매출총이익: 매출-매출원가
    const grossProfit = sales - salesCost;
  
    // 급여: 직원수*급여(1인)
    const salary = staffCount * salaryPerStaff;
  
    // 업무추진비: 직원수가 증가하면 인상률 반영 or 그대로
    const businessPromotionCostAdjusted =
      staffCount > previousStaffCount
        ? previousBusinessPromotionCost +
          previousBusinessPromotionCost * (businessPromotionIncreaseRate * 0.01)
        : businessPromotionCost;
  
    // 임차료: 직원수가 증가하면 인상률 반영 or 그대로
    const officeRentAdjusted =
      staffCount > previousStaffCount
        ? previousOfficeRent +
          previousOfficeRent * (officeRentIncreaseRate * 0.01)
        : officeRent;
  
    // 판관비 계
    const adminExpenses =
      salary +
      businessPromotionCostAdjusted +
      officeRentAdjusted +
      entertainmentExpenses +
      advertisingCost +
      contingencyExpenses;
  
    // 영업이익: 매출총이익 - 판관비계
    const operatingIncome = grossProfit - adminExpenses;
  
    // 영업이익률: 영업이익/매출 * 100
    const operatingIncomeRate = Math.round((operatingIncome / sales) * 100);
  
    return {
      transactionCount,
      staffCount,
      sales,
      salesCost,
      grossProfit,
      salary,
      businessPromotionCost: businessPromotionCostAdjusted,
      officeRent: officeRentAdjusted,
      entertainmentExpenses,
      advertisingCost,
      contingencyExpenses,
      adminExpenses,
      operatingIncome,
      operatingIncomeRate,
    };
  };