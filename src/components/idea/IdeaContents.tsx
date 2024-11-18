"use client";
import React, { useEffect, useState } from "react";
import styled from "@/components/idea/Idea.module.scss";
import IdeaContentsComponents from "./IdeaContentsComponents";
import { useSearchParams } from "next/navigation";
import ideaData_HomeGym from "../../store/ideaContentsSampleData_HomeGym.json";
import ideaData_MyFootball from "../../store/ideaContentsSampleData_MyFootball.json";
import { IdeaDataType } from "../../model/IdeaDataType";

type Props = {};

const IdeaContents = (props: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const handleActiveIndex = (index: number) => {
    setActiveIndex(index);
  };

  // 데이터 셋팅
  const router = useSearchParams();
  const id = router.get("id") || "1";
  const dataMap: { [key: string]: IdeaDataType } = {
    "1": ideaData_HomeGym,
    "2": ideaData_MyFootball,
  };
  const data = dataMap[id] || null;

  return (
    <div>
      <div className={`${styled.ideaContents}`}>
        <div className={styled.headerWrap}>
          <div className={styled.titleWrap}>
            <div className={styled.titleImg}>
              {data.img_url ? (
                <img src={data.img_url} alt={data.title} />
              ) : (
                <div>이미지가 없습니다.</div>
              )}
            </div>
            <div className={styled.titleTextWrap}>
              <div className={styled.title}>{data.title}</div>
              <div className={styled.desc}>{data.desc}</div>
              <div className={styled.divCd}>{data.div_cd}</div>
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
        data={data}
        setActiveIndex={setActiveIndex}
      />
    </div>
  );
};

export default IdeaContents;
