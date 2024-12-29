"use client";
import React, { useState, useEffect } from "react";
import styled from "@/components/common/Gnb.module.scss";
import { useRouter } from "next/navigation";
import userStore, { UserInfo } from "@/store/userLoginInfo";

type Props = {};

const Gnb = (props: Props) => {
  // 테스트 로그인 데이터
  const testLoginData: UserInfo[] = [
    {
      id: "user_0",
      name: "",
      email: "",
      role: "비회원",
      groupId: "",
      exp: "",
      bearer: "xxxx",
    },
    {
      id: "user_1",
      name: "예비창업자",
      email: "admin@series0.com",
      role: "예비창업자",
      groupId: "",
      exp: "",
    },
    {
      id: "user_2",
      name: "투자자",
      email: "test1@series0.com",
      role: "투자자",
      groupId: "",
      exp: "",
    },
    {
      id: "user_3",
      name: "전문가",
      email: "test2@series0.com",
      role: "전문가",
      groupId: "",
      exp: "",
    },
  ];

  const { setUserInfo, userInfo, updateBearer } = userStore();
  const router = useRouter();

  // 1. 새로고침 시 localStorage에서 로그인 정보 복원
  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
      switch (JSON.parse(storedUserInfo).role) {
        case "예비창업자":
          break;
        case "투자자":
          break;
        case "전문가":
          break;
        default:
          break;
      }

      const exp = JSON.parse(storedUserInfo).exp;
      if (!isTokenValid(exp)) {
        fetchRefreshToken();
      }
    }
  }, [setUserInfo]);

  // 2. 로그인 정보를 localStorage에 저장
  const saveUserInfo = (info: UserInfo) => {
    setUserInfo(info);
    localStorage.setItem("userInfo", JSON.stringify(info));
  };

  const moveMain = () => {
    router.push("/main");
  };
  const moveMakeIdea = () => {
    router.push(`/idea/register?id=init`);
  };
  const moveExpertPage = () => {
    router.push("/header/expert");
  };
  const moveCompanyGuide = () => {
    router.push("/header/company");
  };
  const moveRegisterIdeaList = () => {
    router.push("/idea/registerList");
  };
  const doLogin = (role: string) => {
    let index = 0;
    switch (role) {
      case "예비창업자":
        index = 1;
        break;
      case "투자자":
        index = 2;
        break;
      case "전문가":
        index = 3;
        break;
      default:
        break;
    }

    moveMain();
    fetchCategoryData(index);
  };

  // 실제 로그인
  const fetchCategoryData = async (index: number) => {
    try {
      const loginData = new URLSearchParams();
      loginData.append("username", "admin@series0.com");
      loginData.append("password", "12341234");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: loginData.toString(),
        }
      );
      const data = await response.json();
      const accessToken = data.access_token;
      const [header, payload, signature] = accessToken.split(".");
      //setUserInfo(base64UrlDecode(payload));

      const defaultUserInfo = {
        id: testLoginData[index].id,
        name: testLoginData[index].name,
        email: testLoginData[index].email,
        role: testLoginData[index].role,
        groupId: "group_1",
        exp: base64UrlDecode(payload).exp,
        bearer: accessToken,
      };
      saveUserInfo(defaultUserInfo);
    } catch (error) {
      console.error("Error fetching category data:", error);
    } finally {
    }
  };

  // 토큰만 가져오기
  const fetchRefreshToken = async () => {
    try {
      const loginData = new URLSearchParams();
      loginData.append("username", "admin@series0.com");
      loginData.append("password", "12341234");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: loginData.toString(),
        }
      );
      const data = await response.json();
      const accessToken = data.access_token;

      updateBearer(accessToken);
    } catch (error) {
      console.error("Error fetching category data:", error);
    } finally {
    }
  };

  // Base64 디코딩 함수
  const base64UrlDecode = (str: string) => {
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/"); // URL-safe Base64 변환
    while (base64.length % 4) {
      base64 += "="; // Padding
    }
    return JSON.parse(atob(base64)); // Base64 디코딩 후 JSON으로 파싱
  };

  // 토큰 만료 되었는지 확인
  function isTokenValid(exp: number) {
    const currentTime = Math.floor(Date.now() / 1000);
    return exp > currentTime;
  }

  // 로그인 유형별로 헤더 셋팅
  const renderMenuItems = () => {
    if (userInfo.role === "비회원") {
      return (
        <>
          <div className={styled.menuItem}>아이디어 제안</div>
          <div className={styled.menuItem}>투자하기</div>
          <div className={styled.menuItem} onClick={moveCompanyGuide}>
            법인 설립
          </div>
          <div className={styled.menuItem} onClick={moveExpertPage}>
            전문가 자문
          </div>
          <div className={styled.menuItem}>표절신고</div>
          <div className={styled.menuItem}>
            더보기
            {
              <div className={styled.dropdownMenu}>
                <ul>
                  <li>서비스 소개</li>
                  <li>시리즈 제로 팀</li>
                  <li>공지사항</li>
                  <li>Q&A</li>
                  <li>시리즈 매거진</li>
                  <li>활동 투자사</li>
                </ul>
              </div>
            }
          </div>
        </>
      );
    } else if (userInfo.role === "예비창업자") {
      return (
        <>
          <div className={styled.menuItem}>
            아이디어 제안{" "}
            {
              <div className={styled.dropdownMenu}>
                <ul>
                  <li onClick={moveMakeIdea}>아이디어 업로드</li>
                  <li onClick={moveRegisterIdeaList}>내 아이디어 관리</li>
                </ul>
              </div>
            }
          </div>
          <div className={styled.menuItem} onClick={moveCompanyGuide}>
            법인 설립
            {
              <div className={styled.dropdownMenu}>
                <ul>
                  <li>법인 설립 신청</li>
                  <li>법인 설립 현황</li>
                  <li>팀 빌딩</li>
                  <li>창업 커뮤니티</li>
                </ul>
              </div>
            }
          </div>
          <div className={styled.menuItem} onClick={moveExpertPage}>
            전문가 자문
            {
              <div className={styled.dropdownMenu}>
                <ul>
                  <li>문의하기</li>
                  <li>내 상담 내역</li>
                </ul>
              </div>
            }
          </div>
          <div className={styled.menuItem}>
            표절 신고
            {
              <div className={styled.dropdownMenu}>
                <ul>
                  <li>신고 리스트</li>
                  <li>신고 업로드</li>
                  <li>내 신고 관리</li>
                </ul>
              </div>
            }
          </div>
          <div className={styled.menuItem}>
            더보기
            {
              <div className={styled.dropdownMenu}>
                <ul>
                  <li>시리즈제로 팀</li>
                  <li>공지사항</li>
                  <li>투자 가이드</li>
                  <li>템플릿 양식</li>
                  <li>Q&A</li>
                  <li>국내 지원 사업</li>
                  <li>시리즈 매거진</li>
                  <li>활동 투자사</li>
                </ul>
              </div>
            }
          </div>
        </>
      );
    } else if (userInfo.role === "투자자") {
      return (
        <>
          <div className={styled.menuItem}>
            투자하기
            {
              <div className={styled.dropdownMenu}>
                <ul>
                  <li>투자하기</li>
                  <li>아이디어 목록</li>
                  <li>내 투자관리</li>
                </ul>
              </div>
            }
          </div>
          <div className={styled.menuItem} onClick={moveExpertPage}>
            전문가 자문
            {
              <div className={styled.dropdownMenu}>
                <ul>
                  <li>전문가 유형/분야</li>
                  <li>문의하기</li>
                  <li>내 상담 내역</li>
                </ul>
              </div>
            }
          </div>
          <div className={styled.menuItem}>
            표절신고
            {
              <div className={styled.dropdownMenu}>
                <ul>
                  <li>신고 리스트</li>
                  <li>신고 업로드</li>
                  <li>내 신고 관리</li>
                </ul>
              </div>
            }
          </div>
          <div className={styled.menuItem}>
            더보기
            {
              <div className={styled.dropdownMenu}>
                <ul>
                  <li>서비스 소개</li>
                  <li>시리즈제로 팀</li>
                  <li>공지사항</li>
                  <li>템플릿 양식</li>
                  <li>Q&A</li>
                  <li>시리즈 매거진</li>
                  <li>활동 투자사</li>
                </ul>
              </div>
            }
          </div>
        </>
      );
    } else if (userInfo.role === "전문가") {
      return (
        <>
          <div className={styled.menuItem} onClick={moveExpertPage}>
            전문가 자문
            {
              <div className={styled.dropdownMenu}>
                <ul>
                  <li>전문가 유형/분야</li>
                  <li>내 상담 내역</li>
                </ul>
              </div>
            }
          </div>
          <div className={styled.menuItem}>
            표절신고
            {
              <div className={styled.dropdownMenu}>
                <ul>
                  <li>신고 리스트</li>
                  <li>신고 업로드</li>
                  <li>내 신고 관리</li>
                </ul>
              </div>
            }
          </div>
          <div className={styled.menuItem}>
            더보기
            {
              <div className={styled.dropdownMenu}>
                <ul>
                  <li>서비스 소개</li>
                  <li>시리즈제로 팀</li>
                  <li>공지사항</li>
                  <li>템플릿 양식</li>
                  <li>Q&A</li>
                  <li>시리즈 매거진</li>
                  <li>활동 투자사</li>
                </ul>
              </div>
            }
          </div>
        </>
      );
    }
  };

  return (
    <div className={styled.gnbContainer}>
      <div className={styled.gnbWrap}>
        <div className={styled.left}>
          <div className={styled.logo} onClick={moveMain}></div>
          <div className={`${styled.menuWrap}`}>{renderMenuItems()}</div>
          <div className={styled.searchWrap}>
            <input type="text" placeholder="아이디어 찾기" />
            <div className={styled.iconSearch}></div>
          </div>
        </div>
        <div className={styled.right}>
          {userInfo.name ? (
            <>
              <div className={styled.myinfo}>
                <div className={styled.name}>{userInfo.name}</div>
                <div
                  className={`${styled.btnArrow} ${
                    styled.isUserOpen ? styled.isOpen : ""
                  }`}
                ></div>
                <div className={styled.dropdownMenuLogin}>
                  <ul>
                    {testLoginData.map((item, index) => {
                      if (userInfo.role === item.role) {
                        return null;
                      }

                      return (
                        <li key={index} onClick={() => doLogin(item.role)}>
                          {item.role}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              <div className={styled.btn} onClick={moveMakeIdea}>
                아이디어 만들기
              </div>
            </>
          ) : (
            <>
              <div className={`${styled.btnText} ${styled.myinfo}`}>
                로그인
                <div className={styled.dropdownMenuLogin}>
                  <ul>
                    <li onClick={() => doLogin("예비창업자")}>예비창업자</li>
                    <li onClick={() => doLogin("투자자")}>투자자</li>
                    <li onClick={() => doLogin("전문가")}>전문가</li>
                  </ul>
                </div>
              </div>
              <div className={styled.btnText}>회원가입</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gnb;
