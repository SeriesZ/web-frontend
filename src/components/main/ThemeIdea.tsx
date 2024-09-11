import React from "react";
import styled from "@/components/main/MainComponent.module.scss";
import SectionTitle from "./SectionTitle";
import MainTheme from "./MainTheme";
import CompanyCard from "../common/Card";

type Props = {};

const ThemeIdea = (props: Props) => {
  const data = [
    {
      id: 1,
      title: "홈짐",
      desc: "모바일 디바이스 기반의 어플리케이션을 통해 컴퓨터 비전 기술을 활용하여 집안에서 본인의 체형, 건강을 확인하고..",
      dday: 32,
      dueDt: "2024-06-25",
      hits: 10000,
      rate: 0.8,
      thumbnail: "",
    },
    {
      id: 2,
      title: "마이 풋볼러",
      desc: "Computer Vision 기술을 활용하여 자신의 축구 플레이 영상을 녹화/저장한 후 유명 선수 데이터를 기준으로 부족한 점을 찾아드립니다.",
      dday: 32,
      dueDt: "2024-06-25",
      hits: 10000,
      rate: 0.8,
      thumbnail: "",
    },
    {
      id: 3,
      title: "나만의 드로잉",
      desc: "창작이 가능한 아트테크 플랫폼 나만의 창작물을 Tool 내에서 만들고 결과물을 가상거래소에 업로드하세요!자신의 창작물을 판매할 수 있습니다.",
      dday: 32,
      dueDt: "2024-06-25",
      hits: 10000,
      rate: 0.8,
      thumbnail: "",
    },
    {
      id: 4,
      title: "바디 메이킹",
      desc: "체형 교정이 가능하고 착용감이 편리한 척추 교정 제품! 직장인들의 굽은 등, 거북목의 교정을 위한 저렴하고 합리적인 가격!",
      dday: 32,
      dueDt: "2024-06-25",
      hits: 10000,
      rate: 0.8,
      thumbnail: "",
    },
  ];
  return (
    <div className={`${styled.wrapper} ${styled.themeIdea}`}>
      <SectionTitle
        title={"테마별 아이디어"}
        desc={"투자자에게 관심도가 높은 산업별 아이디어 목록을 알려드립니다."}
        moveUrl={"/idea/list"}
      />
      <MainTheme />
      <div className={styled.cardWrap}>
        {data.map((item, index) => {
          return (
            <React.Fragment key={item.id}>
              <CompanyCard data={item} type={"idea"} />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeIdea;
