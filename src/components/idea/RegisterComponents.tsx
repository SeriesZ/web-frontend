"use client";
import React, { ChangeEvent, act, useEffect, useState } from "react";
import styled from "@/components/idea/Idea.module.scss";
import FileUpload from "./FileUpload";
import CustomSelectBox from "../common/CustomSelectBox";
import PriceTable from "./PriceTable";
import PriceCalculator from "./PriceCalculator";
import useIdeaPriceStore from "@/store/useIdeaPriceStore";
import PerformanceCalculator from "./PerformanceCalculator";
import IncreaseRateCalulator from "./IncreaseRateCalulator";
import FinanceCaculator from "./FinanceCaculator";

type Props = {
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
};

const RegisterComponents = ({ activeIndex, setActiveIndex }: Props) => {
  const isBrowser = () => typeof window !== "undefined";
  const [repreFiles, setRepreFiles] = useState<File[]>([]);
  const [detailFiles, setDetailFiles] = useState<File[]>([]);
  const [attachFiles, setAttachFiles] = useState<File[]>([]);
  const [selectedTheme, setSelectedTheme] = useState("");
  const themeData = [
    { value: "1", label: "농업/어업" },
    { value: "2", label: "광업" },
    { value: "3", label: "제조업" },
    { value: "4", label: "전기/가스업" },
    { value: "5", label: "수도/재생업" },
    { value: "6", label: "건설업" },
    { value: "7", label: "도매/소매업" },
    { value: "8", label: "운수/창고업" },
    { value: "9", label: "숙박/음식점업" },
    { value: "10", label: "정보통신업" },
    { value: "11", label: "금융/보험업" },
    { value: "12", label: "부동산업" },
    { value: "13", label: "과학 기술업" },
    { value: "14", label: "시설관리업" },
    { value: "15", label: "교육서비스업" },
    { value: "16", label: "보건업" },
    { value: "17", label: "예술/스포츠업" },
    { value: "18", label: "기타" },
  ];

  useEffect(() => {
    console.log("repreFiles :: ", repreFiles);
  }, [repreFiles]);
  useEffect(() => {
    console.log("detailFiles :: ", detailFiles);
  }, [detailFiles]);
  useEffect(() => {
    console.log("attachFiles :: ", attachFiles);
  }, [attachFiles]);
  const handleChangeNextStep = () => {
    setActiveIndex(activeIndex + 1);
    if (!isBrowser()) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const onSubmit = () => {
    console.log("최종 업로드");
  };
  const tempSave = () => {
    console.log("임시 저장 현재 인덱스 :: ", activeIndex);
  };
  const preview = () => {
    console.log("미리보기");
  };
  const handleSelectTheme = (value: string) => {
    setSelectedTheme(value);
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
            <input type="text" placeholder="아이디어명을 입력하세요" />
          </div>
          <div className={styled.form}>
            <div className={styled.label}>아이디어 설명</div>
            <textarea placeholder="아이디어 설명을 입력하세요" />
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
              setUploadData={setRepreFiles}
              // setReadyUpload={}
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
              setUploadData={setDetailFiles}
              // setReadyUpload={}
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
                options={themeData}
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
              setUploadData={setAttachFiles}
              // setReadyUpload={}
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
    const { sellingPrice, sgnaExpenses } = useIdeaPriceStore();
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
                상품가격결정<span></span>
              </div>
              <div className={styled.tableInfo}>단위: 원, %</div>
            </div>
            <div className={styled.tableContentsWrap}>
              {/* <PriceTable /> */}
              <PriceCalculator />
            </div>
          </div>
          <div className={styled.totalContainer}>
            <div className={styled.title}>
              판매가<span>(소비자가격)</span>
            </div>
            <div className={styled.amount}>
              <span>{sellingPrice ? sellingPrice.toLocaleString() : 0}</span>원
            </div>
          </div>
          <div className={styled.tableContainer}>
            <div className={styled.tableTitleWrap}>
              <div className={styled.tableTitle}>
                실적 단위 계산<span></span>
              </div>
              <div className={styled.tableInfo}>단위: 원, %</div>
            </div>
            <div className={styled.tableContentsWrap}>
              <PerformanceCalculator />
            </div>
          </div>
          <div className={styled.totalContainer}>
            <div className={styled.title}>
              판관비 계<span>(연비용)</span>
            </div>
            <div className={styled.amount}>
              <span>{sgnaExpenses ? sgnaExpenses.toLocaleString() : 0}</span>원
            </div>
          </div>
          <div className={styled.tableContainer}>
            <div className={styled.tableTitleWrap}>
              <div className={styled.tableTitle}>
                인상율 설정<span></span>
              </div>
              <div className={styled.tableInfo}>단위: %</div>
            </div>
            <div className={styled.tableContentsWrap}>
              <IncreaseRateCalulator />
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
              <FinanceCaculator />
            </div>
          </div>
          <div className={styled.inputContainer}>
            <div className={`${styled.inputHeader} ${styled.left}`}>
              <div className={styled.title}>거래발생 수</div>
            </div>
            <div className={`${styled.inputWrap} ${styled.cnt}`}>
              <div className={styled.inputItem}>
                <div className={styled.title}>1년차</div>
                <div className={styled.input}>
                  <input type="text" placeholder="금액을 입력하세요." />
                </div>
              </div>
            </div>
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
    return (
      <>
        <div className={`${styled.section} ${styled.final}`}>
          <div className={`${styled.sectionTitle} ${styled.final}`}>
            <span>1</span> 아이디어 입력
          </div>
        </div>
        <div className={`${styled.section} ${styled.final}`}>
          <div className={`${styled.sectionTitle} ${styled.final}`}>
            <span>2-1</span> 상품가격결정
          </div>
        </div>
        <div className={`${styled.section} ${styled.final}`}>
          <div className={`${styled.sectionTitle} ${styled.final}`}>
            <span>2-2</span> 매출계획 수립
          </div>
        </div>
        <div className={`${styled.section} ${styled.final}`}>
          <div className={`${styled.sectionTitle} ${styled.final}`}>
            <span>3-1</span> 기업가치평가
          </div>
        </div>
        <div className={`${styled.section} ${styled.final}`}>
          <div className={`${styled.sectionTitle} ${styled.final}`}>
            <span>3-2</span> 투자목표 설정
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
