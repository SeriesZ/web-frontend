"use client";
import React, { useEffect, useState } from "react";
import styled from "@/components/idea/Idea.module.scss";
import ReactPlayer from "react-player";
import PriceCalculator from "./PriceCalculator";
import PerformanceCalculator from "./PerformanceCalculator";
import FinanceCaculator from "./FinanceCaculator";
import PsrCalulator from "./PsrCalulator";
import StockCalulator from "./StockCalulator";
import InvestSimulationPop from "./InvestSimulationPop";
import Modal from "react-modal";
import { IdeaDataType } from "../../model/IdeaDataType";
import InvestStatusPop from "./InvestStatusPop";
import BeforeCheckContractPop from "./BeforeCheckContractPop";
import ContractWritePop from "./ContractWritePop";
import ContractSignPop from "./ContractSignPop";
import ChatPop from "./ChatPop";

type Props = {
  activeIndex: number;
  data: IdeaDataType;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
};

const IdeaContentsComponents = ({
  activeIndex,
  data,
  setActiveIndex,
}: Props) => {
  const ideaDetailWithLineBreaks = data.idea_detail
    .split("\n")
    .map((line, index) => (
      <div key={index}>
        {line}
        <br />
        <br />
      </div>
    ));

  const attachSetArray = data.attach_file.map((file, index) => (
    <div key={index}>
      <div className={styled.attachArryWrap}>
        <div className={styled.attachFileIcon}></div>
        <div className={styled.attachFileText}>{file}</div>
      </div>
    </div>
  ));

  const teamMemberSetArray = data.team_member.map((member, index) => (
    <div key={index}>
      <div className={styled.memberWrap}>
        <div className={styled.memberImg}>{member.member_img}</div>
        <div className={styled.memberName}>{member.name}</div>
        <div className={styled.memberPositonWrap}>
          {member.member_position.map((item, index) => (
            <div key={index} className={styled.memberPosition}>
              {item}
            </div>
          ))}
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
            <div className={styled.title}>{data.title}의 기업 분석</div>
            <div className={styled.ideaSummery}>{data.idea_summery}</div>
            <div className={styled.ideaDetail}>{ideaDetailWithLineBreaks}</div>
            <div className={styled.ideaVideo}>{/* 화상채팅 */}</div>
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
                  북마크 수<div>{data.bookmark_cnt}</div>
                </div>
                <div className={styled.statusComponent}>
                  <div
                    className={`${styled.statusImg} ${styled.viewsCnt}`}
                  ></div>
                  조회 수<div>{data.views_cnt}</div>
                </div>
                <div className={styled.statusComponent}>
                  <div
                    className={`${styled.statusImg} ${styled.updateDt}`}
                  ></div>
                  업데이트
                  <div>{data.update_dt}</div>
                </div>
              </div>
              <div
                className={`${styled.btn} ${styled.whithBtn}`}
                onClick={showInvestmentStatusModal}
              >
                투자 신청현황
              </div>
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
                    <td className={styled.tableRight}>{data.share_ratio}</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>주당 액면가</td>
                    <td className={styled.tableRight}>{data.par_amt}</td>
                  </tr>
                  <tr>
                    <td>최소 투자금액</td>
                    <td className={styled.tableRight}>{data.min_invest_amt}</td>
                  </tr>
                  <tr>
                    <td>최대 투자금액</td>
                    <td className={styled.tableRight}>{data.max_invest_amt}</td>
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
                    <td className={styled.tableRight}>
                      {data.progress_status}
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>투자자 수</td>
                    <td className={styled.tableRight}>
                      {data.investors_number}
                    </td>
                  </tr>
                  <tr>
                    <td>최대 투자자 수</td>
                    <td className={styled.tableRight}>
                      {data.max_investors_number}
                    </td>
                  </tr>
                  <tr>
                    <td>모집금액</td>
                    <td className={styled.tableRight}>{data.raised_amt}</td>
                  </tr>
                  {/* 온라인사업설명회 D-day */}
                  {renderOnlineInfoRow(data.online_meeting_yn)}
                </tbody>
              </table>
              {/* 온라인사업설명회 버튼 */}
              {renderOnlineBtn(data.online_meeting_yn)}

              <div className={`${styled.btn} ${styled.whithBtn}`}>
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
                <PriceCalculator inputHide="Y" />
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
                <PerformanceCalculator inputHide="Y" />
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
                <div className={`${styled.tableTitle}`}>실적 단위 계산</div>
                <div className={styled.tableInfo}>단위: 원, %</div>
              </div>
              <div className={styled.tableContentsWrap}>
                <FinanceCaculator />
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
                <PsrCalulator inputHide="Y" />
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
                <StockCalulator name="stock" inputHide="Y" />
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
                <StockCalulator name="investGoal" inputHide="Y" />
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
              <InvestSimulationPop />
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
