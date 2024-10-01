"use client";
import React, { useEffect, useState } from "react";
import CustomSelectBox from "../common/CustomSelectBox";
import styled from "@/components/idea/Idea.module.scss";
import useIdeaPriceStore from "@/store/useIdeaPriceStore";

interface Props {
  inputHide: string;
}

const PsrCalulator: React.FC<Props> = ({ inputHide }) => {
  const { setTotalMarketPrice } = useIdeaPriceStore();

  const themeData = [
    { value: "", label: "산업군을 선택해주세요", psr: "0" },
    { value: "1", label: "농업/어업", psr: "3" },
    { value: "2", label: "광업", psr: "3" },
    { value: "3", label: "제조업", psr: "3" },
    { value: "4", label: "전기/가스업", psr: "4" },
    { value: "5", label: "수도/재생업", psr: "4" },
    { value: "6", label: "건설업", psr: "4" },
    { value: "7", label: "도매/소매업", psr: "4" },
    { value: "8", label: "운수/창고업", psr: "4" },
    { value: "9", label: "숙박/음식점업", psr: "4" },
    { value: "10", label: "정보통신업", psr: "3" },
    { value: "11", label: "금융/보험업", psr: "3" },
    { value: "12", label: "부동산업", psr: "3" },
    { value: "13", label: "과학 기술업", psr: "3" },
    { value: "14", label: "시설관리업", psr: "3" },
    { value: "15", label: "교육서비스업", psr: "3" },
    { value: "16", label: "보건업", psr: "3" },
    { value: "17", label: "예술/스포츠업", psr: "3" },
    { value: "18", label: "기타", psr: "3" },
  ];

  const [selectedTheme, setSelectedTheme] = useState("");
  const handleSelectTheme = (value: string) => {
    setSelectedTheme(value);
  };
  const selectedBox = themeData.filter((item) => item.value === selectedTheme);
  const labelText = selectedBox.map((item) => item.label);
  const labelPsr = selectedBox.map((item) => item.psr);
  const sellingPrice = 5200000 * +labelPsr;

  useEffect(() => {
    console.log("sellingPrice (시가총액) :: ", sellingPrice);
    setTotalMarketPrice(sellingPrice);
  }, [sellingPrice]);

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
                  options={themeData}
                  value={selectedTheme}
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
            <th className={`${styled.total} ${styled.em}`}>{sellingPrice}</th>
            <td className={styled.total}>5년차까지 평균매출 x PSR</td>
          </tr>
        </tbody>
      </table>
      {chkInputHide()}
      <div className={styled.totalContainer}>
        <div className={styled.title}>시가총액</div>
        <div className={styled.amount}>
          <span>{sellingPrice ? sellingPrice.toLocaleString() : 0}</span>원
        </div>
      </div>
    </div>
  );
};

export default PsrCalulator;
