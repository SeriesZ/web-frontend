import React, { useState } from "react";
import styled from "@/components/idea/InvestPop.module.scss";
import styledFinance from "@/components/idea/Idea.module.scss";
import FinanceCaculator from "./FinanceCaculator";
import { YearData, ICostInputItem } from "@/model/financeType";

const InvestSimulationPop: React.FC = () => {
  const [costItems, setCostItems] = useState<ICostInputItem[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [positiveYear, setPositiveYear] = useState(0);
  const [plan, setPlan] = useState<YearData[]>([]);
  const performanceParams = {
    costItems,
    sellingPrice,
    totalCost,
    positiveYear,
    plan,
  };
  return (
    <div className={styled.modalContainer}>
      <div className={styled.btn}>
        <div className={styled.downloadImg}></div>Export
      </div>
      <div className={styled.majorTitle}>투자 시뮬레이션</div>
      <div className={styled.middleTitle}>
        아이디어 정보<span></span>
      </div>
      <div className={styled.tableContainer}>
        <table className={styled.ideaInfoTable}>
          <thead>
            <tr>
              <th colSpan={2}>원가 항목</th>
              <th>금액</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={2} className={styled.ideaInfoTableCol}>
                대표이미지
              </td>
              <td>
                <div className={styled.ideaImg}></div>
              </td>
            </tr>
            <tr>
              <td colSpan={2}>아이디어 명</td>
              <td>홈짐 (Home Gym)</td>
            </tr>
            <tr>
              <td colSpan={2}>아이디어 설명</td>
              <td>
                모바일 디바이스에서 체류피드백 기반으로 사용자 의체형을
                분석하고...
              </td>
            </tr>
            <tr>
              <td colSpan={2}>산업 구분</td>
              <td>오락/문화업</td>
            </tr>
            <tr>
              <td colSpan={2}>아이디어 보유자</td>
              <td>KTH0307</td>
            </tr>
            <tr>
              <td rowSpan={2}>펀딩 상태</td>
              <td className={styled.colorGray}>투자 의향자 모집 수</td>
              <td>120명 (2024.01.01)</td>
            </tr>
            <tr>
              <td>투자 모집 예상 금액</td>
              <td>30,000,000원 (2024.01.01)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={styled.majorTitle}>KTH0307님의 투자설정조건</div>
      <div className={styled.middleTitle}>
        산업 PSR 결과<span></span>
      </div>
      <div className={styled.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>구분</th>
              <th>기준</th>
              <th>결과값</th>
            </tr>
          </thead>
          <tbody>
            <tr className={styled.investSettingTableCol}>
              <td>PSR</td>
              <td>제조업</td>
              <td>3</td>
            </tr>
            <tr>
              <td>예상 시가총액 (PSR Valuation)</td>
              <td>KTH0307님의 아이디어</td>
              <td>966,420,000원</td>
            </tr>
            <tr>
              <td>액면가</td>
              <td>주당 금액</td>
              <td>1,000원</td>
            </tr>
            <tr>
              <td>총 발행(예정) 주식 수</td>
              <td>예상 시가총액/액면가</td>
              <td>966,420주</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={styled.middleTitle}>
        최소/최대투자금<span></span>
      </div>
      <div className={styled.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>구분</th>
              <th>금액</th>
            </tr>
          </thead>
          <tbody className={styled.investAmtTable}>
            <tr className={styled.investAmtTableCol}>
              <td>최소 투자금 (1인당)</td>
              <td>1,000원</td>
            </tr>
            <tr>
              <td>최대 투자금 (1인당)</td>
              <td>200,000,000원</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={styled.middleTitle}>
        투자금 입력<span></span>
      </div>
      <div className={styled.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>구분</th>
              <th>금액</th>
            </tr>
          </thead>
          <tbody className={styled.investAmtTable}>
            <tr className={`${styled.investAmtTableCol}`}>
              <td>개인 투자금액</td>
              <td className={styled.focusAmt}>100,000,000원</td>
            </tr>
            <tr>
              <td>지분율</td>
              <td>10.3%</td>
            </tr>
            <tr>
              <td>취득 주식 수</td>
              <td>100,000주</td>
            </tr>
            <tr>
              <td>(EXIT까지의) 수익율</td>
              <td>17%</td>
            </tr>
            <tr>
              <td>연 수익율</td>
              <td>4%</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={styled.inputWrap}>
        <label>개인 투자금액</label>
        <input type="text" id="investment" placeholder="금액을 입력하세요." />
        <button type="button">입력</button>
      </div>
      <div className={styled.majorTitle}>
        EXIT 시뮬레이션<span></span>
        <div className={styled.unit}>단위 : 원, %</div>
      </div>
      <div>
        <div className={styledFinance.tableContainer}>
          <div className={styledFinance.tableContentsWrap}>
            <FinanceCaculator itemData={performanceParams} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestSimulationPop;
