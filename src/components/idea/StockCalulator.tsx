"use client";
import React, { useEffect, useState } from "react";
import styled from "@/components/idea/Idea.module.scss";
import useIdeaPriceStore from "@/store/useIdeaPriceStore";

const StockCalulator: React.FC = () => {
  const { totalMarketPrice } = useIdeaPriceStore();
  // 발행주식 수 설정 상태
  const [stockItems, setCostItems] = useState<ICostItem[]>([
    {
      name: "액면가",
      amount: 100,
      description: "1주의 최소금액은 상법상 100원 이상",
    },
    {
      name: "총 발생주식 수",
      amount: 0,
      description: "5년차까지 평균매출 x PSR",
    },
    { name: "지분율 당 주식수", amount: 0, description: "" },
  ]);

  // 기존 액면가 항목의 금액을 변경할 수 있는 입력 필드와 핸들러
  const handleCostChange = (amount: number) => {
    let chkTotalMarketPrice = 0;
    if (totalMarketPrice) {
      chkTotalMarketPrice = totalMarketPrice;
    }
    const newCostItems = [...stockItems];
    newCostItems[0].amount = amount;
    newCostItems[1].amount = amount * chkTotalMarketPrice;
    newCostItems[2].amount = (amount * chkTotalMarketPrice) / 100;
    setCostItems(newCostItems);
  };

  useEffect(() => {
    console.log("totalMarketPrice 변동 :: ", totalMarketPrice);
    handleCostChange(stockItems[0].amount);
  }, [totalMarketPrice]);

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
          {stockItems.map((item, index) => (
            <tr key={index}>
              <th>{item.name}</th>
              <td className={styled.em}>{item.amount}</td>
              <th>{item.description}</th>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styled.inputContainer}>
        <div className={styled.inputWrap}>
          <div className={styled.inputItem}>
            <div className={styled.iconInfo}></div>
            <div className={styled.title}>
              <input type="text" value="액면가" />
            </div>
            <div className={styled.input}>
              <input
                type="number"
                value={stockItems[0].amount}
                onChange={(e) => handleCostChange(Number(e.target.value))}
                placeholder="금액을 입력하세요."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockCalulator;
