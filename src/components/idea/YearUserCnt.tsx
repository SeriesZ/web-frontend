"use client";
import React, { useEffect, useState, useRef } from "react";
import styled from "@/components/idea/Idea.module.scss";
import useIdeaPriceStore from "@/store/useIdeaPriceStore";
type Props = {
  onSaveData: (data: any) => void;
};

interface UserCnt {
  year: number;
  value: number;
}

const YearUserCnt: React.FC<Props> = ({ onSaveData }) => {
  // 매출계획표 거래발생수 컴포넌트 생성 배열
  const yearData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const { setYearUserCnt } = useIdeaPriceStore();

  const [inputValues, setInputValues] = useState<UserCnt[]>(
    yearData.map((year) => ({ year, value: year }))
  );
  const handleInputChange = (index: number, value: number) => {
    const yearUsers = [...inputValues];
    yearUsers[index].value = value;
    setInputValues(yearUsers);
    setYearUserCnt(yearUsers); // store에 값 저장
  };
  // 저장할 데이터를 반환하는 함수
  const getSaveData = () => {
    return {
      inputValues,
    };
  };

  const prevDataRef = useRef(getSaveData());
  useEffect(() => {
    const newData = getSaveData();
    if (JSON.stringify(prevDataRef.current) !== JSON.stringify(newData)) {
      onSaveData(newData);
      prevDataRef.current = newData;
    }
  }, [inputValues]);

  return (
    <div className={`${styled.inputWrap} ${styled.cnt}`}>
      {inputValues.map((item, index) => (
        <div key={item.year} className={styled.inputItem}>
          <div className={styled.title}>{item.year}년차</div>
          <div className={styled.input}>
            <input
              type="number"
              placeholder="금액을 입력하세요."
              value={item.value}
              onChange={(e) => handleInputChange(index, Number(e.target.value))}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default YearUserCnt;
