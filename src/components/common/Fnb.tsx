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
              시리즈제로는 통신판매중개자로 전자상거래 등에서의 소비자보호에
              관한 법률 제20조(통신판매중계자의 의무와 책임)에 의거하여 아이디어
              보유자와 투자자 간 거래를 중개하는 역할을 수행하며, 서비스를
              올바르게 제공하는지 확인하고 그에 대한 책임을 부담합니다. 또한,
              아이디어 보유자와 투자자 간의 분쟁이 발생할 경우 중재 역할을
              수행하여 해결책을 모색하고 거래의 안정성을 유지하기 위해 적극적인
              역할을 수행하며 소비자의 신뢰를 높이기 위해 노력 하고 있습니다.
            </div>
            <div className={styled.logo} onClick={moveMain}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fnb;
