"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IdeaContentsType } from "@/model/IdeaList";
import styled from "@/components/idea/Idea.module.scss";
import userStore from "@/store/userLoginInfo";
import dynamic from "next/dynamic";
import { defaultYearData, defaultPriceData } from "@/model/financeDefaultData";
import { calculateYearData } from "@/model/financeCalculationFormula";
import {
  ICostInputItem,
  YearData,
  useFinanceStore,
  transformDataForServer,
  updatePriceDataFromServer,
} from "@/model/financeType";

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
  const [plan, setPlan] = useState<YearData[]>([]);
  const [financeId, setFinanceId] = useState<string>();
  const [averageSales, setAverageSales] = useState(0);
  const router = useSearchParams();
  const id = router.get("id");
  const performanceParams = {
    costItems,
    profitMargin,
    tradeCounts,
    employeeCounts,
    totalCost,
    sellingPrice,
    totalSelYear,
    plan,
  };

  // 상태
  useEffect(() => {
    // if (typeof navigator !== "undefined") {
    //   fetchSearchData();
    // }
    console.log("안들어와?");
    if (id) {
      fetchSearchData();
    }
  }, []);

  useEffect(() => {
    if (financeId) {
      settingFinanceData();
    }
  }, [financeId]);

  // 이벤트
  const handleActiveIndex = (index: number) => {
    setActiveIndex(index);
  };

  // 기타 함수
  const stripHtmlTags = (html: string) => {
    if (!html) return "";
    return html.replace(/<\/?[^>]+(>|$)/g, ""); // 정규식을 사용하여 태그 제거
  };

  // 매출계획표 계산
  const create10YearPlan = (
    salesPerTransaction: number,
    salesCostPerTransaction: number,
    initialSalaryPerStaff: number,
    businessPromotionCost: number,
    officeRent: number,
    entertainmentExpenses: number,
    advertisingCost: number,
    contingencyExpenses: number
  ): YearData[] => {
    const years: YearData[] = [];
    let staffCount = employeeCounts[0];
    let salaryPerStaff = initialSalaryPerStaff;
    const salaryIncreaseRate = getAmountByApiId("salary_increase_rate");
    const businessExpenseIncreaseRate = getAmountByApiId(
      "business_expense_increase_rate"
    );
    const officeRentIncreaseRate = getAmountByApiId(
      "office_rent_increase_rate"
    );
    const mainCostIncreaseRate = getAmountByApiId(
      "maintenance_cost_increase_rate"
    );
    const adCostIncreaseRate = getAmountByApiId("ad_cost_increase_rate");
    const contingencyIncreaseRate = getAmountByApiId(
      "contingency_increase_rate"
    );

    for (let year = 1; year <= 10; year++) {
      if (!tradeCounts[year - 1]) {
        console.error(
          `Trade count for year ${year} is missing or invalid:`,
          tradeCounts[year - 1]
        );
      }

      const previousStaffCount =
        year > 1 ? years[year - 2].staffCount : staffCount;
      const previousBusinessPromotionCost =
        year > 1
          ? years[year - 2].businessPromotionCost
          : businessPromotionCost;
      const previousOfficeRent =
        year > 1 ? years[year - 2].officeRent : officeRent;
      const yearData = calculateYearData(
        year,
        tradeCounts[year - 1],
        employeeCounts[year - 1],
        salesPerTransaction,
        salesCostPerTransaction,
        salaryPerStaff,
        businessPromotionCost,
        officeRent,
        entertainmentExpenses,
        advertisingCost,
        contingencyExpenses,
        previousStaffCount,
        previousBusinessPromotionCost,
        businessExpenseIncreaseRate,
        previousOfficeRent,
        officeRentIncreaseRate
      );

      years.push(yearData);

      // Adjust values for next year
      salaryPerStaff *= 1 + salaryIncreaseRate * 0.01; // 연봉인상률
      entertainmentExpenses =
        entertainmentExpenses * (1 + mainCostIncreaseRate * 0.01);
      advertisingCost = advertisingCost * (1 + adCostIncreaseRate * 0.01);
      contingencyExpenses =
        contingencyExpenses * (1 + contingencyIncreaseRate * 0.01);
    }

    return years;
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
        const financeData = await getServerFinanceData();
        if (financeData) {
          console.log("데이터 가져오기 성공:", financeData);
          settingFinanceData();
        } else {
          console.log("데이터가 없습니다.");
        }
      } else {
        console.error("아이디어 불러오기 실패:", response.statusText);
      }
    } catch (error) {
      console.error("서버 요청 오류:", error);
    }
  };

  const getServerFinanceData = (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      try {
        // 공통 URL 및 헤더 설정
        const financeUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/finance`;
        const headers = {
          Authorization: `Bearer ${userInfo.bearer}`,
          Accept: "application/json",
        };

        // 데이터 존재 여부 확인
        const checkResponse = await fetch(`${financeUrl}/${id}`, {
          method: "GET",
          headers,
        });

        // 404 예외 처리
        if (checkResponse.status === 404) {
          console.warn("데이터를 찾을 수 없습니다. (404)");
          setCostItems(defaultPriceData);
          setTradeCounts([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
          setEmployeeCounts([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
          resolve(null); // 데이터가 없음을 resolve
          return;
        }

        if (checkResponse.ok) {
          const data = await checkResponse.json();
          const updatedData = updatePriceDataFromServer(defaultPriceData, data);

          setFinanceId(data.id);
          setCostItems(updatedData);
          setProfitMargin(data.profit_rate);
          setEmployeeCounts(data.employee_counts);
          setTradeCounts(data.trade_counts);
          console.log("들어왔는가? " + updatedData);

          resolve(data); // 데이터를 resolve
        } else {
          const error = `Failed to fetch data: ${checkResponse.statusText}`;
          console.error(error);
          reject(error); // 실패 시 reject
        }
      } catch (error) {
        console.error("An error occurred:", error);
        reject("An error occurred while fetching finance data."); // 오류 시 reject
      }
    });
  };

  const settingFinanceData = () => {
    // 상품가격결정
    const totalTotal = costItems
      .filter((item) => item.formPath === "PriceCalculator")
      .reduce((sum, item) => sum + (item.amount ? item.amount : 0), 0);
    const sellingPrice = totalTotal + totalTotal * (profitMargin / 100);
    setTotalCost(totalTotal);
    setSellingPrice(sellingPrice);

    // 실적 단위 계산
    const totalSelYear = costItems
      .filter((item) => item.formPath === "PerformanceCalculator")
      .reduce((sum, item) => sum + (item.amount ? item.amount : 0), 0);
    setTotalSelYear(totalSelYear);

    // 매출계획표 데이터 셋팅
    setCostDataAll(costItems);

    // 매출계획표 계산
    if (tradeCounts.length > 0 && employeeCounts.length > 0) {
      const newPlan = create10YearPlan(
        sellingPrice,
        totalTotal,
        getAmountByApiId("salary"),
        getAmountByApiId("business_expense"),
        getAmountByApiId("office_rent"),
        getAmountByApiId("maintenance_cost"),
        getAmountByApiId("ad_cost"),
        getAmountByApiId("contingency")
      );
      setPlan(newPlan);

      // 평균매출 계산
      const calAverageSales =
        newPlan.slice(0, 5).reduce((sum, value) => sum + value.sales, 0) / 5;
      setAverageSales(calAverageSales);
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
