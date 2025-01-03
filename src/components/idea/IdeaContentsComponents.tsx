"use client";
import React, { useEffect, useState } from "react";
import styled from "@/components/idea/Idea.module.scss";
import PriceCalculator from "./PriceCalculator";
import PerformanceCalculator from "./PerformanceCalculator";
import FinanceCaculator from "./FinanceCaculator";
import PsrCalulator from "./PsrCalulator";
import StockCalulator from "./StockCalulator";
import InvestSimulationPop from "./InvestSimulationPop";
import Modal from "react-modal";
import InvestStatusPop from "./InvestStatusPop";
import userStore from "@/store/userLoginInfo";
import BeforeCheckContractPop from "./BeforeCheckContractPop";
import ContractWritePop from "./ContractWritePop";
import ContractSignPop from "./ContractSignPop";
import ChatPop from "./ChatPop";
import IdeaCompanyInfoPop from "./IdeaCompanyInfoPop";
import InvestSendPop from "./InvestSendPop";
import { Viewer } from "@toast-ui/react-editor";
import { Category, IdeaContentsType, Attachment } from "@/model/IdeaList";
import { ICostInputItem, YearData } from "@/model/financeType";
import { defaultYearData } from "@/model/financeDefaultData";

type Props = {
  activeIndex: number;
  data: IdeaContentsType;
  itemData: {
    costItems: ICostInputItem[];
    profitMargin: number;
    tradeCounts: number[];
    employeeCounts: number[];
    totalCost: number;
    sellingPrice: number;
    totalSelYear: number;
    plan: YearData[];
  };
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
};

const IdeaContentsComponents = ({
  activeIndex,
  data,
  itemData,
  setActiveIndex,
}: Props) => {
  const initCategory: Category = {
    id: "theme_1",
    name: "농업",
    image: "https://cdn-icons-png.flaticon.com/512/194/194041.png",
    description: "",
    psr_value: 3,
  };

  const { userInfo } = userStore();
  const [ideaName, setIdeaName] = useState("");
  const [selectedTheme, setSelectedTheme] = useState<Category>();
  const [editorContent, setEditorContent] = useState<string>("");
  const [imagePreview, setImagePreview] = useState("");
  const [profitMargin, setProfitMargin] = useState(itemData.profitMargin);
  const [totalCost, setTotalCost] = useState(itemData.totalCost);
  const [sellingPrice, setSellingPrice] = useState(itemData.sellingPrice);
  const [totalSelYear, setTotalSelYear] = useState(itemData.totalSelYear);
  const [costItems, setCostItems] = useState<ICostInputItem[]>(
    itemData.costItems
  );
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  const [selectedTheme4Psr, setSelectedTheme4Psr] =
    useState<Category>(initCategory);
  const [maraketCap, setMaraketCap] = useState(0);
  const [tradeCounts, setTradeCounts] = useState<number[]>(
    itemData.tradeCounts
  );
  const [employeeCounts, setEmployeeCounts] = useState<number[]>(
    itemData.employeeCounts
  );
  const [achieveBep, setAchieveBep] = useState<YearData>(defaultYearData);
  const [yearData, setYearData] = useState<YearData[]>([]);
  const [positiveYear, setPositiveYear] = useState(0);
  const [plan, setPlan] = useState<YearData[]>(itemData.plan);
  const [averageSales, setAverageSales] = useState(0);

  const performanceParams = {
    ideaName,
    editorContent,
    selectedTheme,
    imagePreview,
    categoryData,
    costItems,
    setCostItems,
    profitMargin,
    setProfitMargin,
    totalCost,
    setTotalCost,
    sellingPrice,
    setSellingPrice,
    totalSelYear,
    setTotalSelYear,
    selectedTheme4Psr,
    setSelectedTheme4Psr,
    maraketCap,
    setMaraketCap,
    tradeCounts,
    setTradeCounts,
    employeeCounts,
    setEmployeeCounts,
    achieveBep,
    positiveYear,
    yearData,
    plan,
    averageSales,
  };

  const parValueItem = costItems.find((item) => item.apiId === "par_value");
  const parValue = parValueItem ? parValueItem.amount : 0;

  // 화면 동적 구성
  const attachSetArray = data.attachments.map((file, index) => (
    <div key={index}>
      <div
        className={styled.attachArryWrap}
        onClick={() => clickFileDownload(file)}
      >
        <div className={styled.attachFileIcon}></div>
        <div className={styled.attachFileText}>{file.file_name}</div>
      </div>
    </div>
  ));

  const teamMemberSetArray = data.investments.map((member, index) => (
    <div key={index}>
      <div className={styled.memberWrap}>
        <div className={styled.memberImg}>{member.ideation_id}</div>
        <div className={styled.memberName}>{member.investor.name}</div>
        <div className={styled.memberPositonWrap}>
          {/* {member.member_position.map((item, index) => (
            <div key={index} className={styled.memberPosition}>
              {item}
            </div>
          ))} */}
        </div>
      </div>
    </div>
  ));

  const renderOnlineInfoRow = (onlineYn: string) => {
    if (onlineYn === "Y") {
      return (
        <tr>
          <td>온라인사업설명회</td>
          <td className={styled.tableRight}>D-30일</td>
        </tr>
      );
    }
    return null;
  };

  const renderOnlineBtn = (onlineYn: string) => {
    if (onlineYn === "Y") {
      return (
        <div className={`${styled.btn} ${styled.blueBtn}`}>
          온라인 사업설명회
        </div>
      );
    } else {
      return (
        <div className={`${styled.btn} ${styled.blueBtn}`}>
          온라인 사업설명회 일정 선택
        </div>
      );
    }
  };

  // 로그인 유형에 따라 달라짐(온라인 사업설명회/투자의향전달)
  const renderInvestApplyBtn = () => {
    if (userInfo.role == "예비창업자") {
      return (
        <div
          className={`${styled.btn} ${styled.whithBtn}`}
          onClick={showInvestmentStatusModal}
        >
          투자 신청현황
        </div>
      );
    } else {
      return (
        <div
          className={`${styled.btn} ${styled.whithBtn}`}
          onClick={showInvestSendModal}
        >
          투자의향전달
        </div>
      );
    }
  };

  // 기타 함수
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return dateString.split("T")[0]; // "T"를 기준으로 문자열을 분리하여 날짜 부분만 반환
  };

  const showLiveStreaming = () => {
    const popupWidth = 800;
    const popupHeight = 600;
    const left = (window.screen.width - popupWidth) / 2;
    const top = (window.screen.height - popupHeight) / 2;

    // 새 창에서 URL 열기
    window.open(
      "https://meet.google.com/nou-stdt-ipm",
      "GoogleMeetPopup",
      `width=${popupWidth},height=${popupHeight},top=${top},left=${left},resizable=yes,scrollbars=yes`
    );
  };

  const clickFileDownload = (value: Attachment) => {
    const downloadUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/attachment/${value.id}`;
    // 파일 다운로드를 위한 `a` 태그 생성 및 클릭
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.target = "_blank"; // 새 창에서 열기 (필요한 경우)
    link.download = ""; // 파일 이름을 지정할 수도 있습니다
    link.click();
  };

  interface CustomModalProps {
    isOpen: boolean;
    closeModal: () => void;
    content: React.ReactNode; // or React.ReactElement if you want to be more specific
    customStyles?: React.CSSProperties; // Optional, as not all modals may need custom styles
  }

  /* 모달 재사용 */
  const ModalComponent: React.FC<CustomModalProps> = ({
    isOpen,
    closeModal,
    content,
    customStyles,
  }) => (
    <Modal
      isOpen={isOpen}
      ariaHideApp={false}
      onRequestClose={closeModal}
      style={{
        content: {
          top: "50%",
          left: "50%",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          ...customStyles,
          borderRadius: "8px",
          boxShadow: "0px 6px 16px 0px #A5ABBA4D",
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)", // 검은색 배경, 투명도 50%
          zIndex: 1000, // 다른 요소 위에 나타나도록 설정
        },
      }}
    >
      {content}
    </Modal>
  );

  const [isInvestSimulationOpen, setInvestSimulationOpen] = useState(false); // 투자 시뮬레이션 모달
  const [isInvestmentStatusOpen, setInvestmentStatusOpen] = useState(false); // 투자신청현황 모달
  const [isFinalInvestStatusOpen, setFinalInvestStatusOpen] = useState(false); // 최종매칭신청현황 모달
  const [isBeforeContractOpen, setBeforeContractOpen] = useState(false); // 투자의향서 작성 전 확인 모달
  const [isContractWriteOpen, setContractWriteOpen] = useState(false); // 투자의향계약서 작성 모달
  const [isContractSignOpen, setContractSignOpen] = useState(false); // 전자서명 모달
  const [isChatOpen, setChatOpen] = useState(false); // 채팅방 모달
  const [isIdeaCompanyInfoOpen, setIdeaCompanyInfoOpen] = useState(false); // 아이디어 보유자 정보 모달
  const [isInvestSendOpen, setInvestSendOpen] = useState(false); // 투자의향전달달 모달
  const [investorInfo, setInvestorInfo] = useState<any>(null);

  const showInvestSimulationModal = () => {
    setInvestSimulationOpen(true);
  };
  const closInvestSimulationModal = () => {
    setInvestSimulationOpen(false);
  };
  const showInvestmentStatusModal = () => {
    setInvestmentStatusOpen(true);
  };
  const closInvestmentStatusModal = () => {
    setInvestmentStatusOpen(false);
  };
  const showFinalInvestStatusModal = () => {
    setFinalInvestStatusOpen(true);
  };
  const closFinalInvestStatusModal = () => {
    setFinalInvestStatusOpen(false);
  };
  const showBeforeContractModal = () => {
    setBeforeContractOpen(true);
  };
  const closBeforeContractModal = () => {
    setBeforeContractOpen(false);
  };
  const showContractWriteModal = () => {
    setContractWriteOpen(true);
  };
  const closContractWriteModal = () => {
    setContractWriteOpen(false);
  };
  const showContractSignModal = () => {
    setContractSignOpen(true);
  };
  const closContractSignModal = () => {
    setContractSignOpen(false);
  };
  const showChatModal = () => {
    setChatOpen(true);
  };
  const closChatModal = () => {
    setChatOpen(false);
  };
  const showIdeaCompanyInfoModal = () => {
    setIdeaCompanyInfoOpen(true);
  };
  const closIdeaCompanyInfoModal = () => {
    setIdeaCompanyInfoOpen(false);
  };
  const showInvestSendModal = () => {
    setInvestSendOpen(true);
  };
  const closInvestSendModal = () => {
    setInvestSendOpen(false);
  };

  const openBeforeCheckContractPop = (data: any) => {
    setInvestorInfo(data);
    setFinalInvestStatusOpen(false);
    showBeforeContractModal();
  };
  const openContractWritePop = (data: any) => {
    setInvestorInfo(data);
    setBeforeContractOpen(false);
    showContractWriteModal();
  };
  const openContractSignPop = (data: any) => {
    setInvestorInfo(data);
    setContractWriteOpen(false);
    showContractSignModal();
  };
  const openChatPop = (data: any) => {
    setInvestorInfo(data);
    setContractSignOpen(false);
    showChatModal();
  };

  const Step1 = () => {
    return (
      <div>
        <div className={styled.ideaContentsContainer}>
          <div className={styled.contentsMainWrap}>
            <div className={styled.ideaDetail}>
              <Viewer initialValue={data.content} />
            </div>

            <div className={styled.ideaVideo} onClick={showLiveStreaming}>
              {/* 화상채팅 */}
            </div>
            <div className={styled.title}>첨부파일</div>
            <div className={styled.attachWrap}>
              <div className={styled.attachFile}>{attachSetArray}</div>
            </div>
            <div className={styled.teamMemberWrap}>
              <div className={styled.title}>멤버</div>
              <div className={styled.teamMemberArry}>{teamMemberSetArray}</div>
            </div>
          </div>
          <div className={styled.contentsSideWrap}>
            <div className={styled.side1}>
              <div className={styled.statusWrap}>
                <div className={styled.statusComponent}>
                  <div
                    className={`${styled.statusImg} ${styled.bookmark}`}
                  ></div>
                  북마크 수<div>{data.view_count}</div>
                </div>
                <div className={styled.statusComponent}>
                  <div
                    className={`${styled.statusImg} ${styled.viewsCnt}`}
                  ></div>
                  조회 수<div>{data.view_count}</div>
                </div>
                <div className={styled.statusComponent}>
                  <div
                    className={`${styled.statusImg} ${styled.updateDt}`}
                  ></div>
                  업데이트
                  <div>{formatDate(data.close_date)}</div>
                </div>
              </div>
              {renderInvestApplyBtn()}
              <div
                className={`${styled.btn} ${styled.blueBtn}`}
                onClick={showFinalInvestStatusModal}
              >
                최종 매칭신청형황
              </div>
              <div className={styled.bookMarkShareWrap}>
                <div className={styled.iconWrap}>
                  <div className={`${styled.iconImg} ${styled.bookmark}`}></div>
                  북마크
                </div>
                <div className={styled.iconWrap}>
                  <div className={`${styled.iconImg} ${styled.share}`}></div>
                  공유하기
                </div>
              </div>
            </div>
            <div className={styled.side2}>
              <div className={styled.sideTitle}>딜 조건</div>
              <table>
                <thead>
                  <tr>
                    <td>지분율</td>
                    <td className={styled.tableRight}>{0}</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>주당 액면가</td>
                    <td className={styled.tableRight}>{parValue}</td>
                  </tr>
                  <tr>
                    <td>최소 투자금액</td>
                    <td className={styled.tableRight}>
                      {parValueItem ? parValue.toLocaleString() : 0}
                    </td>
                  </tr>
                  <tr>
                    <td>최대 투자금액</td>
                    <td className={styled.tableRight}>{0}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={styled.side3}>
              <div className={styled.sideTitle}>진행상태</div>
              <table>
                <thead>
                  <tr>
                    <td>2024년 12월 3일</td>
                    <td className={styled.tableRight}>{data.status}</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>투자자 수</td>
                    <td className={styled.tableRight}>
                      {data.investments.length}
                    </td>
                  </tr>
                  <tr>
                    <td>최대 투자자 수</td>
                    <td className={styled.tableRight}>
                      {data.investments.length}
                    </td>
                  </tr>
                  <tr>
                    <td>모집금액</td>
                    <td className={styled.tableRight}>{0}</td>
                  </tr>
                  {/* 온라인사업설명회 D-day */}
                  {renderOnlineInfoRow("Y")}
                </tbody>
              </table>
              {/* 온라인사업설명회 버튼 */}
              {renderOnlineBtn("Y")}

              <div
                className={`${styled.btn} ${styled.whithBtn}`}
                onClick={showIdeaCompanyInfoModal}
              >
                아이디어 보유자정보확인
              </div>
            </div>
          </div>
        </div>

        {/* 투자신청현황 */}
        <ModalComponent
          isOpen={isInvestmentStatusOpen}
          closeModal={closInvestmentStatusModal}
          content={
            <InvestStatusPop
              closeModal={closInvestmentStatusModal}
              viewOption={""}
              openBeforeCheckContractPop={openBeforeCheckContractPop}
            />
          }
          customStyles={{ width: "468px", height: "90%", padding: "20px 40px" }}
        />

        {/* 최종 매칭신청현황 */}
        <ModalComponent
          isOpen={isFinalInvestStatusOpen}
          closeModal={closFinalInvestStatusModal}
          content={
            <InvestStatusPop
              closeModal={closFinalInvestStatusModal}
              viewOption={"final"}
              openBeforeCheckContractPop={openBeforeCheckContractPop}
            />
          }
          customStyles={{ width: "468px", height: "90%", padding: "20px 40px" }}
        />

        {/* 투자의향서 작성 전 확인 */}
        <ModalComponent
          isOpen={isBeforeContractOpen}
          closeModal={closBeforeContractModal}
          content={
            <BeforeCheckContractPop
              closeModal={closBeforeContractModal}
              data={investorInfo}
              openContractWritePop={openContractWritePop}
            />
          }
          customStyles={{
            width: "770px",
            height: "305px",
            padding: "40px 40px 0 40px",
          }}
        />

        {/* 투자의향계약서 */}
        <ModalComponent
          isOpen={isContractWriteOpen}
          closeModal={closContractWriteModal}
          content={
            <ContractWritePop
              closeModal={closContractWriteModal}
              data={investorInfo}
              openContractSignPop={openContractSignPop}
            />
          }
          customStyles={{
            width: "800px",
            height: "90%",
            padding: "40px 30px",
          }}
        />

        {/* 전자서명 */}
        <ModalComponent
          isOpen={isContractSignOpen}
          closeModal={closContractSignModal}
          content={
            <ContractSignPop
              closeModal={closContractSignModal}
              data={investorInfo}
              openChatPop={openChatPop}
            />
          }
          customStyles={{
            width: "440px",
            height: "404px",
            padding: "40px 0 0 0",
          }}
        />

        {/* 채팅 */}
        <ModalComponent
          isOpen={isChatOpen}
          closeModal={closChatModal}
          content={<ChatPop closeModal={closChatModal} data={investorInfo} />}
          customStyles={{
            width: "478px",
            height: "649px",
            padding: "20px",
          }}
        />

        {/* 아이디어 보유자 정보 확인 */}
        <ModalComponent
          isOpen={isIdeaCompanyInfoOpen}
          closeModal={closIdeaCompanyInfoModal}
          content={
            <IdeaCompanyInfoPop
              closeModal={closIdeaCompanyInfoModal}
              data={investorInfo}
            />
          }
          customStyles={{
            width: "320px",
            height: "auto",
            minHeight: "600px",
            padding: "22px 24px 22px 24px",
          }}
        />

        {/* 투자의향전달 */}
        <ModalComponent
          isOpen={isInvestSendOpen}
          closeModal={closInvestSendModal}
          content={
            <InvestSendPop
              closeModal={closInvestSendModal}
              data={investorInfo}
            />
          }
          customStyles={{
            width: "800px",
            height: "649px",
            padding: "40px",
          }}
        />
      </div>
    );
  };

  const Step2 = () => {
    return (
      <div>
        <div className={styled.investContentsContainer}>
          <div>
            <div className={styled.tableContainer}>
              <div className={styled.tableTitleWrap}>
                <div className={styled.tableTitle}>
                  상품가격결정<span></span>
                </div>
                <div className={styled.tableInfo}>단위: 원, %</div>
              </div>
              <div className={styled.tableContentsWrap}>
                <PriceCalculator inputHide="Y" itemData={performanceParams} />
              </div>
            </div>
            <div className={styled.totalContainer}>
              <div className={styled.title}>
                판매가<span>(소비자가격)</span>
              </div>
              <div className={styled.amount}>
                <span>30,000</span>원
              </div>
            </div>
          </div>
          <div>
            <div className={styled.tableContainer}>
              <div className={styled.tableTitleWrap}>
                <div className={`${styled.tableTitle}`}>실적 단위 계산</div>
                <div className={styled.tableInfo}>단위: 원, %</div>
              </div>
              <div className={styled.tableContentsWrap}>
                <PerformanceCalculator
                  inputHide="Y"
                  itemData={performanceParams}
                />
              </div>
            </div>
            <div className={styled.totalContainer}>
              <div className={styled.title}>
                판관비 계<span>(연비용)</span>
              </div>
              <div className={styled.amount}>
                <span>64,600,000</span>원
              </div>
            </div>
          </div>
          <div>
            <div className={styled.tableContainer}>
              <div className={styled.tableTitleWrap}>
                <div className={`${styled.tableTitle}`}>매출계획표</div>
                <div className={styled.tableInfo}>단위: 원, %</div>
              </div>
              <div className={styled.tableContentsWrap}>
                <FinanceCaculator itemData={performanceParams} />
              </div>
            </div>
            <div className={styled.totalContainer}></div>
          </div>
          <div>
            <div className={styled.tableContainer}>
              <div className={styled.tableTitleWrap}>
                <div className={styled.tableTitle}>
                  PSR 가치평가<span></span>
                </div>
                <div className={styled.tableInfo}>단위: 원</div>
              </div>
              <div className={styled.tableContentsWrap}>
                <PsrCalulator inputHide="Y" itemData={performanceParams} />
              </div>
            </div>
            <div className={styled.tableContainer}>
              <div className={styled.tableTitleWrap}>
                <div className={styled.tableTitle}>
                  발행주식 수 설정<span></span>
                </div>
                <div className={styled.tableInfo}>단위: 원</div>
              </div>
              <div className={styled.tableContentsWrap}>
                <StockCalulator
                  name="stock"
                  inputHide="Y"
                  itemData={performanceParams}
                />
              </div>
            </div>

            <div className={styled.totalContainer}></div>
          </div>
          <div>
            <div className={styled.tableContainer}>
              <div className={styled.tableTitleWrap}>
                <div className={styled.tableTitle}>
                  투자목표 설정<span></span>
                </div>
                <div className={styled.tableInfo}>단위: 원</div>
              </div>
              <div className={styled.tableContentsWrap}>
                <StockCalulator
                  name="investGoal"
                  inputHide="Y"
                  itemData={performanceParams}
                />
              </div>
            </div>
          </div>
          <div className={styled.btnWrap}>
            <div
              className={`${styled.btn} ${styled.white}`}
              onClick={showInvestSimulationModal}
            >
              투자 시뮬레이션
            </div>
          </div>
        </div>

        {/* 투자 시뮬레이션 모달 */}
        <ModalComponent
          isOpen={isInvestSimulationOpen}
          closeModal={closInvestSimulationModal}
          content={
            <div>
              {" "}
              <InvestSimulationPop itemData={performanceParams} />
              <div className={styled.modalBtn}>
                <button
                  onClick={closInvestSimulationModal}
                  className={styled.closeBtn}
                >
                  닫기
                </button>
              </div>
            </div>
          }
          customStyles={{
            width: "960px",
            height: "800px",
            padding: "40px",
            borderRadius: "8px",
          }}
        />
      </div>
    );
  };

  const renderComponents = () => {
    switch (activeIndex) {
      case 0:
        return <Step1 />;
      case 1:
        return <Step2 />;
      default:
        return <Step1 />;
    }
  };
  return (
    <div className={styled.selectionIdeaContents}>{renderComponents()}</div>
  );
};

export default IdeaContentsComponents;
