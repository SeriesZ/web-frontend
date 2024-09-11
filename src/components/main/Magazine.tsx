import React from "react";
import styled from "@/components/main/MainComponent.module.scss";
import SectionTitle from "./SectionTitle";
import CompanyCard from "../common/Card";

type Props = {};

const Magazine = (props: Props) => {
  const data = [
    {
      id: 1,
      title: "투자를 받기 위해 가장 중요한 10가지 우선 순위",
      desc: "이번 행사는 '청년의 꿈을 세계로'라는 주제로 올해 청년창업사관학교와 글로벌창업사관학교에 입교한 청년 창업가의 성공적인 창업의 시작을 기원하고 창업에 대한 열정을 고취하고자 마련됐다. 올해 입교생은 청년창업사관학교 850명, 글로벌창업사관학교 60명이다.",
    },
    {
      id: 2,
      title: "홈짐의 고객을 생각하는 가치 제공의 방법",
      desc: "주요 리뉴얼 부분은 손잡이로써 기존의 145mm에서 금번 120mm로 줄이며 운동할 때의 불편함은 낮추고 운동감은 높인 점이 특징이다. 또한 손잡이 그립 부분은 기존에는 고무 그립이었으나 널링 처리를 한 블랙 손잡이로 바꿔 그립감도 더욱 높였다. 땀이 나도 미끄러지지 않다는 점 역시 장점이다.",
    },
    {
      id: 3,
      title: "KTH 인베스트먼트의 심사역 인터뷰",
      desc: "이번 투자는 기존 투자자인 에이티넘인베스트먼트, 퓨처플레이, 스마일게이트인베스트먼트, 넥스트랜스가 후속 투자했으며, 신규 투자자로는 IBK기업은행, SL인베스트먼트, 하나벤처스, 우신벤처투자, 삼천리인베스트먼트가 참여했다. 메디인테크는 정부출연연구소인 한국전기연구원에서 내시경 관련 기술을 연구하던 이치원 대표와 김명준 부대표가 2020년 설립한 스타트업이다.",
    },
    {
      id: 4,
      title: "성장하는 기업들의 공통적인 5가지 비밀",
      desc: "연구팀에 따르면 이들 기업의 매출은 팁스 선정 이후 평균 4~5년간 40.1% 증가한 것으로 분석됐다. 연평균 약 9% 성장률이다. 자산은 같은 기간 86% 증가했다. 보유 특허권은 기업당 평균 0.1개 늘어났다. 이들 기업은 기술을 개발한 후 자금 조달과 설비 확충 등으로 시차를 두고 생산과 판매를 늘려 성장하는 것으로 파악됐다. 1~9년간 시점별로 보면 중장기적으로 매출과 자산 증가 속도가 빨라지는 것으로 나타났다.",
    },
  ];
  return (
    <div className={`${styled.wrapper} ${styled.magazine}`}>
      <SectionTitle
        title={"Series 매거진"}
        desc={"시리즈 제로에서 소개하는 벤처시장에 대한 정보지를 제공합니다."}
      />
      <div className={styled.cardWrap}>
        {data.map((item, index) => {
          return (
            <React.Fragment key={item.id}>
              <CompanyCard data={item} />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Magazine;
