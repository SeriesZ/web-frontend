import { useState } from "react";
import styled from "@/components/idea/Idea.module.scss";
import { YearData, ICostInputItem } from "@/model/financeType";
import { IdeaContentsType } from "@/model/IdeaList";

interface Props {
  itemData: {
    plan: YearData[];
    positiveYear: number;
    contents: IdeaContentsType;
  };
}

// [매출계획표(1년~10년차)]
const ExitSimulator: React.FC<Props> = ({ itemData }) => {
  const { plan } = itemData;

  return (
    <div className={styled.xScroll}>
      <div style={{ display: "inline-block", minWidth: "100%" }}>
        <table className={styled.years10}>
          <thead>
            <tr>
              <th>구분</th>
              {plan.map((_, index) => (
                <th key={index}>{index + 1}년차</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>매출</th>
              {plan.map((yearData, index) => (
                <td key={index}>{Number(yearData.sales).toLocaleString()}</td>
              ))}
            </tr>
            <tr>
              <th>매출총이익</th>
              {plan.map((yearData, index) => (
                <td key={index}>
                  {yearData.calSalesTotalProfit
                    ? Number(
                        yearData.calSalesTotalProfit.toFixed(0)
                      ).toLocaleString()
                    : 0}
                </td>
              ))}
            </tr>
            <tr>
              <th>영업이익</th>
              {plan.map((yearData, index) => (
                <td key={index}>{yearData.operatingIncome.toLocaleString()}</td>
              ))}
            </tr>
            <tr>
              <th>시가총액</th>
              {plan.map((yearData, index) => (
                <td key={index}>
                  {yearData.calMarketCap
                    ? Number(yearData.calMarketCap.toFixed(0)).toLocaleString()
                    : 0}
                </td>
              ))}
            </tr>
            <tr>
              <th>총 발행 주식 수</th>
              {plan.map((yearData, index) => (
                <td key={index}>
                  {yearData.calTotalStockCnt
                    ? Number(
                        yearData.calTotalStockCnt.toFixed(0)
                      ).toLocaleString()
                    : 0}
                </td>
              ))}
            </tr>
            <tr>
              <th>주당 가치</th>
              {plan.map((yearData, index) => (
                <td key={index}>
                  {yearData.calValuePerShare
                    ? Number(
                        yearData.calValuePerShare.toFixed(0)
                      ).toLocaleString()
                    : 0}
                </td>
              ))}
            </tr>
            <tr>
              <th>보유 주식 수</th>
              {plan.map((yearData, index) => (
                <td key={index}>
                  {yearData.calOwnerShiCnt
                    ? Number(
                        yearData.calOwnerShiCnt.toFixed(0)
                      ).toLocaleString()
                    : 0}
                </td>
              ))}
            </tr>
            <tr>
              <th>보유 주식가치</th>
              {plan.map((yearData, index) => (
                <td key={index}>
                  {yearData.calStockValueHeld
                    ? Number(
                        yearData.calStockValueHeld.toFixed(0)
                      ).toLocaleString()
                    : 0}
                </td>
              ))}
            </tr>
            <tr>
              <th>EXIT 차익</th>
              {plan.map((yearData, index) => (
                <td key={index}>
                  {yearData.calExitProfit
                    ? Number(yearData.calExitProfit.toFixed(0)).toLocaleString()
                    : 0}
                </td>
              ))}
            </tr>
            <tr>
              <th>
                (차익발생이후)<br></br>양도세
              </th>
              {plan.map((yearData, index) => (
                <td key={index}>
                  {yearData.calTransferTax
                    ? Number(
                        yearData.calTransferTax.toFixed(0)
                      ).toLocaleString()
                    : 0}
                </td>
              ))}
            </tr>
            <tr>
              <th>최종 차익</th>
              {plan.map((yearData, index) => (
                <td key={index}>
                  {yearData.calFinalProfis
                    ? Number(
                        yearData.calFinalProfis.toFixed(0)
                      ).toLocaleString()
                    : 0}
                </td>
              ))}
            </tr>
            <tr>
              <th>수익율</th>
              {plan.map((yearData, index) => (
                <td key={index}>
                  {yearData.calProtitRate
                    ? Number(yearData.calProtitRate.toFixed(0)).toLocaleString()
                    : 0}
                  %
                </td>
              ))}
            </tr>
            <tr>
              <th>Multiple</th>
              {plan.map((yearData, index) => (
                <td key={index}>
                  {yearData.calMultiple
                    ? Number(yearData.calMultiple.toFixed(0)).toLocaleString()
                    : 0}{" "}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExitSimulator;
