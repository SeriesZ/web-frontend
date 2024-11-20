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
  ICostData,
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

type Props = {
  activeIndex: number;
  ideaId: string;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
};

const NoSsrEditor = dynamic(() => import("./ToastEditor"), {
  ssr: false,
});

const RegisterComponents = ({ activeIndex, ideaId, setActiveIndex }: Props) => {
  const isBrowser = () => typeof window !== "undefined";
  const { userInfo } = userStore();
  const router = useRouter();

  // step1 관련
  const editorRef = useRef<any>(null);
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
  const [repreFilesMap, setRepreFilesMap] = useState<Map<string, string>>(
    new Map()
  );
  const [attachFilesMap, setAttachFilesMap] = useState<Map<string, string>>(
    new Map()
  );
  const [repreReadyUpload, setRepreReadyUpload] = useState(false);
  const [detailReadyUpload, setDetailReadyUpload] = useState(false);
  const [attachReadyUpload, setAttachReadyUpload] = useState(false);

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

  const performanceParams = {
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
    setSelectedTheme4Psr,
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
  };

  // 상태
  useEffect(() => {
    console.log("부모 컴포넌트 최초 실행");
    const fetchCategoryData = async () => {
      try {
        // 산업군 로드
        const response1 = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/themes`
        );
        const data1 = await response1.json();
        setCategoryData(data1);
        setSelectedTheme4Psr(data1[0]);

        // 아이디어ID가 있으면 데이터 로딩
        if (ideationId) {
          const response2 = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/ideation/${ideaId}`,
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

          if (response2.ok) {
            const data2 = await response2.json();
            setIdeaContents(data2);
          } else {
            console.error("아이디어 불러오기 실패:", response2.statusText);
          }

          getServerFinanceData();
        } else {
          setCostItems(defaultPriceData);
          setTradeCounts([100, 2500, 10000, 20000, 50000, 6, 7, 8, 9, 10]);
          setEmployeeCounts([2, 3, 4, 5, 7, 6, 7, 8, 9, 10]);
        }
      } catch (error) {
        console.error("Error fetching category data:", error);
      } finally {
      }
    };
    fetchCategoryData();
  }, []);

  useEffect(() => {
    // 상품가격결정
    const totalTotal = costItems
      .filter((item) => item.formPath === "PriceCalculator")
      .reduce((sum, item) => sum + (item.amount ? item.amount : 0), 0);
    const sellingPrice = totalTotal * (profitMargin / 100);
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
    }

    console.log("업뎃 안됐니?");
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
    console.log("positiveYear: " + positiveYear1);
  }, [plan]);

  useEffect(() => {
    console.log("repreFiles :: ", repreFiles);
    if (ideaId && repreReadyUpload) {
      const formData = new FormData();
      repreFiles.forEach((file, index) => {
        formData.append(`file`, file, file.name);
      });
      fetchUploadFile("image", formData);
    }
  }, [repreFiles]);

  useEffect(() => {
    console.log("detailFiles :: ", detailFiles);
  }, [detailFiles]);

  useEffect(() => {
    console.log("attachFiles :: ", attachFiles);
    if (ideaId && attachReadyUpload) {
      const formData = new FormData();
      attachFiles.forEach((file, index) => {
        formData.append(`file`, file, file.name);
      });
      fetchUploadFile("attach", formData);
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
      setEditorContent(contents?.content);
    }
    if (contents?.images) {
      const files = contents.images.map((images) => {
        const { file_name } = images;
        return new File([], file_name);
      });
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
    if (!ideaId) {
      setIdeaContents(initializeIdeaContents);
    }
  }, [ideaId]);

  // 이벤트
  const handleChangeNextStep = () => {
    setActiveIndex(activeIndex + 1);
    if (!isBrowser()) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectTheme = (value: Category) => {
    setSelectedTheme(value);
  };

  const handleBlur = () => {
    if (inputRef.current) setIdeaName(inputRef.current.value);
  };

  const handleBlurEditor = () => {
    if (editorRef.current) {
      setEditorContent(editorRef.current.getInstance().getHTML());
    }
  };

  // 버튼
  const onSubmit = () => {
    console.log("최종 업로드");
    router.push("./registerList");
  };

  const tempSave = async (data: any) => {
    try {
      console.log("임시 저장 현재 인덱스 :: ", activeIndex);

      switch (activeIndex) {
        // 아이디어 내용 저장
        case 0:
          // 저장 전 확인
          console.log("repreFiles " + repreFiles);
          if (!ideaName) {
            alert("아이디어 제목을 입력해주세요.");
            return;
          }
          if (!editorContent) {
            alert("내용을 입력해주세요.");
            return;
          }
          if (!selectedTheme?.id) {
            alert("테마를 선택해주세요.");
            return;
          }
          if (repreFiles.length == 0) {
            alert("대표 이미지를 선택해주세요.");
            return;
          }

          let method = "";
          let url = "";
          const formData = new FormData();
          formData.append("title", ideaName);
          formData.append("content", editorContent);
          formData.append("theme_id", selectedTheme.id);

          // 최초 등록
          if (!ideaId) {
            method = "POST";
            url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/ideation`;
            repreFiles.forEach((file, index) => {
              formData.append(`images`, file, file.name);
            });
            attachFiles.forEach((file, index) => {
              formData.append(`files`, file, file.name);
            });
            console.log(formData);
          } else {
            const queryParams = new URLSearchParams({
              title: ideaName,
              content: editorContent,
              theme_id: selectedTheme.id,
            }).toString();

            method = "PUT";
            url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/ideation/${ideaId}?${queryParams}`;
            formData.append("ideation_id", ideaId);
          }

          const response = await fetch(url, {
            method: method,
            headers: {
              Authorization: `Bearer ${userInfo.bearer}`,
              Accept: "application/json",
            },
            body: method === "POST" ? formData : undefined,
          });

          if (response.ok) {
            const data = await response.json();
            setIdeaId(data.id);
            alert("임시저장 되었습니다." + JSON.stringify(data));
          } else {
            alert("임시 저장 실패:" + response.statusText + "ideaId:" + ideaId);
          }
          break;
        case 1:
          if (!ideationId) {
            alert("아이디어 입력 저장을 먼저 진행해주세요.");
            return;
          }
          // step2 저장 함수로 이동
          checkAndSaveFinanceData();
          break;

        default:
          break;
      }
    } catch (error) {
      // 오류 처리
      console.error("서버 요청 오류:", error);
      alert("서버 요청 오류: " + error);
    }
  };

  const preview = () => {
    console.log("미리보기");
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
    for (let i = 0; i < years.length; i++) {
      if (years[i].operatingIncome > 0) {
        return i + 1;
      }
    }
    return null;
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
      "business_expense_increase_rate"
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
        mainCostIncreaseRate,
        previousOfficeRent,
        officeRentIncreaseRate
      );

      years.push(yearData);

      // Adjust values for next year
      salaryPerStaff *= 1 + salaryIncreaseRate * 0.01; // 연봉인상률
      entertainmentExpenses =
        entertainmentExpenses * (1 + businessExpenseIncreaseRate * 0.01);
      advertisingCost = advertisingCost * (1 + adCostIncreaseRate * 0.01);
      contingencyExpenses =
        contingencyExpenses * (1 + contingencyIncreaseRate * 0.01);
    }

    return years;
  };

  // step2 임시저장 관련
  const getServerFinanceData = async () => {
    try {
      // 공통 URL 및 헤더 설정
      const financeUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/finance`;
      const headers = {
        Authorization: `Bearer ${userInfo.bearer}`,
        Accept: "application/json",
      };

      // 데이터 존재 여부 확인
      const checkResponse = await fetch(`${financeUrl}/${ideationId}`, {
        method: "GET",
        headers,
      });

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

  const checkAndSaveFinanceData = async () => {
    try {
      // 공통 URL 및 헤더 설정
      const financeUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/finance/${ideationId}`;
      const headers = {
        Authorization: `Bearer ${userInfo.bearer}`,
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
      serverPayload.ideation_id = ideationId;
      serverPayload.id = financeId;
      console.log("저장할 데이터:", serverPayload);

      if (checkResponse.ok) {
        // 데이터가 존재하는 경우 (PUT)

        console.log("checkResponse ok:", serverPayload);
        await updateFinanceData(financeUrl, headers, serverPayload);
      } else if (checkResponse.status === 401 || checkResponse.status === 500) {
        alert("저장 권한이 없습니다.");
      } else {
        // 데이터가 없는 경우 (POST)
        await createFinanceData(financeUrl, headers, serverPayload);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("저장 권한이 없습니다.");
    }
  };

  // PUT 요청
  const updateFinanceData = async (
    url: string,
    headers: HeadersInit,
    payload: any
  ) => {
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log("Finance data updated successfully.");
        alert("임시저장 되었습니다.");
      } else {
        console.error("Failed to update finance data.");
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
            ...headers,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        console.log("Finance data created successfully.");
        alert("임시저장 되었습니다.");
      } else {
        console.error("Failed to create finance data." + response.statusText);
        alert("저장에 실패하였습니다.");
      }
    } catch (error) {
      console.error("An error occurred during creation:", error);
      alert("저장에 실패하였습니다.");
    }
  };

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
              <NoSsrEditor
                content={editorContent}
                editorRef={editorRef}
                onChange={handleBlurEditor}
              ></NoSsrEditor>
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
          <div className={styled.btn} onClick={handleChangeNextStep}>
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
                <span></span>
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
          <div className={styled.totalContainer}>
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
                  <span>
                    {Number(
                      achieveBep.operatingIncome.toFixed(0)
                    ).toLocaleString()}
                  </span>
                  원
                </div>
              </div>
              <div className={styled.item}>
                <div>영업이익률</div>
                <div>
                  <span>
                    {Number(
                      achieveBep.operatingIncomeRate.toFixed(0)
                    ).toLocaleString()}
                  </span>
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
          <div className={styled.btn} onClick={handleChangeNextStep}>
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
                PSR 가치평가<span></span>
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
                발행주식 수 설정<span></span>
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
                투자목표 설정<span></span>
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
          <div className={styled.btn} onClick={handleChangeNextStep}>
            다음
          </div>
        </div>
      </>
    );
  };
  const Step4 = () => {
    //const { sellingPrice, sgnaExpenses } = useIdeaPriceStore();
    return (
      <>
        <div className={`${styled.section} ${styled.final}`}>
          <div className={`${styled.sectionTitle} ${styled.final}`}>
            <span>1</span> 아이디어 입력
          </div>
          <div className={`${styled.form} ${styled.final}`}>
            <div className={`${styled.label} ${styled.final}`}>아이디어명</div>
            <div className={styled.finalContent}>홈짐 (Home Gym)</div>
          </div>
          <div className={styled.form}>
            <div className={`${styled.label} ${styled.final}`}>
              아이디어 설명
            </div>
            <div className={styled.finalContent}>
              모바일 디바이스에서 컴퓨터 비전 기술 기반으로 사용자의 체형을
              분석하고 알맞은 운동을 제시해주는 특정 개인만의 운동의 방법을
              제공하는 헬스 어플리케이션
            </div>
          </div>
          <div className={styled.form}>
            <div className={`${styled.label} ${styled.final}`}>대표 이미지</div>
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
            <div className={styled.finalContent}>예술/스포츠업</div>
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
              <span>{sellingPrice.toLocaleString()}</span>원
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
              BEP 달성<span>(4년차)</span>
            </div>
            <div className={styled.amounts}>
              <div className={styled.item}>
                <div>매출</div>
                <div>
                  <span>600,000,000</span>원
                </div>
              </div>
              <div className={styled.item}>
                <div>매출원가</div>
                <div>
                  <span>240,000,000</span>원
                </div>
              </div>
              <div className={styled.item}>
                <div>매출총이익</div>
                <div>
                  <span>240,000,000</span>원
                </div>
              </div>
              <div className={styled.item}>
                <div>판관비</div>
                <div>
                  <span>360,000,000</span>원
                </div>
              </div>
              <div className={styled.item}>
                <div>영업이익</div>
                <div>
                  <span>3,975,525</span>원
                </div>
              </div>
              <div className={styled.item}>
                <div>영업이익률</div>
                <div>
                  <span>1</span>%
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
          <div className={`${styled.btn} ${styled.white}`} onClick={tempSave}>
            임시저장
          </div>
          <div className={`${styled.btn} ${styled.white}`} onClick={preview}>
            미리보기
          </div>
          <div className={styled.btn} onClick={onSubmit}>
            최종 업로드
          </div>
        </div>
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
