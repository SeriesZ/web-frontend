"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Category, IdeaContentsType } from "@/model/IdeaList";
import { useFinanceStore, ICostInputItem } from "@/store/financeStore";
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
  // 선언
  const router = useRouter();
  const isBrowser = () => typeof window !== "undefined";
  const [repreFiles, setRepreFiles] = useState<File[]>([]);
  const [detailFiles, setDetailFiles] = useState<File[]>([]);
  const [attachFiles, setAttachFiles] = useState<File[]>([]);
  const [editorContent, setEditorContent] = useState<string>("");
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
  const { userInfo } = userStore();
  const editorRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // step2 데이터
  const [performanceData, setPerformanceData] = useState(null);
  const [increaseRateData, setIncreaseRateData] = useState(null);
  const [tradeCountsData, setTradeCountsData] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const { costData } = useFinanceStore();

  const [profitMargin, setProfitMargin] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [totalSelYear, setTotalSelYear] = useState(0);
  const [costItems, setCostItems] = useState<ICostInputItem[]>([]);
  const [selectedTheme4Psr, setSelectedTheme4Psr] = useState<Category>(
    categoryData[0]
  );
  const [maraketCap, setMaraketCap] = useState(0);
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
  };

  // 상태
  useEffect(() => {
    console.log("부모컴포넌트 최초실행");
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
      } catch (error) {
        console.error("Error fetching category data:", error);
      } finally {
      }
    };
    fetchCategoryData();

    const initialPriceData: ICostInputItem[] = [
      {
        id: 1,
        name: "직접재료비",
        amount: 0,
        apiId: "direct_material",
        formPath: "PriceCalculator",
      },
      {
        id: 2,
        name: "직접노무비",
        amount: 0,
        apiId: "direct_labor",
        formPath: "PriceCalculator",
      },
      {
        id: 3,
        name: "직접경비",
        amount: 0,
        apiId: "direct_expense",
        formPath: "PriceCalculator",
      },
      {
        id: 4,
        name: "제조간접비",
        amount: 0,
        apiId: "manufacturing_cost",
        formPath: "PriceCalculator",
      },
      {
        id: 11,
        name: "급여(1인 평균)",
        amount: 0,
        apiId: "salary",
        formPath: "PerformanceCalculator",
      },
      {
        id: 12,
        name: "업무추진비",
        amount: 0,
        apiId: "maintenance_cost",
        formPath: "PerformanceCalculator",
      },
      {
        id: 13,
        name: "사무실 임차료",
        amount: 0,
        apiId: "office_rent",
        formPath: "PerformanceCalculator",
      },
      {
        id: 14,
        name: "접대비",
        amount: 0,
        apiId: "business_expense",
        formPath: "PerformanceCalculator",
      },
      {
        id: 15,
        name: "광고선전비",
        amount: 0,
        apiId: "ad_cost",
        formPath: "PerformanceCalculator",
      },
      {
        id: 16,
        name: "예비비용",
        amount: 0,
        apiId: "contingency",
        formPath: "PerformanceCalculator",
      },
      {
        id: 9999,
        name: "급여인상율",
        amount: 0,
        description: "직원 1명당 연봉 인상율",
        apiId: "salary_increase_rate",
        formPath: "IncreaseRateCalulator",
      },
      {
        id: 9999,
        name: "업무추진비 인상율",
        amount: 0,
        description: "직원 증가 시 인상되도록 설정",
        apiId: "maintenance_cost_increase_rate",
        formPath: "IncreaseRateCalulator",
      },
      {
        id: 9999,
        name: "사무실 임차료 인상율",
        amount: 0,
        description: "직원 증가 시 인상되도록 설정",
        apiId: "office_rent_increase_rate",
        formPath: "IncreaseRateCalulator",
      },
      {
        id: 9999,
        name: "접대비 인상율",
        amount: 0,
        description: "예상 및 추정",
        apiId: "business_expense_increase_rate",
        formPath: "IncreaseRateCalulator",
      },
      {
        id: 9999,
        name: "광고선전비 인상율",
        amount: 0,
        description: "예상 및 추정",
        apiId: "ad_cost_increase_rate",
        formPath: "IncreaseRateCalulator",
      },
      {
        id: 9999,
        name: "예비비 인상율",
        amount: 0,
        description: "예상 및 추정",
        apiId: "contingency_increase_rate",
        formPath: "IncreaseRateCalulator",
      },
      {
        id: 9999,
        name: "액면가",
        amount: 0,
        description: "1주의 최소금액은 상법상 100원 이상",
        apiId: "face_value",
        formPath: "StockItems",
        focus: true,
        inputYn: "Y",
      },
      {
        id: 9999,
        name: "총 발생주식 수",
        amount: 0,
        description: "5년차까지 평균매출 x PSR",
        apiId: "total_number_shares_issued",
        formPath: "StockItems",
        focus: false,
      },
      {
        id: 9999,
        name: "지분율 당 주식수",
        amount: 0,
        description: "",
        apiId: "number_shares_per_share",
        formPath: "StockItems",
        focus: false,
      },
      {
        id: 9999,
        name: "목표 투자자 지분율",
        amount: 40,
        description: "경영권 유지를 위해 49%이하를 가정해야 함",
        apiId: "target_investor_share_ratio",
        formPath: "InvestItems",
        focus: true,
        strType: "%",
        inputYn: "Y",
      },
      {
        id: 9999,
        name: "투자자 지분 총 주식 수",
        amount: 386568,
        description: "",
        apiId: "investor_shares_total_shares",
        formPath: "InvestItems",
        focus: false,
      },
      {
        id: 9999,
        name: "목표 투자자 조달금액",
        amount: 386568000,
        description: "",
        apiId: "target_investor_financing_amount",
        formPath: "InvestItems",
        focus: false,
      },
      {
        id: 9999,
        name: "1인당 최소투자금",
        amount: 0,
        description: "액면가를 기준으로 자동으로 설정됨",
        apiId: "mimimum_investment_per_persion",
        formPath: "InvestItems",
        focus: false,
        inputYn: "Y",
      },
      {
        id: 9999,
        name: "1인당 최대투자금",
        amount: 200000000,
        description: "",
        apiId: "maximum_investment_per_persion",
        formPath: "InvestItems",
        focus: true,
      },
      {
        id: 9999,
        name: "최대 투자자 수 설정(명)",
        amount: 1000,
        description: "",
        apiId: "set_maximum_investors",
        formPath: "InvestItems",
        focus: true,
        inputYn: "Y",
      },
    ];

    setCostItems(initialPriceData);
  }, []);

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
        psr: "3",
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
        case 0:
          // 저장 전 확인
          if (!ideaName) {
            alert("아이디어 제목을 입력해주세요.");
            return;
          }
          if (!editorContent) {
            alert("내용을 입력해주세요.");
            return;
          }
          if (!selectedTheme) {
            alert("테마를 선택해주세요.");
            return;
          }
          if (!repreFiles) {
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

          // 아이디어 내용 저장
          const response = await fetch(url, {
            method: method,
            headers: {
              Authorization: `Bearer ${userInfo.bearer}`,
              Accept: "application/json",
            },
            body: method === "POST" ? formData : undefined,
          });

          // 응답 처리
          if (response.ok) {
            // 성공 시 처리
            const data = await response.json();
            alert("임시저장 되었습니다.");
          } else {
            // 실패 시 처리
            alert("임시 저장 실패:" + response.statusText);
          }
          break;
        case 1:
          console.log("저장할 데이터:", data);
          break;

        default:
          break;
      }
    } catch (error) {
      // 오류 처리
      console.error("서버 요청 오류:", error);
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
              <span>{sellingPrice}</span>원
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
            <YearUserCnt onSaveData={setTradeCountsData} />
          </div>
          <div className={styled.totalContainer}>
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
