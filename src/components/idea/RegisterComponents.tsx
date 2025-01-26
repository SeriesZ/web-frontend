"use client";
import React, { useEffect, useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import {
  Category,
  IdeaContentsType,
  initializeIdeaContents,
} from "@/model/IdeaList";
import {
  ICostInputItem,
  YearData,
  useFinanceStore,
  transformDataForServer,
  updatePriceDataFromServer,
} from "@/model/financeType";
import { defaultYearData, defaultPriceData } from "@/model/financeDefaultData";
import { calculateYearData } from "@/model/financeCalculationFormula";
import styled from "@/components/idea/Idea.module.scss";
import FileUpload from "./FileUpload";
import CustomSelectBox from "../common/CustomSelectBox";
import PriceCalculator from "./PriceCalculator";
import PerformanceCalculator from "./PerformanceCalculator";
import IncreaseRateCalulator from "./IncreaseRateCalulator";
import FinanceCaculator from "./FinanceCaculator";
import PsrCalulator from "./PsrCalulator";
import StockCalulator from "./StockCalulator";
import ToolTipComponent from "./ToolTipComponent";
import YearUserCnt from "./YearUserCnt";
import userStore from "@/store/userLoginInfo";
import dynamic from "next/dynamic";
import Modal from "react-modal";
import InvestSimulationPop from "./InvestSimulationPop";
import IdeaRegistFinalSubmitPop from "./popup/IdeaRegistFinalSubmitPop";
import TextEditor from "./TextEditor";

type Props = {
  activeIndex: number;
  ideaId: string;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
};

interface SaveNewIdeaResponse {
  id: string; // 반환할 데이터의 타입
}

const NoSsrEditor = dynamic(
  () => import("./TextEditor").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <p>에디터 불러오는 중...</p>,
  }
);

const RegisterComponents = ({ activeIndex, ideaId, setActiveIndex }: Props) => {
  const isBrowser = () => typeof window !== "undefined";
  const { userInfo } = userStore();
  const router = useRouter();

  // 아이디 토큰 관련
  let bearer = userInfo.bearer;
  if (typeof window !== "undefined") {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      bearer = JSON.parse(storedUserInfo).bearer;
    }
  }

  // step1 관련
  const childInputRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [repreFiles, setRepreFiles] = useState<File[]>([]);
  const [detailFiles, setDetailFiles] = useState<File[]>([]);
  const [attachFiles, setAttachFiles] = useState<File[]>([]);
  const [editorContent, setEditorContent] = useState<string>("");
  const [ideationId, setIdeaId] = useState<string>(ideaId);
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  const [contents, setIdeaContents] = useState<IdeaContentsType>();
  const [selectedTheme, setSelectedTheme] = useState<Category>();
  const [ideaName, setIdeaName] = useState("");
  const [closeDt, setCloseDt] = useState("");
  const [status, setStatus] = useState("");
  const [repreFilesMap, setRepreFilesMap] = useState<Map<string, string>>(
    new Map()
  );
  const [attachFilesMap, setAttachFilesMap] = useState<Map<string, string>>(
    new Map()
  );
  const [repreReadyUpload, setRepreReadyUpload] = useState(false);
  const [detailReadyUpload, setDetailReadyUpload] = useState(false);
  const [attachReadyUpload, setAttachReadyUpload] = useState(false);
  const [imagePreview, setImagePreview] = useState(""); // 이미지 미리보기 상태

  // step2 관련
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

  // step3 관련
  const [maraketCap, setMaraketCap] = useState(0);
  const [selectedTheme4Psr, setSelectedTheme4Psr] = useState<Category>(
    categoryData[0]
  );
  const [averageSales, setAverageSales] = useState(0);

  // step4 관련
  const [isInvestSimulationOpen, setInvestSimulationOpen] = useState(false); // 투자 시뮬레이션 모달
  const [isFinalSubmitOpen, setFinalSubmitOpen] = useState(false); // 투자 시뮬레이션 모달
  const showInvestSimulationModal = () => {
    setInvestSimulationOpen(true);
  };
  const closInvestSimulationModal = () => {
    setInvestSimulationOpen(false);
  };
  const showFinalSubmitModal = () => {
    setFinalSubmitOpen(true);
  };
  const closFinalSubmitModal = () => {
    setFinalSubmitOpen(false);
  };

  const performanceParams = {
    ideaName,
    editorContent,
    selectedTheme,
    imagePreview,
    categoryData,
    costItems,
    setCostItems,
    profitMargin,
    setProfitMargin,
    totalCost,
    setTotalCost,
    sellingPrice,
    setSellingPrice,
    totalSelYear,
    setTotalSelYear,
    selectedTheme4Psr,
    maraketCap,
    setMaraketCap,
    tradeCounts,
    setTradeCounts,
    employeeCounts,
    setEmployeeCounts,
    achieveBep,
    positiveYear,
    yearData,
    plan,
    averageSales,
  };

  // 상태
  useEffect(() => {
    console.log("부모 컴포넌트 최초 실행");
    fetchInitData();
  }, []);

  useEffect(() => {
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
        totalCost,
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
  }, [costItems, profitMargin, tradeCounts, employeeCounts]);

  useEffect(() => {
    const positiveYear1 = findPositiveOperatingIncomeYear(plan);
    if (positiveYear1) {
      setPositiveYear(positiveYear1);
      setAchieveBep(plan[positiveYear1 - 1]);
    } else {
      setPositiveYear(0);
      setAchieveBep(defaultYearData);
    }
  }, [plan]);

  useEffect(() => {
    if (ideaId && repreReadyUpload) {
      const formData = new FormData();
      repreFiles.forEach((file, index) => {
        formData.append(`file`, file, file.name);
      });
    }
  }, [repreFiles]);

  useEffect(() => {
    if (ideaId && attachReadyUpload) {
      const formData = new FormData();
      attachFiles.forEach((file, index) => {
        formData.append(`file`, file, file.name);
        fetchUploadFile("attachment", formData);
      });
    }
  }, [attachFiles]);

  useEffect(() => {
    if (contents) {
      setIdeaName(contents?.title);
      setSelectedTheme({
        id: contents?.theme.id,
        name: contents?.theme.name,
        image: "",
        description: "",
        psr_value: contents?.theme.psr_value,
      });
      setSelectedTheme4Psr({
        id: contents?.theme.id,
        name: contents?.theme.name,
        image: "",
        description: "",
        psr_value: contents?.theme.psr_value,
      });
      setEditorContent(contents?.content);
      setCloseDt(contents?.close_date);
    }
    if (contents?.images) {
      const files = contents.images.map((images) => {
        const { file_name } = images;
        return new File([], file_name);
      });

      if (contents?.images.length > 0) {
        setImagePreview(contents.images[0].file_path);
      }
      setRepreFiles(files);

      const newMap = new Map<string, string>();
      contents.images.map((images) => {
        const { file_name, id } = images;
        newMap.set(file_name, id);
      });
      setRepreFilesMap(newMap);
    }
    if (contents?.attachments) {
      const files = contents.attachments.map((attachment) => {
        const { file_name } = attachment;
        return new File([], file_name);
      });
      setAttachFiles(files);

      const newMap = new Map<string, string>();
      contents.attachments.map((attachment) => {
        const { file_name, id } = attachment;
        newMap.set(file_name, id);
      });
      setAttachFilesMap(newMap);
    }
  }, [contents]);

  useEffect(() => {
    if (ideaId == "init") {
      setIdeaId("");
      setCloseDt("");
      setIdeaContents(initializeIdeaContents);
      setCostItems(defaultPriceData);
      setTradeCounts([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      setEmployeeCounts([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    } else setIdeaId(ideaId);
  }, [ideaId]);

  // 이벤트
  const handleChangeNextStep = () => {
    setActiveIndex(activeIndex + 1);
    if (!isBrowser()) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectTheme = (value: Category) => {
    setSelectedTheme(value);
    setSelectedTheme4Psr(value);
  };

  const handleBlur = () => {
    if (inputRef.current) setIdeaName(inputRef.current.value);
  };

  const handleEditor = (value: string) => {
    if (childInputRef.current) setEditorContent(value);
  };

  const clickFinalSubmit = () => {
    // 최종 제출
    if (!ideationId) {
      saveNewIdea("final").then((data) => {
        checkAndSaveFinanceData(data.id).then((data) => {
          closFinalSubmitModal();
          alert(data);
          router.push("./registerList");
        });
      });
    } else {
      updateIdea("final").then((data) => {
        checkAndSaveFinanceData(ideationId).then((data) => {
          closFinalSubmitModal();
          alert(data);
          router.push("./registerList");
        });
      });
    }
  };

  // 버튼
  const onSubmit = () => {
    console.log("최종 업로드");
    showFinalSubmitModal();
  };

  const saveNewIdea = (statue: string): Promise<SaveNewIdeaResponse> => {
    return new Promise(async (resolve, reject) => {
      try {
        // 유효성 검사
        if (!ideaName) {
          alert("아이디어 제목을 입력해주세요.");
          reject("아이디어 제목 미입력");
          return;
        }
        if (!editorContent) {
          alert("내용을 입력해주세요.");
          reject("내용 미입력");
          return;
        }
        if (!selectedTheme?.id) {
          alert("테마를 선택해주세요.");
          reject("테마 미선택");
          return;
        }
        if (repreFiles.length === 0) {
          alert("대표 이미지를 선택해주세요.");
          reject("대표 이미지 미선택");
          return;
        }

        // FormData 생성
        const formData = new FormData();
        formData.append("title", ideaName);
        formData.append("content", editorContent);
        formData.append("theme_id", selectedTheme.id);
        if (statue == "final") {
          const date = new Date(); // 현재 날짜
          date.setDate(date.getDate() + 30); // 30일 추가
          const futureDate = date.toISOString();
          formData.append("close_date", futureDate);
        }

        repreFiles.forEach((file) => {
          formData.append("images", file, file.name);
        });
        attachFiles.forEach((file) => {
          formData.append("files", file, file.name);
        });

        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/ideation`;

        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userInfo.bearer}`,
            Accept: "application/json",
          },
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setIdeaId(data.id);
          resolve({ id: data.id }); // 성공 시 resolve 호출
        } else {
          const error = `아이디어 저장 실패: ${response.statusText}`;
          alert(error);
          reject(error); // 실패 시 reject 호출
        }
      } catch (error) {
        console.error("아이디어 저장 중 오류 발생:", error);
        reject("서버 요청 오류: " + error); // 오류 시 reject 호출
      }
    });
  };

  const updateIdea = (statue: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        // 유효성 검사
        if (!ideaName) {
          alert("아이디어 제목을 입력해주세요.");
          reject("아이디어 제목 미입력");
          return;
        }
        if (!editorContent) {
          alert("내용을 입력해주세요.");
          reject("내용 미입력");
          return;
        }
        if (!selectedTheme?.id) {
          alert("테마를 선택해주세요.");
          reject("테마 미선택");
          return;
        }

        // close_dt 셋팅팅
        const date = new Date(); // 현재 날짜
        date.setDate(date.getDate() + 30); // 30일 추가
        const futureDate = date.toISOString();

        const queryParams = new URLSearchParams({
          title: ideaName,
          content: editorContent,
          theme_id: selectedTheme.id,
        });

        if (statue == "final") {
          queryParams.append("close_date", futureDate);
        }

        queryParams.toString();
        const realIdeaId = ideaId == "init" ? ideationId : ideaId;
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/ideation/${realIdeaId}?${queryParams}`;

        const response = await fetch(url, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${userInfo.bearer}`,
            Accept: "application/json",
          },
        });

        if (response.ok) {
          resolve("아이디어 업데이트 성공"); // 성공 시 resolve 호출
        } else {
          const error = "아이디어 업데이트 실패: " + response.statusText;
          alert(error);
          reject(error); // 실패 시 reject 호출
        }
      } catch (error) {
        console.error("아이디어 업데이트 중 오류 발생:", error);
        reject("서버 요청 오류: " + error); // 오류 발생 시 reject 호출
      }
    });
  };

  const tempSave = async (data: any) => {
    try {
      console.log("임시 저장 현재 인덱스 :: ", activeIndex);

      switch (activeIndex) {
        // 아이디어 내용 저장
        case 0:
          if (ideaId === "init") {
            await saveNewIdea("").then((data) => {
              alert("아이디어가 성공적으로 저장되었습니다.");
            }); // 아이디어 최초 저장
          } else {
            await updateIdea("").then((data) => {
              alert("성공적으로 수정되었습니다.");
            }); // 아이디어 업데이트
          }
          break;
        case 1:
        case 2:
          if (!ideationId) {
            // 아이디어 저장 먼저 하고 step2 저장 함수로 이동
            saveNewIdea("").then((data) => {
              checkAndSaveFinanceData(data.id).then((data) => {
                alert("성공적으로 저장되었습니다.");
              });
            });
          } else {
            await updateIdea("").then((data) => {
              checkAndSaveFinanceData(ideationId).then((data) => {
                alert("성공적으로 저장되었습니다.");
              });
            }); // 아이디어 업데이트
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.error("서버 요청 오류:", error);
    }
  };

  const preview = () => {
    console.log("미리보기 누름");
    setInvestSimulationOpen(true);
  };

  // 파일 수정
  const fetchUploadFile = async (path: string, form: FormData) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/${path}/${ideaId}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: form,
        }
      );
      if (res.ok) {
        console.info("파일 업로드 성공:", res.statusText);
      } else {
        console.error("파일 업로드 실패:", res.statusText);
      }
    } catch (error) {
      console.error("Error fetching update data:", error);
    } finally {
    }
  };

  // 영업이익 전황 추출
  const findPositiveOperatingIncomeYear = (
    years: YearData[]
  ): number | null => {
    const yearMap: Map<number, number> = new Map();
    for (let i = 0; i < years.length; i++) {
      yearMap.set(i, years[i].operatingIncomeRate);
      if (years[i].operatingIncome > 0) {
        return i + 1;
      }
    }

    let sortedByValue = new Map(
      [...yearMap.entries()].sort((a, b) => a[1] - b[1])
    );
    const lastEntry = Array.from(sortedByValue.entries()).pop();

    return lastEntry ? lastEntry[0] + 1 : null;
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

  // 데이터 로딩 관련
  const fetchInitData = async () => {
    try {
      // 산업군 로드
      const response1 = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/themes`
      );
      const data1 = await response1.json();
      setCategoryData(data1);

      // 아이디어ID가 있으면 데이터 로딩
      if (ideationId) {
        const response2 = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/ideation/${ideationId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${bearer}`,
              Accept: "application/json",
              "Content-Type": "application/json;charset=utf-8",
            },
          }
        );

        if (response2.ok) {
          const data2 = await response2.json();
          setIdeaContents(data2);
        } else {
          console.error("아이디어 불러오기 실패:", response2.statusText);
        }

        getServerFinanceData();
      } else {
        setCostItems(defaultPriceData);
        setTradeCounts([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        setEmployeeCounts([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      }
    } catch (error) {
      console.error("Error fetching category data:", error);
    } finally {
    }
  };

  // step2 임시저장 관련
  const getServerFinanceData = async () => {
    try {
      // 공통 URL 및 헤더 설정
      const financeUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/finance`;
      const headers = {
        Authorization: `Bearer ${bearer}`,
        Accept: "application/json",
      };

      // 데이터 존재 여부 확인
      const checkResponse = await fetch(`${financeUrl}/${ideationId}`, {
        method: "GET",
        headers,
      });

      // 404 예외 처리
      if (checkResponse.status === 404) {
        console.warn("데이터를 찾을 수 없습니다. (404)");
        setCostItems(defaultPriceData);
        setTradeCounts([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        setEmployeeCounts([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        return;
      }

      if (checkResponse.ok) {
        const data = await checkResponse.json();
        const updatedData = updatePriceDataFromServer(defaultPriceData, data);

        setFinanceId(data.id);
        setCostItems(updatedData);
        setProfitMargin(data.profit_rate);
        setEmployeeCounts(data.employee_counts);
        setTimeout(() => {
          setTradeCounts(data.trade_counts);
        }, 300);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("저장 권한이 없습니다.");
    }
  };

  const checkAndSaveFinanceData = (pramIdeaId: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        // 공통 URL 및 헤더 설정
        const financeUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/finance/${pramIdeaId}`;
        const headers = {
          Authorization: `Bearer ${bearer}`,
          Accept: "application/json",
        };

        // 데이터 존재 여부 확인
        const checkResponse = await fetch(financeUrl, {
          method: "GET",
          headers,
        });

        // 데이터 준비
        const serverPayload = transformDataForServer(costItems, ideaId);
        serverPayload.profit_rate = profitMargin;
        serverPayload.sale_price = sellingPrice;
        serverPayload.total_expense = totalSelYear;
        serverPayload.trade_counts = tradeCounts;
        serverPayload.employee_counts = employeeCounts;
        serverPayload.ideation_id = `${pramIdeaId}`;
        serverPayload.id = financeId;
        console.log("저장할 데이터:", serverPayload);

        if (checkResponse.ok) {
          await updateFinanceData(financeUrl, headers, serverPayload);
          resolve("성공적으로 저장되었습니다.");
        } else if (
          checkResponse.status === 401 ||
          checkResponse.status === 500
        ) {
          const error = "데이터 로드 중 오류가 발생하였습니다.";
          alert(error);
          reject(error);
        } else {
          // 데이터가 없는 경우 (POST)
          await createFinanceData(financeUrl, headers, serverPayload);
          resolve("성공적으로 저장되었습니다.");
        }
      } catch (error) {
        console.error("An error occurred:", error);
        alert("저장 권한이 없습니다.");
        reject("저장 권한 오류 발생");
      }
    });
  };

  // PUT 요청
  const updateFinanceData = async (
    url: string,
    headers: HeadersInit,
    payload: any
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/finance`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${userInfo.bearer}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        console.log("Finance data updated successfully.");
      } else {
        console.error(
          "Failed to update finance data. : " + response.statusText
        );
        alert("업데이트에 실패하였습니다.");
      }
    } catch (error) {
      console.error("An error occurred during update:", error);
      alert("업데이트에 실패하였습니다.");
    }
  };

  // POST 요청
  const createFinanceData = async (
    url: string,
    headers: HeadersInit,
    payload: any
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/finance`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userInfo.bearer}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        console.log("Finance data created successfully.");
      } else {
        console.error("Failed to create finance data." + response.statusText);
        alert("재무 저장에 실패하였습니다.");
      }
    } catch (error) {
      console.error("An error occurred during creation:", error);
      alert("재무 저장에 실패하였습니다.");
    }
  };

  /* 모달 재사용 */
  interface CustomModalProps {
    isOpen: boolean;
    closeModal: () => void;
    content: React.ReactNode; // or React.ReactElement if you want to be more specific
    customStyles?: React.CSSProperties; // Optional, as not all modals may need custom styles
  }
  const ModalComponent: React.FC<CustomModalProps> = ({
    isOpen,
    closeModal,
    content,
    customStyles,
  }) => (
    <Modal
      isOpen={isOpen}
      ariaHideApp={false}
      onRequestClose={closeModal}
      style={{
        content: {
          top: "50%",
          left: "50%",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          ...customStyles,
          borderRadius: "8px",
          boxShadow: "0px 6px 16px 0px #A5ABBA4D",
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)", // 검은색 배경, 투명도 50%
          zIndex: 1000, // 다른 요소 위에 나타나도록 설정
        },
      }}
    >
      {content}
    </Modal>
  );

  const Step1 = () => {
    return (
      <>
        <div className={`${styled.section} ${styled.idea}`}>
          <div className={styled.sectionTitle}>
            <span>1</span> 아이디어 입력
          </div>
          <div className={styled.form}>
            <div className={styled.label}>아이디어명</div>
            <input
              type="text"
              placeholder="아이디어명을 입력하세요"
              ref={inputRef}
              defaultValue={ideaName}
              onBlur={handleBlur}
            />
          </div>
          <div className={styled.form}>
            <div className={styled.label}>아이디어 설명</div>
            <div className={styled.editorWrap}>
              <TextEditor
                content={editorContent}
                showType={"editor"}
                ref={childInputRef}
                onChangeContent={handleEditor}
              ></TextEditor>
            </div>
          </div>
          <div className={styled.form}>
            <div className={`${styled.label} ${styled.hasDesc}`}>
              대표 이미지
            </div>
            <div className={styled.desc}>
              아이디어 리스트에 노출되는 대표 이미지를 업로드합니다.
              <br />
              10장의 JPEG, JPG, PNG 파일을 업로드할 수 있습니다.
            </div>
            <FileUpload
              uploadData={repreFiles}
              uploadDataMap={repreFilesMap}
              setUploadData={setRepreFiles}
              setReadyUpload={setRepreReadyUpload}
              extList={["jpeg", "jpg", "png"]}
              limitCnt={10}
              type={"image"}
              id={"representative"}
            />
          </div>
          <div className={styled.form}>
            <div className={`${styled.label} ${styled.hasDesc}`}>
              아이디어 상세 이미지
            </div>
            <div className={styled.desc}>
              투자자에게 투자대상으로 선정받기 위해서는 아이디어의 상세한 설명과
              표현이 중요합니다.
            </div>
            <FileUpload
              uploadData={detailFiles}
              uploadDataMap={repreFilesMap}
              setUploadData={setDetailFiles}
              setReadyUpload={setDetailReadyUpload}
              extList={["jpeg", "jpg", "png"]}
              limitCnt={10}
              type={"image"}
              id={"detail"}
            />
          </div>
          <div className={`${styled.form} ${styled.select}`}>
            <div className={styled.left}>
              <div className={styled.label}>산업군 선택</div>
              <div className={styled.desc}>(1개만 선택 가능)</div>
            </div>
            <div className={styled.selectBoxWrap}>
              <CustomSelectBox
                options={categoryData}
                value={selectedTheme}
                onSelect={handleSelectTheme}
                placeholder="산업군을 선택하세요"
              />
            </div>
          </div>
          <div className={styled.form}>
            <div className={`${styled.label} ${styled.hasDesc}`}>
              아이디어 첨부파일
            </div>
            <div className={styled.desc}>
              아이디어를 표현한 기획서, 사업계획서 등의 문서를 선택하여 업로드
              합니다.
            </div>
            <FileUpload
              uploadData={attachFiles}
              uploadDataMap={attachFilesMap}
              setUploadData={setAttachFiles}
              setReadyUpload={setAttachReadyUpload}
              extList={[]}
              limitCnt={10}
              type={"etc"}
              id={"attach"}
            />
          </div>
        </div>
        <div className={styled.btnWrap}>
          <div className={`${styled.btn} ${styled.white}`} onClick={tempSave}>
            임시저장
          </div>
          <div
            className={`${styled.btn} ${styled.blue}`}
            onClick={handleChangeNextStep}
          >
            다음
          </div>
        </div>
      </>
    );
  };
  const Step2 = () => {
    return (
      <>
        <div className={`${styled.section} ${styled.price}`}>
          <div className={styled.sectionTitle}>
            <span>2-1</span> 상품가격결정
          </div>
          <div className={styled.sectionDesc}>
            예비창업자님의 아이디어 투자를 위해서는 해당 아이디어의 사업화과정을
            포함한 소비자 가격 결정과 가격을 기반으로 한 매출계획이 수립되어야
            합니다.
            <br />본 매출계획은 간단한 입력만으로 자동화될 수 있게 설계되어
            있으며, 각 항목 별 설명을 쉽게 확인할 수 있습니다.
          </div>
          <div className={styled.tableContainer}>
            <div className={styled.tableTitleWrap}>
              <div className={styled.tableTitle}>
                상품가격결정
                <span>
                  <ToolTipComponent index={0} />
                </span>
              </div>
              <div className={styled.tableInfo}>단위: 원, %</div>
            </div>
            <div className={styled.tableContentsWrap}>
              {/* <PriceTable /> */}
              <PriceCalculator inputHide="N" itemData={performanceParams} />
            </div>
          </div>
          <div className={styled.totalContainer}>
            <div className={styled.title}>
              판매가<span>(소비자가격)</span>
            </div>
            <div className={styled.amount}>
              <span>{sellingPrice.toLocaleString()}</span>원
            </div>
          </div>
          <div className={styled.tableContainer}>
            <div className={styled.tableTitleWrap}>
              <div className={styled.tableTitle}>
                실적 단위 계산
                <span>
                  <ToolTipComponent index={7} />
                </span>
              </div>
              <div className={styled.tableInfo}>단위: 원, %</div>
            </div>
            <div className={styled.tableContentsWrap}>
              <PerformanceCalculator
                inputHide="N"
                itemData={performanceParams}
              />
            </div>
          </div>
          <div className={styled.totalContainer}>
            <div className={styled.title}>
              판관비 계<span>(연비용)</span>
            </div>
            <div className={styled.amount}>
              <span>{totalSelYear.toLocaleString()}</span>원
            </div>
          </div>
          <div className={styled.tableContainer}>
            <div className={styled.tableTitleWrap}>
              <div className={styled.tableTitle}>
                인상율 설정
                <span>
                  <ToolTipComponent index={17} />
                </span>
              </div>
              <div className={styled.tableInfo}>단위: %</div>
            </div>
            <div className={styled.tableContentsWrap}>
              <IncreaseRateCalulator
                inputHide="N"
                itemData={performanceParams}
              />
            </div>
          </div>
          <div className={styled.boundaryLine}></div>
        </div>
        <div className={`${styled.section} ${styled.price}`}>
          <div className={styled.sectionTitle}>
            <span>2-2</span> 매출계획 수립
          </div>
          <div className={styled.sectionDesc}>
            예비창업자님의 아이디어 투자를 위해서는 해당 아이디어의 사업화과정을
            포함한 소비자 가격 결정과 가격을 기반으로 한 매출계획이 수립되어야
            합니다.
            <br />본 매출계획은 간단한 입력만으로 자동화될 수 있게 설계되어
            있으며, 각 항목 별 설명을 쉽게 확인할 수 있습니다.
          </div>
          <div className={styled.tableContainer}>
            <div className={styled.tableTitleWrap}>
              <div className={styled.tableTitle}>
                매출계획표<div>(1년~10년차)</div>
                <span>
                  <ToolTipComponent index={18} />
                </span>
              </div>
              <div className={styled.tableInfo}>단위: 수, 원, %</div>
            </div>
            <div className={styled.tableContentsWrap}>
              <FinanceCaculator itemData={performanceParams} />
            </div>
          </div>
          <div className={styled.inputContainer}>
            <div className={`${styled.inputHeader} ${styled.left}`}>
              <div className={styled.title}>거래발생 수</div>
            </div>
            <YearUserCnt name="trade" itemData={performanceParams} />
          </div>
          <div className={styled.inputContainer}>
            <div className={`${styled.inputHeader} ${styled.left}`}>
              <div className={styled.title}>직원 수</div>
            </div>
            <YearUserCnt name="employee" itemData={performanceParams} />
          </div>
          <div className={`${styled.totalContainer} ${styled.final}`}>
            <div className={styled.title}>
              BEP 달성<span>({positiveYear}년차)</span>
            </div>
            <div className={styled.amounts}>
              <div className={styled.item}>
                <div>매출</div>
                <div>
                  <span>{achieveBep.sales.toLocaleString()}</span>원
                </div>
              </div>
              <div className={styled.item}>
                <div>매출원가</div>
                <div>
                  <span>{achieveBep.salesCost.toLocaleString()}</span>원
                </div>
              </div>
              <div className={styled.item}>
                <div>매출총이익</div>
                <div>
                  <span>{achieveBep.grossProfit.toLocaleString()}</span>원
                </div>
              </div>
              <div className={styled.item}>
                <div>판관비</div>
                <div>
                  <span>
                    {Number(
                      achieveBep.adminExpenses.toFixed(0)
                    ).toLocaleString()}
                  </span>
                  원
                </div>
              </div>
              <div className={styled.item}>
                <div>영업이익</div>
                <div>
                  {achieveBep.operatingIncome < 0 ? (
                    <span className={styled.minusValue}>
                      {Number(
                        achieveBep.operatingIncome.toFixed(0)
                      ).toLocaleString()}
                    </span>
                  ) : (
                    <span>
                      {Number(
                        achieveBep.operatingIncome.toFixed(0)
                      ).toLocaleString()}
                    </span>
                  )}
                  원
                </div>
              </div>
              <div className={styled.item}>
                <div>영업이익률</div>
                <div>
                  {achieveBep.operatingIncomeRate < 0 ? (
                    <span className={styled.minusValue}>
                      {Number(
                        achieveBep.operatingIncomeRate.toFixed(0)
                      ).toLocaleString()}
                    </span>
                  ) : (
                    <span>
                      {Number(
                        achieveBep.operatingIncomeRate.toFixed(0)
                      ).toLocaleString()}
                    </span>
                  )}
                  %
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styled.btnWrap}>
          <div className={`${styled.btn} ${styled.white}`} onClick={tempSave}>
            임시저장
          </div>
          <div
            className={`${styled.btn} ${styled.blue}`}
            onClick={handleChangeNextStep}
          >
            다음
          </div>
        </div>
      </>
    );
  };
  const Step3 = () => {
    return (
      <>
        <div className={`${styled.section} ${styled.goal}`}>
          <div className={styled.sectionTitle}>
            <span>3-1</span> 기업가치평가
          </div>
          <div className={styled.sectionDesc}>
            예비창업자님의 아이디어 투자를 위해서는 해당 아이디어의 사업화과정을
            포함한 소비자 가격 결정과 가격을 기반으로 한 매출계획이 수립되어야
            합니다.
            <br />본 매출계획은 간단한 입력만으로 자동화될 수 있게 설계되어
            있으며, 각 항목 별 설명을 쉽게 확인할 수 있습니다.
          </div>
          <div className={styled.tableContainer}>
            <div className={styled.tableTitleWrap}>
              <div className={styled.tableTitle}>
                PSR 가치평가
                <span>
                  <ToolTipComponent index={21} />
                </span>
              </div>
              <div className={styled.tableInfo}>단위: 원</div>
            </div>
            <div className={styled.tableContentsWrap}>
              {/* <PriceTable /> */}
              <PsrCalulator inputHide="N" itemData={performanceParams} />
            </div>
          </div>
          <div className={styled.tableContainer}>
            <div className={styled.tableTitleWrap}>
              <div className={styled.tableTitle}>
                발행주식 수 설정
                <span>
                  <ToolTipComponent index={24} />
                </span>
              </div>
              <div className={styled.tableInfo}>단위: 원</div>
            </div>
            <div className={styled.tableContentsWrap}>
              {/* <PriceTable /> */}
              <StockCalulator
                name="stock"
                inputHide="N"
                itemData={performanceParams}
              />
            </div>
          </div>
        </div>
        <div className={styled.boundaryLine}></div>
        <div className={`${styled.section} ${styled.goal}`}>
          <div className={styled.sectionTitle}>
            <span>3-2</span> 투자목표 설정
          </div>
          <div className={styled.sectionDesc}>
            예비창업자님의 아이디어 투자를 위해서는 해당 아이디어의 사업화과정을
            포함한 소비자 가격 결정과 가격을 기반으로 한 매출계획이 수립되어야
            합니다.
            <br />본 매출계획은 간단한 입력만으로 자동화될 수 있게 설계되어
            있으며, 각 항목 별 설명을 쉽게 확인할 수 있습니다.
          </div>
          <div className={styled.tableContainer}>
            <div className={styled.tableTitleWrap}>
              <div className={styled.tableTitle}>
                투자목표 설정
                <span>
                  <ToolTipComponent index={28} />
                </span>
              </div>
              <div className={styled.tableInfo}>단위: 원</div>
            </div>
            <div className={styled.tableContentsWrap}>
              {/* <PriceTable /> */}
              <StockCalulator
                name="investGoal"
                inputHide="N"
                itemData={performanceParams}
              />
            </div>
          </div>
        </div>
        <div className={styled.btnWrap}>
          <div className={`${styled.btn} ${styled.white}`} onClick={tempSave}>
            임시저장
          </div>
          <div
            className={`${styled.btn} ${styled.blue}`}
            onClick={handleChangeNextStep}
          >
            다음
          </div>
        </div>
      </>
    );
  };
  const Step4 = () => {
    return (
      <>
        <div>
          <div className={`${styled.section} ${styled.final}`}>
            <div className={`${styled.sectionTitle} ${styled.final}`}>
              <span>1</span> 아이디어 입력
            </div>
            <div className={`${styled.form} ${styled.final}`}>
              <div className={`${styled.label} ${styled.final}`}>
                아이디어명
              </div>
              <div className={styled.finalContent}>{ideaName}</div>
            </div>
            <div className={styled.form}>
              <div className={`${styled.label} ${styled.final}`}>
                아이디어 설명
              </div>
              <div className={styled.finalContent}>
                <TextEditor
                  content={editorContent}
                  showType={"viewer"}
                ></TextEditor>
              </div>
            </div>
            <div className={styled.form}>
              <div className={`${styled.label} ${styled.final}`}>
                대표 이미지
              </div>
              <div className={styled.desc}></div>
              <FileUpload
                uploadData={repreFiles}
                uploadDataMap={repreFilesMap}
                setUploadData={setRepreFiles}
                setReadyUpload={setRepreReadyUpload}
                extList={["jpeg", "jpg", "png"]}
                limitCnt={10}
                type={"image"}
                id={"representative"}
              />
            </div>
            <div className={styled.form}>
              <div className={`${styled.label} ${styled.final}`}>
                아이디어 상세 이미지
              </div>
              <FileUpload
                uploadData={detailFiles}
                uploadDataMap={repreFilesMap}
                setUploadData={setDetailFiles}
                setReadyUpload={setDetailReadyUpload}
                extList={["jpeg", "jpg", "png"]}
                limitCnt={10}
                type={"image"}
                id={"detail"}
              />
            </div>
            <div className={styled.form}>
              <div className={`${styled.label} ${styled.final}`}>산업군</div>
              <div className={styled.finalContent}>{selectedTheme?.name}</div>
            </div>

            <div className={styled.form}>
              <div className={`${styled.label} ${styled.final}`}>
                아이디어 첨부파일
              </div>
              <FileUpload
                uploadData={attachFiles}
                uploadDataMap={repreFilesMap}
                setUploadData={setAttachFiles}
                setReadyUpload={setAttachReadyUpload}
                extList={[]}
                limitCnt={10}
                type={"etc"}
                id={"attach"}
              />
            </div>
          </div>
          <div className={`${styled.section} ${styled.final}`}>
            <div className={`${styled.sectionTitle} ${styled.final}`}>
              <span>2-1</span> 상품가격결정
            </div>
            <div className={styled.tableContainer}>
              <div className={styled.tableTitleWrap}>
                <div className={`${styled.tableTitle} ${styled.final}`}>
                  상품가격결정
                </div>
                <div className={styled.tableInfo}>단위: 원, %</div>
              </div>
              <div className={styled.tableContentsWrap}>
                {/* <PriceTable /> */}
                <PriceCalculator inputHide="Y" itemData={performanceParams} />
              </div>
            </div>
            <div className={styled.totalContainer}>
              <div className={styled.title}>
                판매가<span>(소비자가격)</span>
              </div>
              <div className={styled.amount}>
                <span>{sellingPrice.toLocaleString()}</span>원
              </div>
            </div>
            <div className={styled.tableContainer}>
              <div className={styled.tableTitleWrap}>
                <div className={`${styled.tableTitle} ${styled.final}`}>
                  실적 단위 계산
                </div>
                <div className={styled.tableInfo}>단위: 원, %</div>
              </div>
              <div className={styled.tableContentsWrap}>
                <PerformanceCalculator
                  inputHide="Y"
                  itemData={performanceParams}
                />
              </div>
            </div>
            <div className={styled.totalContainer}>
              <div className={styled.title}>
                판관비 계<span>(연비용)</span>
              </div>
              <div className={styled.amount}>
                <span>{totalSelYear.toLocaleString()}</span>원
              </div>
            </div>
            <div className={styled.tableContainer}>
              <div className={styled.tableTitleWrap}>
                <div className={`${styled.tableTitle} ${styled.final}`}>
                  인상율 설정
                </div>
                <div className={styled.tableInfo}>단위: %</div>
              </div>
              <div className={styled.tableContentsWrap}>
                <IncreaseRateCalulator
                  inputHide="Y"
                  itemData={performanceParams}
                />
              </div>
            </div>
          </div>
          <div className={`${styled.section} ${styled.final}`}>
            <div className={`${styled.sectionTitle} ${styled.final}`}>
              <span>2-2</span> 매출계획 수립
            </div>
            <div className={styled.tableContainer}>
              <div className={styled.tableTitleWrap}>
                <div className={`${styled.tableTitle} ${styled.final}`}>
                  매출계획표
                </div>
                <div className={styled.tableInfo}>단위: 수, 원, %</div>
              </div>
              <div className={styled.tableContentsWrap}>
                <FinanceCaculator itemData={performanceParams} />
              </div>
            </div>
            <div className={`${styled.totalContainer} ${styled.final}`}>
              <div className={styled.title}>
                BEP 달성<span>({positiveYear}년차)</span>
              </div>
              <div className={styled.amounts}>
                <div className={styled.item}>
                  <div>매출</div>
                  <div>
                    <span>{achieveBep.sales.toLocaleString()}</span>원
                  </div>
                </div>
                <div className={styled.item}>
                  <div>매출원가</div>
                  <div>
                    <span>{achieveBep.salesCost.toLocaleString()}</span>원
                  </div>
                </div>
                <div className={styled.item}>
                  <div>매출총이익</div>
                  <div>
                    <span>{achieveBep.grossProfit.toLocaleString()}</span>원
                  </div>
                </div>
                <div className={styled.item}>
                  <div>판관비</div>
                  <div>
                    <span>
                      {Number(
                        achieveBep.adminExpenses.toFixed(0)
                      ).toLocaleString()}
                    </span>
                    원
                  </div>
                </div>
                <div className={styled.item}>
                  <div>영업이익</div>
                  <div>
                    {achieveBep.operatingIncome < 0 ? (
                      <span className={styled.minusValue}>
                        {Number(
                          achieveBep.operatingIncome.toFixed(0)
                        ).toLocaleString()}
                      </span>
                    ) : (
                      <span>
                        {Number(
                          achieveBep.operatingIncome.toFixed(0)
                        ).toLocaleString()}
                      </span>
                    )}
                    원
                  </div>
                </div>
                <div className={styled.item}>
                  <div>영업이익률</div>
                  <div>
                    {achieveBep.operatingIncomeRate < 0 ? (
                      <span className={styled.minusValue}>
                        {Number(
                          achieveBep.operatingIncomeRate.toFixed(0)
                        ).toLocaleString()}
                      </span>
                    ) : (
                      <span>
                        {Number(
                          achieveBep.operatingIncomeRate.toFixed(0)
                        ).toLocaleString()}
                      </span>
                    )}
                    %
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`${styled.section} ${styled.final}`}>
            <div className={`${styled.sectionTitle} ${styled.final}`}>
              <span>3-1</span> 기업가치평가
            </div>
            <div className={styled.tableContainer}>
              <div className={styled.tableTitleWrap}>
                <div className={`${styled.tableTitle} ${styled.final}`}>
                  PSR 가치평가
                </div>
                <div className={styled.tableInfo}>단위: 원</div>
              </div>
              <div className={styled.tableContentsWrap}>
                {/* <PriceTable /> */}
                <PsrCalulator inputHide="Y" itemData={performanceParams} />
              </div>
            </div>
            <div className={styled.tableContainer}>
              <div className={styled.tableTitleWrap}>
                <div className={`${styled.tableTitle} ${styled.final}`}>
                  발행주식 수 설정
                </div>
                <div className={styled.tableInfo}>단위: 원</div>
              </div>
              <div className={styled.tableContentsWrap}>
                {/* <PriceTable /> */}
                <StockCalulator
                  name="stock"
                  inputHide="Y"
                  itemData={performanceParams}
                />
              </div>
            </div>
          </div>
          <div className={`${styled.section} ${styled.final}`}>
            <div className={`${styled.sectionTitle} ${styled.final}`}>
              <span>3-2</span> 투자목표 설정
            </div>
            <div className={styled.tableContainer}>
              <div className={styled.tableTitleWrap}>
                <div className={`${styled.tableTitle} ${styled.final}`}>
                  투자목표 설정
                </div>
                <div className={styled.tableInfo}>단위: 원</div>
              </div>
              <div className={styled.tableContentsWrap}>
                {/* <PriceTable /> */}
                <StockCalulator
                  name="investGoal"
                  inputHide="Y"
                  itemData={performanceParams}
                />
              </div>
            </div>
          </div>
          <div className={styled.btnWrap}>
            {/* <div className={`${styled.btn} ${styled.white}`} onClick={tempSave}>
            임시저장 </div> */}
            <div className={`${styled.btn} ${styled.white}`} onClick={preview}>
              미리보기
            </div>
            <div className={`${styled.btn} ${styled.blue}`} onClick={onSubmit}>
              최종 업로드
            </div>
          </div>
        </div>
        {/* 투자 시뮬레이션 모달 */}
        {contents && (
          <ModalComponent
            isOpen={isInvestSimulationOpen}
            closeModal={closInvestSimulationModal}
            content={
              <div>
                {" "}
                <InvestSimulationPop
                  itemData={performanceParams}
                  contents={contents}
                />
                <div className={styled.modalBtn}>
                  <button
                    onClick={closInvestSimulationModal}
                    className={styled.closeBtn}
                  >
                    닫기
                  </button>
                </div>
              </div>
            }
            customStyles={{
              width: "960px",
              height: "800px",
              padding: "40px",
              borderRadius: "8px",
            }}
          />
        )}

        {/* 최종 제출 팝업 */}
        <ModalComponent
          isOpen={isFinalSubmitOpen}
          closeModal={closFinalSubmitModal}
          content={
            <IdeaRegistFinalSubmitPop
              closeModal={closFinalSubmitModal}
              clickFinalSubmit={clickFinalSubmit}
            />
          }
          customStyles={{
            width: "600px",
            height: "300px",
            padding: "22px 24px 22px 24px",
          }}
        />
      </>
    );
  };
  const renderComponents = () => {
    switch (activeIndex) {
      case 0:
        return <Step1 />;
      case 1:
        return <Step2 />;
      case 2:
        return <Step3 />;
      case 3:
        return <Step4 />;
      default:
        return <Step1 />;
    }
  };
  return <div className={styled.sectionContents}>{renderComponents()}</div>;
};

export default RegisterComponents;
