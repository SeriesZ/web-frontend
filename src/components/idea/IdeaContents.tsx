"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IdeaContentsType } from "@/model/IdeaList";
import styled from "@/components/idea/Idea.module.scss";
import userStore from "@/store/userLoginInfo";
import dynamic from "next/dynamic";

type Props = {};
const IdeaContentsComponents = dynamic(
  () => import("./IdeaContentsComponents"),
  { ssr: false }
);

const IdeaContents = (props: Props) => {
  // 선언
  const { userInfo } = userStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const [contents, setIdeaContents] = useState<IdeaContentsType>();
  const router = useSearchParams();
  const id = router.get("id");

  // 상태
  useEffect(() => {
    if (typeof navigator !== "undefined") {
      fetchCategoryData();
    }
  }, []);

  // 이벤트
  const handleActiveIndex = (index: number) => {
    setActiveIndex(index);
  };

  // 기타 함수
  const stripHtmlTags = (html: string) => {
    if (!html) return "";
    return html.replace(/<\/?[^>]+(>|$)/g, ""); // 정규식을 사용하여 태그 제거
  };

  // 서버 통신
  const fetchCategoryData = async () => {
    console.log(process.env.NEXT_PUBLIC_API_BASE_URL);
    console.log(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ideation/${id}`);

    try {
      // 아이디어 내용 조회
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/ideation/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userInfo.bearer}`,
            Accept: "application/json",
            "Content-Type": "application/json;charset=utf-8",
          },
          mode: "cors",
        }
      );

      // 응답 처리
      if (response.ok) {
        const data = await response.json();
        setIdeaContents(data);
      } else {
        console.error("아이디어 불러오기 실패:", response.statusText);
      }
    } catch (error) {
      console.error("서버 요청 오류:", error);
    }
  };

  return (
    <div>
      <div className={`${styled.ideaContents}`}>
        <div className={styled.headerWrap}>
          <div className={styled.titleWrap}>
            <div className={styled.titleImg}>
              {contents?.images?.[0]?.file_path ? (
                <img
                  src={contents.images[0].file_path}
                  alt={contents?.title || "이미지"}
                />
              ) : (
                <div>이미지가 없습니다.</div>
              )}
            </div>
            <div className={styled.titleTextWrap}>
              <div className={styled.title}>
                {contents?.title || "제목이 없습니다."}
              </div>
              <div className={styled.desc}>
                {contents
                  ? stripHtmlTags(contents?.content)
                  : "내용이 없습니다."}
              </div>
              <div className={styled.divCd}>
                {contents?.theme?.name || "테마 없음"}
              </div>
            </div>
          </div>
        </div>
        <div className={styled.stepWrap}>
          <div
            className={activeIndex === 0 ? styled.active : ""}
            onClick={() => handleActiveIndex(0)}
          >
            아이디어 설명
          </div>
          <div
            className={activeIndex === 1 ? styled.active : ""}
            onClick={() => handleActiveIndex(1)}
          >
            투자 조건 확인 및 시뮬레이션
          </div>
        </div>
      </div>
      {contents && (
        <IdeaContentsComponents
          activeIndex={activeIndex}
          data={contents}
          setActiveIndex={setActiveIndex}
        />
      )}
    </div>
  );
};

export default dynamic(() => Promise.resolve(IdeaContents), { ssr: false });
