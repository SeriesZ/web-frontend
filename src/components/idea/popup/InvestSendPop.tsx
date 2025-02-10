import React, { useRef, useEffect, useState } from "react";
import styled from "@/components/idea/InvestPop.module.scss";
import { YearData, ICostInputItem, InvestAmtMap } from "@/model/financeType";
import { Category } from "@/model/IdeaList";

const InvestSendPop: React.FC<{
  closeModal: () => void;
  data: any;
  openBeforeCheckInvestPop: (
    capitalAmt: string,
    investAmtMap: InvestAmtMap
  ) => void;
  itemData: {
    costItems: ICostInputItem[];
    plan: YearData[];
    selectedTheme4Psr: Category;
    averageSales: number;
  };
}> = ({ closeModal, data, openBeforeCheckInvestPop, itemData }) => {
  const { costItems, plan, selectedTheme4Psr, averageSales } = itemData;
  const [capitalAmt, setCapitalAmt] = useState<string>("0");
  const [ownershipPercentage, setOwnershipPercentage] = useState<number>(0); //지분율
  const [ownershipCnt, setOwnershiCnt] = useState<number>(0); //취득 주식수
  const [psrValue, setPsrValue] = useState(
    selectedTheme4Psr.psr_value ? selectedTheme4Psr.psr_value : 0
  );
  const [plusProtitRate, setPlusProtitRate] = useState(0); // exit까지의 수익율
  const [plusProfitYear, setPlusProfitYear] = useState(0);
  const [maraketCap, setMaraketCap] = useState(averageSales * psrValue);
  const [investData, setInvestData] = useState<InvestAmtMap>({
    capitalAmt: "0",
    ownershipPercentage: 0,
    ownershipCnt: 0,
    plusProfitYear: 0,
    plusProtitRate: 0,
    plusProfitYearRate: 0,
  });
  let isfirstPlusYear = true;

  const parValueItem = costItems.find((item) => item.apiId === "par_value");
  const parValue = parValueItem ? parValueItem.amount : 0;
  const totalStockCnt = maraketCap / parValue;
  const maxInvestorCnt = costItems.find(
    (item) => item.apiId === "max_investor_count"
  );

  // 자본금 입력되면 콤마 찍기
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, ""); // 입력 값에서 콤마 제거
    if (!isNaN(Number(rawValue))) {
      const formattedValue = new Intl.NumberFormat().format(Number(rawValue)); // 세 자리마다 콤마 추가
      setCapitalAmt(formattedValue); // 상태 업데이트
    }
  };

  const clickCalBtn = () => {
    const rawValue = Number(capitalAmt.replace(/,/g, ""));
    const ownershipPercentageCal = (rawValue / maraketCap) * 100; // 지분율
    const ownershipCntCal =
      (rawValue / maraketCap) * 100 * totalStockCnt * 0.01;

    setOwnershipPercentage(Math.floor(ownershipPercentageCal * 10) / 10);
    setOwnershiCnt(ownershipCntCal);

    plan.map((item, index) => {
      item.calSalesTotalProfit = item.sales - item.salesCost;
      item.calMarketCap = calMarketCap(item.sales);
      item.calTotalStockCnt = totalStockCnt;
      item.calValuePerShare = calValuePerShare(item.sales);
      item.calOwnerShiCnt = ownershipCntCal;
      item.calStockValueHeld = calStockValueHeld(item.sales, ownershipCntCal);
      item.calExitProfit = calExitProfit(item.sales, ownershipCntCal, rawValue);
      item.calTransferTax =
        calExitProfit(item.sales, ownershipCntCal, rawValue) > 0
          ? transferTax(item.sales, ownershipCntCal, rawValue)
          : 0;
      item.calProtitRate =
        ((calExitProfit(item.sales, ownershipCntCal, rawValue) -
          transferTax(item.sales, ownershipCntCal, rawValue)) /
          Number(rawValue)) *
        100;
      item.calMultiple =
        (calExitProfit(item.sales, ownershipCntCal, rawValue) -
          transferTax(item.sales, ownershipCntCal, rawValue)) /
        Number(rawValue);

      if (item.calExitProfit > 0 && isfirstPlusYear) {
        setPlusProtitRate(item.calProtitRate);
        setPlusProfitYear(index + 1);
        isfirstPlusYear = false;
      }
    });
  };

  // 시가총액
  const calMarketCap = (amt: number) => {
    if (psrValue) return amt * psrValue;
    return 0;
  };

  // 주당가치
  const calValuePerShare = (amt: number) => {
    return calMarketCap(amt) / totalStockCnt;
  };

  // 보유주식가치
  const calStockValueHeld = (amt: number, ownershipCntCal: number) => {
    return (ownershipCntCal * calMarketCap(amt)) / totalStockCnt;
  };

  // EXIT 차익
  const calExitProfit = (
    amt: number,
    ownershipCntCal: number,
    getinvsetAmt: number
  ) => {
    return calStockValueHeld(amt, ownershipCntCal) - getinvsetAmt;
  };

  // 양도세
  const transferTax = (
    amt: number,
    ownershipCntCal: number,
    getinvsetAmt: number
  ) => {
    return calExitProfit(amt, ownershipCntCal, getinvsetAmt) * 0.2;
  };

  // 최종완료 버튼

  const handleComplete = () => {
    setInvestData((prev) => ({
      ...prev,
      capitalAmt,
      ownershipPercentage,
      ownershipCnt,
      plusProfitYear,
      plusProtitRate,
      plusProfitYearRate: plusProfitYear ? plusProtitRate / plusProfitYear : 0,
    }));

    openBeforeCheckInvestPop(capitalAmt, {
      capitalAmt,
      ownershipPercentage,
      ownershipCnt,
      plusProfitYear,
      plusProtitRate,
      plusProfitYearRate: plusProfitYear ? plusProtitRate / plusProfitYear : 0,
    });
  };

  return (
    <div className={styled.investSendContainer}>
      <div className={styled.topSection}>
        <h1 className={styled.title}>
          투자의향 전달을 위해 다음의 항목을 설정하셔야 합니다.
        </h1>
        <div className={styled.infoSection}>
          <button className={styled.blueBtn}>최근정보불러오기</button>
          <span className={styled.infoDate}>2024.05.30 19:35:00</span>
        </div>
        <div className={styled.inputSection}>
          <label className={styled.label}>투자예상금액</label>
          <input
            type="text"
            id="investment"
            placeholder="금액을 입력하세요."
            className={styled.inputBox}
            value={capitalAmt} // 포맷된 값 사용
            onChange={handleInputChange} // 입력 값 변경 핸들러
          />{" "}
          <button
            type="button"
            onClick={clickCalBtn} // 버튼 클릭 시 상태 출력
          >
            입력
          </button>
        </div>
        <div className={styled.tableSection}>
          <h3 className={styled.tableTitle}>투자 조건표 (요약)</h3>
          <table>
            <thead>
              <tr>
                <th>구분</th>
                <th>금액</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>개인 투자금액</td>
                <td>{capitalAmt}원</td>
              </tr>
              <tr>
                <td>지분율</td>
                <td>{Number(ownershipPercentage)}%</td>
              </tr>
              <tr>
                <td>취득 주식 수</td>
                <td>
                  {plusProtitRate
                    ? Number(ownershipCnt.toFixed(0)).toLocaleString()
                    : 0}
                  주
                </td>
              </tr>
              <tr>
                <td>(EXIT까지의) 기간</td>
                <td>투자 {plusProfitYear}년차</td>
              </tr>
              <tr>
                <td>(EXIT까지의) 수익율</td>
                <td>
                  {plusProtitRate
                    ? Number(plusProtitRate.toFixed(0)).toLocaleString()
                    : 0}
                  %
                </td>
              </tr>
              <tr>
                <td>연 수익율</td>
                <td>
                  {plusProfitYear
                    ? Number(
                        (plusProtitRate / plusProfitYear).toFixed(0)
                      ).toLocaleString()
                    : 0}
                  %
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className={styled.buttonSection}>
        <button className={styled.submitBtn} onClick={handleComplete}>
          최종완료
        </button>
        <button className={styled.cancelBtn} onClick={closeModal}>
          취소
        </button>
      </div>
    </div>
  );
};

export default InvestSendPop;
