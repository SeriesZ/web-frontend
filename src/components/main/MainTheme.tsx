import React from "react";
import styled from "@/components/main/MainComponent.module.scss";

type Props = {};

const MainTheme = (props: Props) => {
  const themeData = [
    { id: 1, name: "농업/어업" },
    { id: 2, name: "광업" },
    { id: 3, name: "제조업" },
    { id: 4, name: "전기/가스업" },
    { id: 5, name: "수도/재생업" },
    { id: 6, name: "건설업" },
    { id: 7, name: "도매/소매업" },
    { id: 8, name: "운수/창고업" },
    { id: 9, name: "숙박/음식점업" },
    { id: 10, name: "정보통신업" },
    { id: 11, name: "금융/보험업" },
    { id: 12, name: "부동산업" },
    { id: 13, name: "과학 기술업" },
    { id: 14, name: "시설관리업" },
    { id: 15, name: "교육서비스업" },
    { id: 16, name: "보건업" },
    { id: 17, name: "예술/스포츠업" },
    { id: 18, name: "기타" },
  ];
  return (
    <div className={styled.mainTheme}>
      <div className={styled.themeWrap}>
        {themeData.map((item, index) => {
          return (
            <div key={item.id} className={styled.themeItem}>
              {item.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MainTheme;
