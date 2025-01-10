"use client";
import React, { useEffect, useState } from "react";
import styled from "@/components/main/MainComponent.module.scss";
import SectionTitle from "./SectionTitle";
import NoticeRow from "./NoticeRow";

type Props = {};

const AccountInfo = (props: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fade, setFade] = useState("fade-in");
  const [imgSrc, setImgSrc] = useState("/images/main_account_info.png");
  const data = [
    {
      id: 1,
      categoryNm: "예비창업자",
      imgUrl: "/images/main_account_info.png",
      desc: [
        "아이디어를 업로드하여 투자자에게 노출 ",
        "쉽게 활용할 수 있는 원가회계기반의 가격결정, 매출계획수립자동화 Tool ",
        "주식가치 산정을 통한 투자목표금액설정",
        "실시간 영상플랫폼을 활용한 사업설명회개최",
      ],
    },
    {
      id: 2,
      categoryNm: "개인/기관투자자",
      imgUrl: "/images/main_account_invest.png",
      desc: [
        "키워드로 검색하여 우수한 아이디어를 발굴 ",
        "아이디어의 투자 지표를 확인하여 투자금액에 따라 Exit 시점을 확인할 수 있는 자동화 Tool",
        "온라인 사업설명회 참석을 통한 오프라인 미팅 연계",
      ],
    },
    {
      id: 3,
      categoryNm: "전문가",
      imgUrl: "/images/main_account_expert.png",
      desc: [
        "법인설립과정, 사업운영 등 다양한 전문 영역의 이슈를 보유하고 있는 \n예비창업자, 스타트업 신규 고객을 유입",
        "고객에게 발생하는 초기 1회 자문료 수익으로 부가 수익 창출",
      ],
    },
  ];

  // 이벤트
  const handleActiveIndex = (index: number) => {
    if (activeIndex === index) return; // 같은 이미지는 변경하지 않음

    setFade("fade-out");
    setTimeout(() => {
      setImgSrc(data[index].imgUrl);
      setActiveIndex(index);
      setFade("fade-in");
    }, 100); // fade-out 지속 시간 (0.3초) 후 이미지 변경
  };

  const Step1 = () => {
    return (
      <div>
        <h1 className={styled.title}>
          창업을 준비하고 있는{" "}
          <span className={styled.highlight}>예비창업자</span>와
          <br />
          신규 사업을 위해 자금조달이 필요한{" "}
          <span className={styled.highlight}>스타트업</span>이라면?
        </h1>
        <ul className={styled.features}>
          {data[0].desc.map((item, index) => {
            return <li>{item}</li>;
          })}
        </ul>
      </div>
    );
  };

  const Step2 = () => {
    return (
      <div>
        <h1 className={styled.title}>
          창업 시작부터 주주로 참여하고 싶은 <br />
          <span className={styled.highlight}>개인투자자</span>와 우수한
          아이디어를 발굴하여
          <br />
          초기 투자를 희망하는{" "}
          <span className={styled.highlight}>기관투자자</span>라면?
        </h1>
        <ul className={styled.features}>
          {data[1].desc.map((item, index) => {
            return <li>{item}</li>;
          })}
        </ul>
      </div>
    );
  };
  const Step3 = () => {
    return (
      <div>
        <h1 className={styled.title}>
          개인/기업을 상태로 신규 고객을 확보하고 싶은
          <br />
          <span className={styled.highlight}>
            변호사, 변리사, 회계사, 세무사, 노무사 자격을 보유한 전문가
          </span>
          라면?
        </h1>
        <ul className={styled.features}>
          {data[2].desc.map((item, index) => {
            return (
              <li key={index}>
                {/* 개행 문자(\n)를 <br />로 변환 */}
                {item.split("\n").map((line, idx) => (
                  <React.Fragment key={idx}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const renderComponents = () => {
    switch (activeIndex) {
      case 0:
        return <Step1 />;
      case 1:
        return <Step2 />;
      case 2:
        return <Step3 />;
      default:
        return <Step1 />;
    }
  };

  return (
    <div className={`${styled.wrapper} ${styled.notice}`}>
      <SectionTitle
        title={"당신만의 창업의문을열다!"}
        desc={"누구나 Founder가 되어 창업의 꿈을 현실로 만들어주는 플랫폼"}
        iconHidden={true}
      />

      <div className={styled.accountInfoContainer}>
        <div className={styled.imageWrapper}>
          <img
            src={imgSrc}
            alt="창업 이미지"
            className={`${styled.mainImage} ${styled[fade]}`}
          />
        </div>
        <div className={styled.contentWrapper}>
          <div className={styled.tags}>
            <span
              className={`${styled.tag} ${
                activeIndex === 0 ? styled.active : ""
              }`}
              onClick={() => handleActiveIndex(0)}
            >
              예비창업자
            </span>
            <span
              className={`${styled.tag} ${
                activeIndex === 1 ? styled.active : ""
              }`}
              onClick={() => handleActiveIndex(1)}
            >
              개인/기관투자자
            </span>
            <span
              className={`${styled.tag} ${
                activeIndex === 2 ? styled.active : ""
              }`}
              onClick={() => handleActiveIndex(2)}
            >
              전문가
            </span>
          </div>
          {renderComponents()}
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;
