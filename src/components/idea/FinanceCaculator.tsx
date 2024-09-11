import { useState } from "react";
import styled from "@/components/idea/Idea.module.scss";

interface YearData {
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
}

const calculateYearData = (
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
  previousStaffCount: number
): YearData => {
  const sales = transactionCount * salesPerTransaction;
  const salesCost = transactionCount * salesCostPerTransaction;
  const grossProfit = sales - salesCost;

  const salary = staffCount * salaryPerStaff;

  const businessPromotionCostAdjusted =
    staffCount > previousStaffCount
      ? businessPromotionCost * 1.05
      : businessPromotionCost;
  const officeRentAdjusted =
    staffCount > previousStaffCount ? officeRent * 1.05 : officeRent;

  const adminExpenses =
    salary +
    businessPromotionCostAdjusted +
    officeRentAdjusted +
    entertainmentExpenses +
    advertisingCost +
    contingencyExpenses;
  const operatingIncome = grossProfit - adminExpenses;
  const operatingIncomeRate = (operatingIncome / sales) * 100;

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

const create10YearPlan = (
  initialTransactionCount: number,
  initialStaffCount: number,
  salesPerTransaction: number,
  salesCostPerTransaction: number,
  initialSalaryPerStaff: number,
  businessPromotionCost: number,
  officeRent: number,
  entertainmentExpenses: number,
  advertisingCost: number,
  contingencyExpenses: number
): YearData[] => {
  const years: YearData[] = [];
  let transactionCount = initialTransactionCount;
  let staffCount = initialStaffCount;
  let salaryPerStaff = initialSalaryPerStaff;

  for (let year = 1; year <= 10; year++) {
    const previousStaffCount = year > 1 ? years[year - 2].staffCount : 0;
    const yearData = calculateYearData(
      year,
      transactionCount,
      staffCount,
      salesPerTransaction,
      salesCostPerTransaction,
      salaryPerStaff,
      businessPromotionCost,
      officeRent,
      entertainmentExpenses,
      advertisingCost,
      contingencyExpenses,
      previousStaffCount
    );

    years.push(yearData);

    // Adjust values for next year
    transactionCount *= 2; // Example increase
    staffCount += 1; // Example increase
    salaryPerStaff *= 1.05; // Example increase
  }

  return years;
};

const findPositiveOperatingIncomeYear = (years: YearData[]): number | null => {
  for (let i = 0; i < years.length; i++) {
    if (years[i].operatingIncome > 0) {
      return i + 1;
    }
  }
  return null;
};

const FinanceCaculator = () => {
  const [initialTransactionCount, setInitialTransactionCount] = useState(100);
  const [initialStaffCount, setInitialStaffCount] = useState(2);
  const [salesPerTransaction, setSalesPerTransaction] = useState(19500);
  const [salesCostPerTransaction, setSalesCostPerTransaction] = useState(13000);
  const [initialSalaryPerStaff, setInitialSalaryPerStaff] = useState(70000000);
  const [businessPromotionCost, setBusinessPromotionCost] = useState(3600000);
  const [officeRent, setOfficeRent] = useState(6000000);
  const [entertainmentExpenses, setEntertainmentExpenses] = useState(5000000);
  const [advertisingCost, setAdvertisingCost] = useState(12000000);
  const [contingencyExpenses, setContingencyExpenses] = useState(3000000);

  const plan = create10YearPlan(
    initialTransactionCount,
    initialStaffCount,
    salesPerTransaction,
    salesCostPerTransaction,
    initialSalaryPerStaff,
    businessPromotionCost,
    officeRent,
    entertainmentExpenses,
    advertisingCost,
    contingencyExpenses
  );

  const positiveYear = findPositiveOperatingIncomeYear(plan);

  return (
    <div className={styled.xScroll}>
      <table className={styled.years10}>
        <thead>
          <tr>
            <th colSpan={2}>구분</th>
            {plan.map((_, index) => (
              <th key={index}>{index + 1}년차</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>USER</th>
            <th>거래 발생 수</th>
            {plan.map((yearData, index) => (
              <td key={index}>{yearData.transactionCount}</td>
            ))}
          </tr>
          <tr>
            <th>수익</th>
            <th>매출</th>
            {plan.map((yearData, index) => (
              <td key={index}>{yearData.sales}</td>
            ))}
          </tr>
          <tr>
            <th>원가</th>
            <th>매출원가</th>
            {plan.map((yearData, index) => (
              <td key={index}>{yearData.salesCost}</td>
            ))}
          </tr>
          <tr>
            <th colSpan={2} className={styled.total}>
              매출총이익
            </th>
            {plan.map((yearData, index) => (
              <th className={styled.total} key={index}>
                {yearData.grossProfit}
              </th>
            ))}
          </tr>
          <tr>
            <th rowSpan={8}>판관비</th>
            <th>직원 수</th>
            {plan.map((yearData, index) => (
              <td key={index}>{yearData.staffCount}</td>
            ))}
          </tr>
          <tr>
            <th>급여</th>
            {plan.map((yearData, index) => (
              <td key={index}>{yearData.salary}</td>
            ))}
          </tr>
          <tr>
            <th>업무추진비</th>
            {plan.map((yearData, index) => (
              <td key={index}>{yearData.businessPromotionCost}</td>
            ))}
          </tr>
          <tr>
            <th>사무실 임차료</th>
            {plan.map((yearData, index) => (
              <td key={index}>{yearData.officeRent}</td>
            ))}
          </tr>
          <tr>
            <th>접대비</th>
            {plan.map((yearData, index) => (
              <td key={index}>{yearData.entertainmentExpenses}</td>
            ))}
          </tr>
          <tr>
            <th>광고선전비</th>
            {plan.map((yearData, index) => (
              <td key={index}>{yearData.advertisingCost}</td>
            ))}
          </tr>
          <tr>
            <th>예비비</th>
            {plan.map((yearData, index) => (
              <td key={index}>{yearData.contingencyExpenses}</td>
            ))}
          </tr>
          <tr>
            <th>판관비 계</th>
            {plan.map((yearData, index) => (
              <td key={index}>{yearData.adminExpenses}</td>
            ))}
          </tr>
          <tr>
            <th colSpan={2} className={styled.total}>
              영업이익
            </th>
            {plan.map((yearData, index) => (
              <th className={styled.total} key={index}>
                {yearData.operatingIncome}
              </th>
            ))}
          </tr>
          <tr>
            <th colSpan={2} className={styled.total}>
              영업이익률
            </th>
            {plan.map((yearData, index) => (
              <th className={styled.total} key={index}>
                {yearData.operatingIncomeRate.toFixed(2)}%
              </th>
            ))}
          </tr>
        </tbody>
      </table>
      <p>
        영업이익이 플러스로 전환되는 해:{" "}
        {positiveYear ? `${positiveYear}년차` : "N/A"}
      </p>
    </div>
  );
};

export default FinanceCaculator;
