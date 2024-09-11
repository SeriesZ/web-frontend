"use client";
import React from "react";
import styled from "@/components/common/Fnb.module.scss";
import { useRouter } from "next/navigation";

type Props = {};

const Fnb = (props: Props) => {
  const router = useRouter();
  const companyData1 = [
    "시리즈제로",
    "대표이사 고태현",
    "사업자등록번호 258-87-01370",
    "통신판매업신고번호 2021-성남분당-1003",
    "경기 성남시 분당구 판교로 202 PDC A동 111호",
  ];
  const companyData2 = ["이메일 상담 info@series0.kr", "유선 상담 1661-9099"];
  const moveMain = () => {
    router.push("/main");
  };
  return (
    <div className={styled.fnbContainer}>
      <div className={styled.fnbWrap}>
        <div className={styled.top}>
          <div className={styled.left}>
            <div>정책 · 약관</div>
            <div>개인정보처리방침</div>
          </div>
          <div className={styled.right}>
            <div>제휴문의</div>
            <div>공지사항</div>
            <div>인재채용</div>
          </div>
        </div>
        <div className={styled.bottom}>
          <div className={styled.left}>
            <div className={styled.quickMenu}>
              <div className={styled.menuItem}>{`시리즈제로 고객센터`}</div>
              <div className={styled.menuItem}>{`채팅 상담하기 >`}</div>
              <div className={styled.menuItem}>{`문의 등록하기 >`}</div>
              <div className={styled.menuItem}>{`도움말 센터 바로가기 >`}</div>
              <div className={styled.menuItem}>{`Contact for Global >`}</div>
            </div>
            <div className={styled.contactInfo}>
              상담 가능 시간
              <br />
              평일 오전 9시 ~ 오후 6시 (주말, 공휴일 제외){" "}
            </div>
          </div>
          <div className={styled.right}>
            <div className={styled.companyInfo}>
              <div className={styled.company}>
                {companyData1.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className={`${styled.infoTxt} ${
                        index < companyData1.length - 1 ? styled.divide : ""
                      }`}
                    >
                      {item}
                    </div>
                  );
                })}
              </div>
              <div className={styled.company}>
                {companyData2.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className={`${styled.infoTxt} ${
                        index < companyData2.length - 1 ? styled.divide : ""
                      }`}
                    >
                      {item}
                    </div>
                  );
                })}
              </div>
              <div className={styled.company}>© Series0 Co., Ltd.</div>
            </div>
            <div className={styled.warningInfo}>
              일부 상품의 경우 시리즈제로는 통신판매중개자이며 통신판매 당사자가
              아닙니다.
              <br /> 해당되는 상품의 경우 상품, 상품정보, 거래에 관한 의무와
              책임은 스타트업에게 있으므로, 각 상품 페이지에서 구체적인 내용을
              확인하시기 바랍니다.
            </div>
            <div className={styled.logo} onClick={moveMain}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fnb;
