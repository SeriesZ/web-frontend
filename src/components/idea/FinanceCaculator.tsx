import {} from "react";
import styled from "@/components/idea/Idea.module.scss";
import { YearData } from "@/model/financeType";

interface Props {
  itemData: {
    plan: YearData[];
    positiveYear: number;
  };
}

// [매출계획표(1년~10년차)]
const FinanceCaculator: React.FC<Props> = ({ itemData }) => {
  const { plan, positiveYear } = itemData;

  return (
    <div className={styled.xScroll}>
      <div style={{ display: "inline-block", minWidth: "100%" }}>
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
                <td key={index}>
                  {Number(yearData.transactionCount).toLocaleString()}
                </td>
              ))}
            </tr>
            <tr>
              <th>수익</th>
              <th>매출</th>
              {plan.map((yearData, index) => (
                <td key={index}>{yearData.sales.toLocaleString()}</td>
              ))}
            </tr>
            <tr>
              <th>원가</th>
              <th>매출원가</th>
              {plan.map((yearData, index) => (
                <td key={index}>{yearData.salesCost.toLocaleString()}</td>
              ))}
            </tr>
            <tr>
              <th colSpan={2} className={styled.total}>
                매출총이익
              </th>
              {plan.map((yearData, index) => (
                <th className={styled.total} key={index}>
                  {yearData.grossProfit.toLocaleString()}
                </th>
              ))}
            </tr>
            <tr>
              <th rowSpan={8}>판관비</th>
              <th>직원 수</th>
              {plan.map((yearData, index) => (
                <td key={index}>
                  {Number(yearData.staffCount.toFixed(0)).toLocaleString()}
                </td>
              ))}
            </tr>
            <tr>
              <th>급여</th>
              {plan.map((yearData, index) => (
                <td key={index}>
                  {Number(yearData.salary.toFixed(0)).toLocaleString()}
                </td>
              ))}
            </tr>
            <tr>
              <th>업무추진비</th>
              {plan.map((yearData, index) => (
                <td key={index}>
                  {Number(
                    yearData.businessPromotionCost.toFixed(0)
                  ).toLocaleString()}
                </td>
              ))}
            </tr>
            <tr>
              <th>사무실 임차료</th>
              {plan.map((yearData, index) => (
                <td key={index}>
                  {Number(yearData.officeRent.toFixed(0)).toLocaleString()}
                </td>
              ))}
            </tr>
            <tr>
              <th>접대비</th>
              {plan.map((yearData, index) => (
                <td key={index}>
                  {Number(
                    yearData.entertainmentExpenses.toFixed(0)
                  ).toLocaleString()}
                </td>
              ))}
            </tr>
            <tr>
              <th>광고선전비</th>
              {plan.map((yearData, index) => (
                <td key={index}>
                  {Number(yearData.advertisingCost.toFixed(0)).toLocaleString()}
                </td>
              ))}
            </tr>
            <tr>
              <th>예비비</th>
              {plan.map((yearData, index) => (
                <td key={index}>
                  {Number(
                    yearData.contingencyExpenses.toFixed(0)
                  ).toLocaleString()}
                </td>
              ))}
            </tr>
            <tr>
              <th>판관비 계</th>
              {plan.map((yearData, index) => (
                <td key={index}>
                  {Number(yearData.adminExpenses.toFixed(0)).toLocaleString()}
                </td>
              ))}
            </tr>
            <tr>
              <th colSpan={2} className={styled.total}>
                영업이익
              </th>
              {plan.map((yearData, index) => (
                <th className={styled.total} key={index}>
                  {Number(yearData.operatingIncome.toFixed(0)).toLocaleString()}
                </th>
              ))}
            </tr>
            <tr>
              <th colSpan={2} className={styled.total}>
                영업이익률
              </th>
              {plan.map((yearData, index) => (
                <th className={styled.total} key={index}>
                  {Number(
                    (yearData.operatingIncomeRate || 0).toFixed(0)
                  ).toLocaleString()}
                  %
                </th>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinanceCaculator;
