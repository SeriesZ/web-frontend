import React from "react";
import styled from "@/components/main/MainComponent.module.scss";

type Props = {
  data: any;
};

const NoticeRow = ({ data }: Props) => {
  return (
    <div className={styled.noticeRow}>
      <div className={styled.top}>
        <div className={styled.category}>{data?.categoryNm}</div>
        <div className={styled.title}>{data?.title}</div>
      </div>
      <div className={styled.bottom}>
        <div className={styled.date}>
          게시일 <span>{data?.regDt}</span>
        </div>
      </div>
    </div>
  );
};

export default NoticeRow;
