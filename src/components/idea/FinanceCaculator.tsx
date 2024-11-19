import { useEffect, useState } from "react";
import styled from "@/components/idea/Idea.module.scss";
import useIdeaPriceStore from "@/store/useIdeaPriceStore";
import { ICostInputItem, ICostData } from "@/store/financeStore";

interface Props {
  itemData: {
    costItems: ICostInputItem[];
    sellingPrice: number;
    totalCost: number;
  };
}

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
  const sales = transactionCount * salesPerTransaction; // 매출: 매출단위X거래발생수
  const salesCost = transactionCount * salesCostPerTransaction; //매출원가: 원가단위X거래발생수
  const grossProfit = sales - salesCost; //매출총이익: 매출-매출원가

  const salary = staffCount * salaryPerStaff; //급여: 직원수*급여(1인)

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
  const operatingIncomeRate = Math.floor((operatingIncome / sales) * 100);

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

const FinanceCaculator: React.FC<Props> = ({ itemData }) => {
  const { costItems, sellingPrice, totalCost } = itemData;
  const [initialTransactionCount, setInitialTransactionCount] =
    useState(1); /* 거래수 */
  const [initialStaffCount, setInitialStaffCount] = useState(2);
  const [salesPerTransaction, setSalesPerTransaction] = useState(sellingPrice);
  const [salesCostPerTransaction, setSalesCostPerTransaction] =
    useState(totalCost);
  const [initialSalaryPerStaff, setInitialSalaryPerStaff] = useState(0);
  const [businessPromotionCost, setBusinessPromotionCost] = useState(0);
  const [officeRent, setOfficeRent] = useState(0);
  const [entertainmentExpenses, setEntertainmentExpenses] = useState(0);
  const [advertisingCost, setAdvertisingCost] = useState(0);
  const [contingencyExpenses, setContingencyExpenses] = useState(0);
  const [plan, setPlan] = useState<YearData[]>([]);

  // costItems 수정 시 반영
  useEffect(() => {
    if (costItems && costItems.length > 0) {
      const salaryItem = costItems.find((item) => item.apiId === "salary");
      const maintenanceCost = costItems.find(
        (item) => item.apiId === "maintenance_cost"
      );
      const officeRent = costItems.find((item) => item.apiId === "office_rent");
      const businessExpense = costItems.find(
        (item) => item.apiId === "business_expense"
      );
      const adCost = costItems.find((item) => item.apiId === "ad_cost");
      const contingency = costItems.find(
        (item) => item.apiId === "contingency"
      );

      setInitialSalaryPerStaff(salaryItem?.amount ?? 0);
      setBusinessPromotionCost(maintenanceCost?.amount ?? 0);
      setOfficeRent(officeRent?.amount ?? 0);
      setEntertainmentExpenses(businessExpense?.amount ?? 0);
      setAdvertisingCost(adCost?.amount ?? 0);
      setContingencyExpenses(contingency?.amount ?? 0);
    }
  }, [costItems]);

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
      transactionCount += 1; // Example increase
      staffCount += 1; // Example increase
      //salaryPerStaff *= 1.05; // 연봉인상률
    }

    return years;
  };

  const findPositiveOperatingIncomeYear = (
    years: YearData[]
  ): number | null => {
    for (let i = 0; i < years.length; i++) {
      if (years[i].operatingIncome > 0) {
        return i + 1;
      }
    }
    return null;
  };

  // const plan = create10YearPlan(
  //   initialTransactionCount,
  //   initialStaffCount,
  //   salesPerTransaction,
  //   salesCostPerTransaction,
  //   initialSalaryPerStaff,
  //   businessPromotionCost,
  //   officeRent,
  //   entertainmentExpenses,
  //   advertisingCost,
  //   contingencyExpenses
  // );

  const positiveYear = findPositiveOperatingIncomeYear(plan);

  useEffect(() => {
    const newPlan = create10YearPlan(
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
    setPlan(newPlan);
  }, [
    initialTransactionCount,
    initialStaffCount,
    salesPerTransaction,
    salesCostPerTransaction,
    initialSalaryPerStaff,
    businessPromotionCost,
    officeRent,
    entertainmentExpenses,
    advertisingCost,
    contingencyExpenses,
  ]);

  // n년차 거래발생수를 변경하는 함수
  const updateYearTransactionCount = (index: number, newCount: number) => {
    setPlan((prevPlan) => {
      const updatedPlan = [...prevPlan];
      if (updatedPlan[index]) {
        updatedPlan[index].transactionCount = newCount; // 값 업데이트
        // 여기서 다시 계산하기
        const yearData = calculateYearData(
          index + 1, // 년도는 1부터 시작
          updatedPlan[index].transactionCount,
          updatedPlan[index].staffCount,
          salesPerTransaction,
          salesCostPerTransaction,
          initialSalaryPerStaff,
          businessPromotionCost,
          officeRent,
          entertainmentExpenses,
          advertisingCost,
          contingencyExpenses,
          index > 0 ? updatedPlan[index - 1].staffCount : 0 // 이전 직원 수
        );

        updatedPlan[index] = yearData; // 다시 계산한 데이터로 업데이트
      }
      return updatedPlan;
    });
  };

  // useEffect(() => {
  //   console.log("yearUserCnt가 수정되면 호출");
  //   if (yearUserCnt)
  //     for (let i = 0; i < yearUserCnt.length; i++) {
  //       updateYearTransactionCount(i, yearUserCnt[i].value);
  //     }
  // }, [yearUserCnt]);

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
