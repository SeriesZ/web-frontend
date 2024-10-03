"use client";
import React, { useEffect, useState } from "react";
import styled from "@/components/idea/Idea.module.scss";
import ideaData from "../../store/ideaContentsSampleData.json";
import ReactPlayer from "react-player";
import PriceCalculator from "./PriceCalculator";
import PerformanceCalculator from "./PerformanceCalculator";
import FinanceCaculator from "./FinanceCaculator";
import PsrCalulator from "./PsrCalulator";
import StockCalulator from "./StockCalulator";
import InvestSimulationPop from "./InvestSimulationPop";
import Modal from "react-modal";

type Props = {
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
};

const IdeaContentsComponents = ({ activeIndex, setActiveIndex }: Props) => {
  const isBrowser = () => typeof window !== "undefined";
  const handleChangeNextStep = () => {
    setActiveIndex(activeIndex + 1);
    if (!isBrowser()) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const ideaDetailWithLineBreaks = ideaData.idea_detail
    .split("\n")
    .map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
        <br />
      </React.Fragment>
    ));

  const attachSetArray = ideaData.attach_file.map((file, index) => (
    <React.Fragment key={index}>
      <div className={styled.attachArryWrap}>
        <div className={styled.attachFileIcon}></div>
        <div className={styled.attachFileText}>{file}</div>
      </div>
    </React.Fragment>
  ));

  const teamMemberSetArray = ideaData.team_member.map((member, index) => (
    <React.Fragment key={index}>
      <div className={styled.memberWrap}>
        <div className={styled.memberImg}>{member.member_img}</div>
        <div className={styled.memberName}>{member.name}</div>
        <div className={styled.memberPositonWrap}>
          {member.member_position.map((item, index) => (
            <div className={styled.memberPosition}>{item}</div>
          ))}
        </div>
      </div>
    </React.Fragment>
  ));

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const showModal = () => {
    console.log("모달 호출");
    setModalIsOpen(true); // Open the modal
  };

  const closeModal = () => {
    setModalIsOpen(false); // Close the modal
  };

  const Step1 = () => {
    return (
      <div>
        <div className={styled.ideaContentsContainer}>
          <div className={styled.contentsMainWrap}>
            <div className={styled.title}>{ideaData.title}의 기업 분석</div>
            <div className={styled.ideaSummery}>{ideaData.idea_summery}</div>
            <div className={styled.ideaDetail}>{ideaDetailWithLineBreaks}</div>
            <div className={styled.ideaVideo}>
              <ReactPlayer
                className="player"
                url={ideaData.idea_video}
                width="680px"
                heigth="382px"
                playing={false}
                muted={true}
                controls={true}
              />
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
                  북마크 수<div>{ideaData.bookmark_cnt}</div>
                </div>
                <div className={styled.statusComponent}>
                  <div
                    className={`${styled.statusImg} ${styled.viewsCnt}`}
                  ></div>
                  조회 수<div>{ideaData.views_cnt}</div>
                </div>
                <div className={styled.statusComponent}>
                  <div
                    className={`${styled.statusImg} ${styled.updateDt}`}
                  ></div>
                  업데이트
                  <div>{ideaData.update_dt}</div>
                </div>
              </div>
              <div className={`${styled.btn} ${styled.whithBtn}`}>
                투자 신청현황
              </div>
              <div className={`${styled.btn} ${styled.blueBtn}`}>
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
                <tr>
                  <td>지분율</td>
                  <td className={styled.tableRight}>40%</td>
                </tr>
                <tr>
                  <td>주당 액면가</td>
                  <td className={styled.tableRight}>1,000원</td>
                </tr>
                <tr>
                  <td>최소 투자금액</td>
                  <td className={styled.tableRight}>10,000원</td>
                </tr>
                <tr>
                  <td>최대 투자금액</td>
                  <td className={styled.tableRight}>2,000,000,000원</td>
                </tr>
              </table>
            </div>
            <div className={styled.side3}>
              <div className={styled.sideTitle}>진행상태</div>
              <table>
                <tr>
                  <td>2024년 12월 3일</td>
                  <td className={styled.tableRight}>진행중</td>
                </tr>
                <tr>
                  <td>투자자 수</td>
                  <td className={styled.tableRight}>100명</td>
                </tr>
                <tr>
                  <td>최대 투자자 수</td>
                  <td className={styled.tableRight}>120명</td>
                </tr>
                <tr>
                  <td>모집금액</td>
                  <td className={styled.tableRight}>30,000,000원</td>
                </tr>
                <tr>
                  <td>온라인사업설명회</td>
                  <td className={styled.tableRight}>D-30일</td>
                </tr>
              </table>
              <div className={`${styled.btn} ${styled.blueBtn}`}>
                온라인 사업설명회
              </div>
              <div className={`${styled.btn} ${styled.whithBtn}`}>
                아이디어 보유자정보확인
              </div>
            </div>
          </div>
        </div>
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
                {/* <PriceTable /> */}
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
                {/* <PriceTable /> */}
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
                {/* <PriceTable /> */}
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
                {/* <PriceTable /> */}
                <StockCalulator name="investGoal" inputHide="Y" />
              </div>
            </div>
          </div>
          <div className={styled.btnWrap}>
            <div
              className={`${styled.btn} ${styled.white}`}
              onClick={showModal}
            >
              투자 시뮬레이션
            </div>
          </div>
        </div>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              width: "960px", // Set your width
              height: "800px", // Adjust height as needed
              padding: "40px", // Padding for content
              borderRadius: "8px",
            },
          }}
          contentLabel="투자 시뮬레이션 모달"
        >
          <InvestSimulationPop />
          <button onClick={closeModal}>닫기</button>
        </Modal>
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
