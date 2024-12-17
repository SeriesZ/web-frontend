import React, { useRef, useEffect, useState } from "react";
import styled from "@/components/idea/InvestPop.module.scss";

type Investor = {
  id: number;
  name: string;
  amount: number;
  equity: number;
  founder_name: string;
};

const IdeaCompanyInfoPop: React.FC<{
  closeModal: () => void;
  data: any;
}> = ({ closeModal, data }) => {
  return (
    <div className={styled.companyContainer}>
      <div className={styled.section}>
        <h3>회사 정보</h3>
        <div className={styled.infoRow}>
          <span>창업팀 정보</span>
          <span>지지</span>
        </div>
        <div className={styled.infoRow}>
          <span>대표자명</span>
          <span>지진우 · 남성</span>
        </div>
        <div className={styled.infoRow}>
          <span>팀 구성일</span>
          <span>2020.09.11</span>
        </div>
        <div className={styled.infoRow}>
          <span>시제품</span>
          <span>지우개</span>
        </div>
        <div className={styled.infoRow}>
          <span>홈페이지</span>
          <span className={styled.imgContainer}>
            <img src="/images/icon-companyInfo-homepage.png"></img>
          </span>
        </div>
        <div className={styled.infoRow}>
          <span>SNS</span>
          <span className={styled.imgContainer}>
            <img src="/images/icon-companyInfo-facebook.png"></img>
            <img src="/images/icon-companyInfo-instagram.png"></img>
          </span>
        </div>
        <div className={styled.infoRow}>
          <span>회사 주소 (예정)</span>
          <span>서울 서초구 방배동 16 3층</span>
        </div>
      </div>

      <div className={styled.section2}>
        <div className={styled.section3}>
          <h3>비즈니스 분야</h3>
          <p>
            바이오/의료 &gt; 의료/약 &gt; 의료,바이오/의료 &gt; 기타 &gt; 기타
          </p>
        </div>

        <div className={styled.section3}>
          <h3>활용 기술</h3>
          <p>데이터 &gt; 빅데이터,클라우드 &gt; 기타</p>
        </div>

        <div className={styled.section3}>
          <h3>희망 투자유치 단계</h3>
          <p>Pre-Seed</p>
        </div>

        <div className={styled.section3}>
          <h3>희망 투자유치 금액</h3>
          <p>3억원</p>
        </div>
      </div>
    </div>
  );
};

export default IdeaCompanyInfoPop;
