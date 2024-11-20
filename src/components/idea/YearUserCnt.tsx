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

  return (
    <div className={`${styled.inputWrap} ${styled.cnt}`}>
      {calulatorUi.map((item, index) => (
        <div key={index} className={styled.inputItem}>
          <div className={styled.title}>{index + 1}년차</div>
          <div className={styled.input}>
            <input
              type="number"
              ref={inputRef}
              defaultValue={item}
              placeholder="거래발생 수를 입력하세요."
              onChange={(e) => handleInputChange(index, Number(e.target.value))}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default YearUserCnt;
