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
//import jsPDF from "jspdf";
//import html2canvas from "html2canvas";

interface Props {
  itemData: {
    ideaName: string;
    editorContent: string;
    selectedTheme?: Category;
    imagePreview: string;
    costItems: ICostInputItem[];
    setCostItems: React.Dispatch<React.SetStateAction<ICostInputItem[]>>;
    maraketCap: number;
    plan: YearData[];
    positiveYear: number;
  };
}

const InvestSimulationPop: React.FC<Props> = ({ itemData }) => {
  const {
    ideaName,
    editorContent,
    selectedTheme,
    imagePreview,
    costItems,
    setCostItems,
    maraketCap,
    plan,
    positiveYear,
  } = itemData;
  const performanceParams = {
    plan,
    positiveYear,
  };
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null); // ref에 타입 설정
  const charLimit = 100; // 500자 제한
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };
  function removeHtmlTags(input: string) {
    return input.replace(/<[^>]*>/g, "").trim();
  }

  const cleanedText = removeHtmlTags(editorContent);
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

  // PDF 다운로드 함수
  /*
  const handleDownloadPDF = () => {
    console.log("PDF 다운로드 버튼 클릭됨");
    const input = contentRef.current;

    if (input) {
      const padding = 20; // 패딩값 (단위: mm)
      const pageWidth = 210; // A4 너비 (mm)
      const pageHeight = 297; // A4 높이 (mm)

      html2canvas(input, { scale: 2 })
        .then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4");

          const imgWidth = pageWidth - padding * 2; // 패딩 적용 너비
          const imgHeight = (canvas.height * imgWidth) / canvas.width; // 비율에 맞춘 높이

          let heightLeft = imgHeight;
          let position = padding;

          // 첫 페이지에 이미지 삽입
          pdf.addImage(imgData, "PNG", padding, position, imgWidth, imgHeight);
          heightLeft -= pageHeight - padding * 2;

          // 남은 이미지가 있으면 새로운 페이지에 추가
          while (heightLeft > 0) {
            position -= pageHeight - padding * 2; // 이미지 위치 조정
            pdf.addPage(); // 새로운 페이지 추가
            pdf.addImage(
              imgData,
              "PNG",
              padding,
              position,
              imgWidth,
              imgHeight
            );
            heightLeft -= pageHeight - padding * 2;
          }

          pdf.save("download.pdf");
        })
        .catch((error) => {
          console.error("PDF 생성 중 오류 발생:", error);
        });
    }
  };
*/

  // 워드 다운로드 함수
  // const handleDownloadWord = () => {
  //   if (contentRef.current) {
  //     const htmlContent = contentRef.current.outerHTML; // HTML 내용 가져오기
  //     const docx = htmlDocx.asBlob(htmlContent) as Blob; // 반환값을 Blob으로 명시적으로 지정

  //     // Blob을 Word 파일로 저장
  //     const link = document.createElement("a");
  //     link.href = URL.createObjectURL(docx);
  //     link.download = "exported.docx";
  //     link.click();
  //   }
  // };

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
                      src={imagePreview ? imagePreview : ""}
                    />
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>아이디어 명</td>
                  <td>{ideaName}</td>
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
                  <td>
                    {selectedTheme ? selectedTheme?.name : "선택해주세요"}
                  </td>
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
                  <td>
                    {selectedTheme ? selectedTheme?.name : "선택해주세요"}
                  </td>
                  <td>{selectedTheme ? selectedTheme?.psr_value : "0"}</td>
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
            <input
              type="text"
              id="investment"
              placeholder="금액을 입력하세요."
            />
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
      </div>
    </div>
  );
};

export default InvestSimulationPop;
