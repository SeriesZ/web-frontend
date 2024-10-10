"use client";
import React, { useEffect, useState } from "react";
import styled from "@/components/expert/Expert.module.scss";
import ExpertCategoryComponent from "./ExpertCategoryComponent";
type Props = {};

const ExpertCategory = (props: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const handleActiveIndex = (index: number) => {
    setActiveIndex(index);
  };
  return (
    <div>
      <div className={styled.mainContainer}>
        <div className={styled.headerWrap}>
          <div className={styled.titleWrap}>
            <div className={styled.title}>전문가 유형/분야</div>
            <div className={styled.desc}>
              사업에 도움이 되는 법률 자문은 사업 운영 과정에서 발생할 수 있는
              법적 문제를 미리 예방하고 효율적으로 해결하기 위한 전문가의
              조언입니다. 계약 체결, 투자 유치, 노동 문제, 지식재산권 보호 등
              다양한 분야에서 발생할 수 있는 법적 리스크를 최소화하고, 사업의
              안정적인 성장을 도울 수 있습니다. 법률 자문을 통해 사업의 법적
              안정성을 확보하고, 경쟁 우위를 확보할 수 있습니다.
            </div>
          </div>
        </div>
        <div className={styled.stepWrap}>
          <div
            className={activeIndex === 0 ? styled.active : ""}
            onClick={() => handleActiveIndex(0)}
          >
            변호사
          </div>
          <div
            className={activeIndex === 1 ? styled.active : ""}
            onClick={() => handleActiveIndex(1)}
          >
            회계사
          </div>
          <div
            className={activeIndex === 2 ? styled.active : ""}
            onClick={() => handleActiveIndex(2)}
          >
            변리사
          </div>
          <div
            className={activeIndex === 3 ? styled.active : ""}
            onClick={() => handleActiveIndex(3)}
          >
            노무사
          </div>
          <div
            className={activeIndex === 4 ? styled.active : ""}
            onClick={() => handleActiveIndex(4)}
          >
            세무사
          </div>
        </div>
      </div>
      <ExpertCategoryComponent
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
    </div>
  );
};

export default ExpertCategory;
