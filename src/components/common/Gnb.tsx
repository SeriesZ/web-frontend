"use client";
import React from "react";
import styled from "@/components/common/Gnb.module.scss";
import { useRouter } from "next/navigation";

type Props = {};

const Gnb = (props: Props) => {
  const router = useRouter();
  const moveMain = () => {
    router.push("/main");
  };
  const userInfo = {
    userNm: "김시리즈제로",
  };
  const moveMakeIdea = () => {
    router.push("/idea/register");
  };
  const moveExpertPage = () => {
    router.push("/header/expert");
  };
  const moveCompanyGuide = () => {
    router.push("/header/company");
  };
  return (
    <div className={styled.gnbContainer}>
      <div className={styled.gnbWrap}>
        <div className={styled.left}>
          <div className={styled.logo} onClick={moveMain}></div>
          <div className={styled.menuWrap}>
            <div className={styled.menuItem}>투자하기</div>
            <div className={styled.menuItem} onClick={moveExpertPage}>
              전문가 자문
            </div>
            <div className={styled.menuItem}>표절 신고</div>
            <div className={`${styled.menuItem} ${styled.seeMore}`}>
              더보기
              <div className={styled.dropdownMenu}>
                <div className={styled.menuOption} onClick={moveCompanyGuide}>
                  법인 설립 가이드
                </div>
                <div className={styled.menuOption}>법인 설립 신청</div>
                <div className={styled.menuOption}>팀 빌딩</div>
                <div className={styled.menuOption}>창업 커뮤니티</div>
              </div>
            </div>
          </div>
          <div className={styled.searchWrap}>
            <input type="text" placeholder="아이디어 찾기" />
            <div className={styled.iconSearch}></div>
          </div>
        </div>
        <div className={styled.right}>
          {userInfo ? (
            <>
              <div className={styled.myinfo}>
                <div className={styled.name}>{userInfo.userNm}</div>
                <div
                  className={`${styled.btnArrow} ${
                    styled.isUserOpen ? styled.isOpen : ""
                  }`}
                ></div>
              </div>
              <div className={styled.btn} onClick={moveMakeIdea}>
                아이디어 만들기
              </div>
            </>
          ) : (
            <>
              <div className={styled.btnText}>로그인</div>
              <div className={styled.btnText}>회원가입</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gnb;
