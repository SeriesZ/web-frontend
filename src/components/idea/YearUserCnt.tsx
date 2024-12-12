"use client";
import React, { useRef } from "react";
import debounce from "lodash/debounce";
import styled from "@/components/idea/Idea.module.scss";

type Props = {
  name: string;
  itemData: {
    tradeCounts: number[];
    setTradeCounts: React.Dispatch<React.SetStateAction<number[]>>;
    employeeCounts: number[];
    setEmployeeCounts: React.Dispatch<React.SetStateAction<number[]>>;
  };
};

// [거래발생 수] : trade
// [직원 수] : employee
const YearUserCnt: React.FC<Props> = ({ name, itemData }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { tradeCounts, setTradeCounts, employeeCounts, setEmployeeCounts } =
    itemData;

  // 재사용 하기 위함
  var calulatorUi = name == "trade" ? tradeCounts : employeeCounts;
  var inputUi = name == "trade" ? setTradeCounts : setEmployeeCounts;
  var placeholder =
    name == "trade" ? "거래발생 수를 입력하세요." : "직원 수를 입력하세요.";

  // 항목의 금액을 변경할 수 있는 핸들러
  const handleInputChange = (index: number, value: number) => {
    debouncedUpdateValue(index, value);
  };

  // 디바운스
  const debouncedUpdateValue = debounce((index: number, value: number) => {
    const yearTrade = [...calulatorUi];
    yearTrade[index] = value;
    inputUi(yearTrade);
  }, 400);

  // 숫자를 세 자리 단위 콤마로 변환
  const formatNumber = (value: number | string) => {
    if (!value) return "";
    const num = Number(value.toString().replace(/[^0-9]/g, ""));
    return num.toLocaleString();
  };

  // 세 자리 콤마를 제거하고 숫자로 변환
  const parseNumber = (value: string) => {
    return Number(value.replace(/[^0-9]/g, ""));
  };

  return (
    <div className={`${styled.inputWrap} ${styled.cnt}`}>
      {calulatorUi.map((item, index) => (
        <div key={index} className={styled.inputItem}>
          <div className={styled.title}>{index + 1}년차</div>
          <div className={styled.input}>
            <input
              type="text"
              className={styled.inputNumber}
              ref={inputRef}
              defaultValue={formatNumber(item)}
              placeholder={placeholder}
              onChange={(e) =>
                handleInputChange(index, parseNumber(e.target.value))
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default YearUserCnt;
