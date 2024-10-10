"use client";
import React, { useEffect, useState } from "react";
import styled from "@/components/idea/Idea.module.scss";
import IdeaContentsComponents from "./IdeaContentsComponents";

type Props = {};

const IdeaContents = (props: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const handleActiveIndex = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div>
      <div className={`${styled.ideaContents}`}>
        <div className={styled.headerWrap}>
          <div className={styled.titleWrap}>
            <div className={styled.titleImg}>이미지</div>
            <div className={styled.titleTextWrap}>
              <div className={styled.title}>홈짐 (Home Gym)</div>
              <div className={styled.desc}>
                서브컬처 도메인 기반 CaaC/C2C 창작 중개 플랫폼
              </div>
              <div className={styled.divCd}>오락/문화</div>
            </div>
          </div>
        </div>
        <div className={styled.stepWrap}>
          <div
            className={activeIndex === 0 ? styled.active : ""}
            onClick={() => handleActiveIndex(0)}
          >
            아이디어 설명
          </div>
          <div
            className={activeIndex === 1 ? styled.active : ""}
            onClick={() => handleActiveIndex(1)}
          >
            투자 조건 확인 및 시뮬레이션
          </div>
        </div>
      </div>
      <IdeaContentsComponents
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
    </div>
  );
};

export default IdeaContents;
