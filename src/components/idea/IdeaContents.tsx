"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IdeaContentsType } from "@/model/IdeaList";
import styled from "@/components/idea/Idea.module.scss";
import userStore from "@/store/userLoginInfo";
import dynamic from "next/dynamic";
import { Category } from "@/model/IdeaList";
import { defaultYearData, defaultPriceData } from "@/model/financeDefaultData";
import { calculateYearData } from "@/model/financeCalculationFormula";
import {
  ICostInputItem,
  YearData,
  useFinanceStore,
  transformDataForServer,
  updatePriceDataFromServer,
} from "@/model/financeType";
import DaumPostcode from "react-daum-postcode";

type Props = {};
const IdeaContentsComponents = dynamic(
  () => import("./IdeaContentsComponents"),
  { ssr: false }
);

const initCategory: Category = {
  id: "theme_1",
  name: "농업",
  image: "https://cdn-icons-png.flaticon.com/512/194/194041.png",
  description: "",
  psr_value: 3,
};

const IdeaContents = (props: Props) => {
  // 선언
  const { userInfo } = userStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const [contents, setIdeaContents] = useState<IdeaContentsType>();
  const { setCostDataAll, getAmountByApiId, costData } = useFinanceStore();
  const [costItems, setCostItems] = useState<ICostInputItem[]>([]);
  const [profitMargin, setProfitMargin] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [totalSelYear, setTotalSelYear] = useState(0);
  const [tradeCounts, setTradeCounts] = useState<number[]>([]);
  const [employeeCounts, setEmployeeCounts] = useState<number[]>([]);
  const [achieveBep, setAchieveBep] = useState<YearData>(defaultYearData);
  const [yearData, setYearData] = useState<YearData[]>([]);
  const [positiveYear, setPositiveYear] = useState(0);
  const [selectedTheme4Psr, setSelectedTheme4Psr] =
    useState<Category>(initCategory);
  const [plan, setPlan] = useState<YearData[]>([]);
  const [financeId, setFinanceId] = useState<string>("");
  const [averageSales, setAverageSales] = useState(0);
  const router = useSearchParams();
  const id = router.get("id");
  const performanceParams = {
    costItems,
    profitMargin,
    tradeCounts,
    employeeCounts,
    selectedTheme4Psr,
    totalCost,
    sellingPrice,
    totalSelYear,
    plan,
    setFinanceId,
  };

  // 상태
  useEffect(() => {
    // if (typeof navigator !== "undefined") {
    //   fetchSearchData();
    // }
    if (id) {
      fetchSearchData();
    }
  }, [id]);

  // 이벤트
  const handleActiveIndex = async (index: number) => {
    setActiveIndex(index);
  };

  // 기타 함수
  const stripHtmlTags = (html: string) => {
    if (!html) return "";
    return html.replace(/<\/?[^>]+(>|$)/g, ""); // 정규식을 사용하여 태그 제거
  };

  const fetchSearchData = async () => {
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

        // 선택한 카테고리 데이터 생성
        const formattedData: Category = {
          id: data.theme.id,
          name: data.theme.name,
          image: data.theme.image,
          description: "",
          psr_value: data.theme.psr_value,
        };
        setSelectedTheme4Psr(formattedData);
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
          itemData={performanceParams}
          setActiveIndex={setActiveIndex}
        />
      )}
    </div>
  );
};

export default dynamic(() => Promise.resolve(IdeaContents), { ssr: false });
