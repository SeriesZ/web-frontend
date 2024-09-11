import React from "react";
import styled from "@/components/main/MainComponent.module.scss";
import SectionTitle from "./SectionTitle";
import CompanyCard from "../common/Card";

type Props = {};

const CorpList = (props: Props) => {
  const data = [
    {
      id: 1,
      title: "매쉬업벤처스",
      desc: "내일의 집, 부노 등 트렌디한 스타트업을 발굴하여 고도에 안착시킨 시드투자 전문 엑셀러레이팅 회사",
      amount: "2,000억+",
      cnt: 5,
    },
    {
      id: 2,
      title: "블루포인트파트너스",
      desc: "핀테크, 금융 분야의 신기술에 주로 투자하여 관련 토츠, 뱅쓰샐러드 등의 스타트업을 대상으로 Series A, Pre-A를 주도하는 벤처캐피털",
      amount: "2,000억+",
      cnt: 5,
    },
    {
      id: 3,
      title: "더벤처스",
      desc: "국내에 출시된 모바일 게임 분야의 시장점유율 50%인 (투자거래액 기준) 벤처 게임회사 전문 벤처캐피털",
      amount: "2,000억+",
      cnt: 5,
    },
    {
      id: 4,
      title: "해시드벤처스",
      desc: "초기 스타트업을 대상으로 다양한 투자사업 연계 등을 진행하는 예비창업자를 위한 엑셀러레이팅 전문 파트너",
      amount: "2,000억+",
      cnt: 5,
    },
  ];
  return (
    <div className={`${styled.wrapper} ${styled.corpList}`}>
      <SectionTitle
        title={"투자회사 리스트"}
        desc={"시리즈 제로에서 활동 중인 기관 투자회사입니다."}
      />
      <div className={styled.cardWrap}>
        {data.map((item, index) => {
          return (
            <React.Fragment key={item.id}>
              <CompanyCard data={item} type={"corp"} />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default CorpList;
