import React from "react";
import styled from "@/components/main/MainComponent.module.scss";
import SectionTitle from "./SectionTitle";
import NoticeRow from "./NoticeRow";

type Props = {};

const NoticePreview = (props: Props) => {
  const data = [
    {
      id: 1,
      categoryNm: "공지사항",
      title: "시리즈제로 리얼 리뷰 콘테스트 수상자 발표",
      regDt: "2024-06-25",
    },
    {
      id: 2,
      categoryNm: "이벤트",
      title: "국내 최초 포토샵 팝업스토어! 포토샵 AI로 세계 일주!",
      regDt: "2024-06-25",
    },
    {
      id: 3,
      categoryNm: "이벤트",
      title: "'리빙크리에이터' 단 3일간 최대 혜택 (2.16-2.18)",
      regDt: "2024-06-25",
    },
    {
      id: 4,
      categoryNm: "보도자료",
      title:
        "시리즈제로 라이콘 육성을 위한 ‘시리즈제로 넥스트브랜드’ 쇼케이스 개최",
      regDt: "2024-06-25",
    },
  ];
  return (
    <div className={`${styled.wrapper} ${styled.notice}`}>
      <SectionTitle
        title={"공지사항"}
        desc={"시리즈 제로의 업데이트 정보 등 다양한 소식을 알려드립니다."}
      />
      <div className={styled.noticeWrap}>
        {data.map((item, index) => {
          return (
            <React.Fragment key={item.id}>
              <NoticeRow data={item} />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default NoticePreview;
