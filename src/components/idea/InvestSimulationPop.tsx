import React, { useState, useRef } from "react";
import styled from "@/components/idea/InvestPop.module.scss";
import styledFinance from "@/components/idea/Idea.module.scss";
import FinanceCaculator from "./FinanceCaculator";
import { YearData, ICostInputItem } from "@/model/financeType";
import {
  Category,
  IdeaContentsType,
  initializeIdeaContents,
} from "@/model/IdeaList";

interface Props {
  itemData: {
    costItems: ICostInputItem[];
    setCostItems: React.Dispatch<React.SetStateAction<ICostInputItem[]>>;
    maraketCap: number;
    plan: YearData[];
    positiveYear: number;
  };
  contents: IdeaContentsType;
}

const InvestSimulationPop: React.FC<Props> = ({ itemData, contents }) => {
  const { costItems, setCostItems, maraketCap, plan, positiveYear } = itemData;
  const performanceParams = {
    plan,
    positiveYear,
  };

  const contentRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [capitalAmt, setCapitalAmt] = useState<string>("0");
  const [ownershipPercentage, setOwnershipPercentage] = useState<number>(0); //지분율
  const [ownershipCnt, setOwnershiCnt] = useState<number>(0); //취득 주식수수

  const charLimit = 100; // 500자 제한
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };
  function removeHtmlTags(input: string) {
    return input.replace(/<[^>]*>/g, "").trim();
  }

  const cleanedText = removeHtmlTags(contents?.content);
  const parValueItem = costItems.find((item) => item.apiId === "par_value");
  const parValue = parValueItem ? parValueItem.amount : 0;
  const totalStockCnt = maraketCap / parValue;
  const maxInvestorCnt = costItems.find(
    (item) => item.apiId === "max_investor_count"
  );
  const maxInvestValue = maxInvestorCnt ? maxInvestorCnt.amount : 0;

  // 현재 날짜
  function getCurrentFormattedDate() {
    const now = new Date(); // 현재 날짜 객체 생성
    const year = now.getFullYear(); // 연도 가져오기
    const month = String(now.getMonth() + 1).padStart(2, "0"); // 월 (0부터 시작하므로 +1 필요)
    const day = String(now.getDate()).padStart(2, "0"); // 일
    return `${year}.${month}.${day}`; // "2024.12.12" 형식
  }

  // 자본금 입력되면 콤마 찍기
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, ""); // 입력 값에서 콤마 제거
    if (!isNaN(Number(rawValue))) {
      const formattedValue = new Intl.NumberFormat().format(Number(rawValue)); // 세 자리마다 콤마 추가
      setCapitalAmt(formattedValue); // 상태 업데이트
    }
  };

  // 투자금금 비용계산하기
  const clickCalBtn = () => {
    const rawValue = capitalAmt.replace(/,/g, "");
    const ownershipPercentageCal = (maraketCap / Number(rawValue)) * 0.01; // 지분율
    const ownershipCntCal = maraketCap / Number(rawValue);

    setOwnershipPercentage(ownershipPercentageCal);
    setOwnershiCnt(ownershipCntCal);
  };

  return (
    <div className={styled.modalContainer}>
      <div className={styled.btn}>
        <div className={styled.downloadImg}></div>
        Export
      </div>
      <div ref={contentRef}>
        <div>
          <div className={styled.majorTitle}>투자 시뮬레이션</div>
          <div className={styled.middleTitle}>
            아이디어 정보<span></span>
          </div>
          <div className={styled.tableContainer}>
            <table className={styled.ideaInfoTable}>
              <thead>
                <tr>
                  <th colSpan={2} className={styled.ideaInfoTableCol}>
                    원가 항목
                  </th>
                  <th className={styled.ideaInfoTableCol}>금액</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={2}>대표이미지</td>
                  <td>
                    <img
                      className={styled.ideaImg}
                      src={contents.images[0].file_path}
                    />
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>아이디어 명</td>
                  <td>{contents?.title}</td>
                </tr>
                <tr>
                  <td colSpan={2}>아이디어 설명</td>
                  <td className={styled.ideaInfoTableDetail}>
                    {isExpanded
                      ? cleanedText // 전체 내용
                      : cleanedText.slice(0, charLimit)}{" "}
                    {/* 500자까지만 표시 */}
                    {!isExpanded && cleanedText.length > charLimit && "…"}{" "}
                    {/* 말줄임표 */}
                    {cleanedText.length > charLimit && (
                      <button
                        onClick={handleToggle}
                        style={{
                          color: "blue",
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                        }}
                      >
                        {isExpanded ? "접기" : "더보기"}
                      </button>
                    )}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>산업 구분</td>
                  <td>{contents?.theme?.name}</td>
                </tr>
                <tr>
                  <td colSpan={2}>아이디어 보유자</td>
                  <td>KTH0307</td>
                </tr>
                <tr>
                  <td rowSpan={2}>펀딩 상태</td>
                  <td className={styled.colorGray}>투자 의향자 모집 수</td>
                  <td>120명 ({getCurrentFormattedDate()})</td>
                </tr>
                <tr>
                  <td>투자 모집 예상 금액</td>
                  <td>30,000,000원 ({getCurrentFormattedDate()})</td>
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
                  <td>{contents?.theme?.name}</td>
                  <td>{contents?.theme?.psr_value}</td>
                </tr>
                <tr>
                  <td>예상 시가총액 (PSR Valuation)</td>
                  <td>KTH0307님의 아이디어</td>
                  <td>{maraketCap.toLocaleString()}원</td>
                </tr>
                <tr>
                  <td>액면가</td>
                  <td>주당 금액</td>
                  <td>{parValueItem ? parValue.toLocaleString() : 0}원</td>
                </tr>
                <tr>
                  <td>총 발행(예정) 주식 수</td>
                  <td>예상 시가총액/액면가</td>
                  <td>{Number(totalStockCnt.toFixed(0)).toLocaleString()}주</td>
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
                  <td>{parValueItem ? parValue.toLocaleString() : 0}원</td>
                </tr>
                <tr>
                  <td>최대 투자금 (1인당)</td>
                  <td>{maxInvestValue.toLocaleString()}원</td>
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
                  <td className={styled.focusAmt}>{capitalAmt}</td>
                </tr>
                <tr>
                  <td>지분율</td>
                  <td>{ownershipPercentage}%</td>
                </tr>
                <tr>
                  <td>취득 주식 수</td>
                  <td>{ownershipCnt.toLocaleString()}주</td>
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
            <input
              type="text"
              id="investment"
              placeholder="금액을 입력하세요."
              value={capitalAmt} // 포맷된 값 사용
              onChange={handleInputChange} // 입력 값 변경 핸들러
            />
            <button
              type="button"
              onClick={clickCalBtn} // 버튼 클릭 시 상태 출력
            >
              입력
            </button>
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
      </div>
    </div>
  );
};

export default InvestSimulationPop;
