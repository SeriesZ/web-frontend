"use client";
import React, { useEffect, useState } from "react";
import expertStyled from "./Expert.module.scss";
import styled from "@/components/main/MainComponent.module.scss";
import SectionTitle from "../main/SectionTitle";
import expertCounselData from "../../store/expertCounselSampleData.json";
import expertProfileData from "../../store/expertProfileSampleData.json";
import expertSolutionData from "../../store/expertSolutionSampleData.json";
import expertReviewData from "../../store/expertReviewSampleData.json";

type Props = {
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
};

const ExpertCategoryComponent = ({ activeIndex, setActiveIndex }: Props) => {
  const isBrowser = () => typeof window !== "undefined";
  const handleChangeNextStep = () => {
    setActiveIndex(activeIndex + 1);
    if (!isBrowser()) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const Step1 = () => {
    return (
      <div className={expertStyled.sectionContents}>
        <div className={expertStyled.section}>
          <SectionTitle title={"최신상담글"} desc={""} moveUrl={"/idea/list"} />
          <div className={expertStyled.cardWrap}>
            {expertCounselData.slice(0, 2).map((item, index) => (
              <div className={expertStyled.card}>
                <p className={expertStyled.blueText}>{item.category}</p>
                <h3>{item.title}</h3>
                <p className={expertStyled.bottomText}>{item.detail}</p>
                <p className={expertStyled.bottomText}>
                  답변+{item.answer_cnt}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className={expertStyled.section}>
          <SectionTitle
            title={"변호사해결사례"}
            desc={""}
            moveUrl={"/idea/list"}
          />
          <div className={expertStyled.cardWrap}>
            {expertSolutionData.slice(0, 2).map((item, index) => (
              <div className={expertStyled.card}>
                <h3>{item.title}</h3>
                <p className={expertStyled.bottomText}>{item.detail}</p>
                <p
                  className={`${expertStyled.blueText} ${expertStyled.bottomText} `}
                >
                  {item.statue}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className={expertStyled.section}>
          <SectionTitle
            title={"함께하는 변호사"}
            desc={""}
            moveUrl={"/idea/list"}
          />
          <div className={expertStyled.lawyer}>
            {expertProfileData.slice(0, 4).map((item, index) => (
              <div className={expertStyled.lawyerCard}>
                <div className={expertStyled.lawyerCardInnerWrap}>
                  <div className={expertStyled.lawyerImg}></div>
                  <div className={expertStyled.lawyerText}>
                    <h3>{item.name}</h3>
                    <p>{item.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={expertStyled.section}>
          <SectionTitle
            title={"솔직한 상담 후기"}
            desc={""}
            moveUrl={"/idea/list"}
          />
          <div className={expertStyled.feedback}>
            {expertReviewData.slice(0, 3).map((item, index) => (
              <div className={expertStyled.feedbackCard}>
                <h3 className={expertStyled.blueText}>{item.expert_name}</h3>
                <h3>{item.title}</h3>
                <p className={expertStyled.bottomText}>{item.detail}</p>
                <p className={expertStyled.bottomText}>{item.writer}의 후기</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const Step2 = () => {
    return <div>ste2</div>;
  };

  const renderComponents = () => {
    switch (activeIndex) {
      case 0:
        return <Step1 />;
      case 1:
        return <Step1 />;
      default:
        return <Step1 />;
    }
  };
  return (
    <div className={styled.selectionIdeaContents}>{renderComponents()}</div>
  );
};

export default ExpertCategoryComponent;
