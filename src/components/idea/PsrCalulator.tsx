"use client";
import React, { useEffect } from "react";
import styled from "@/components/idea/Idea.module.scss";
import CustomSelectBox from "../common/CustomSelectBox";
import { Category } from "@/model/IdeaList";

interface Props {
  inputHide: string;
  itemData: {
    categoryData: Category[];
    selectedTheme4Psr?: Category;
    setSelectedTheme4Psr: React.Dispatch<React.SetStateAction<Category>>;
    maraketCap: number;
    setMaraketCap: React.Dispatch<React.SetStateAction<number>>;
    averageSales: number;
  };
}

// [기업가치평가]
const PsrCalulator: React.FC<Props> = ({ inputHide, itemData }) => {
  const {
    categoryData,
    selectedTheme4Psr,
    setSelectedTheme4Psr,
    maraketCap,
    setMaraketCap,
    averageSales,
  } = itemData;

  // 산업군 선택
  const handleSelectTheme = (value: Category) => {
    setSelectedTheme4Psr(value);
  };

  // 구분 단위값 셋팅
  const selectedBox = categoryData.filter((item) => item === selectedTheme4Psr);
  const labelText = selectedBox.map((item) => item.name);
  const labelPsr = selectedBox.map((item) => item.psr_value);
  const marketPrice = averageSales * +labelPsr;

  useEffect(() => {
    setMaraketCap(marketPrice);
  }, [marketPrice]);

  // 변수에 따라 원가 항목 입력을 숨긴다
  function chkInputHide() {
    if (inputHide == "N")
      return (
        <div className={styled.inputContainer}>
          <div className={styled.inputWrap}>
            <div className={`${styled.form} ${styled.select}`}>
              <div className={styled.left}>
                <div className={styled.label}>산업군 선택</div>
                <div className={styled.desc}>(1개만 선택 가능)</div>
              </div>
              <div className={styled.selectBoxWrap}>
                <CustomSelectBox
                  options={categoryData}
                  value={selectedTheme4Psr}
                  onSelect={handleSelectTheme}
                  placeholder="산업군을 선택하세요"
                />
              </div>
            </div>
          </div>
        </div>
      );
    else return;
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>구분</th>
            <th>단위 값</th>
            <th>비고</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>{labelText}</th>
            <th className={styled.em}>{labelPsr}</th>
            <td className={styled.remk}>동종산업 코스닥 상상 기업 평균 값</td>
          </tr>
          <tr>
            <th className={styled.total}>시가총액</th>
            <th className={`${styled.total} ${styled.em}`}>
              {maraketCap.toLocaleString()}
            </th>
            <td className={styled.total}>5년차까지 평균매출 x PSR</td>
          </tr>
        </tbody>
      </table>
      {chkInputHide()}
      <div className={styled.totalContainer}>
        <div className={styled.title}>시가총액</div>
        <div className={styled.amount}>
          <span>{maraketCap.toLocaleString()}</span>원
        </div>
      </div>
    </div>
  );
};

export default PsrCalulator;
