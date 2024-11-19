"use client";
import React, { useEffect, useState } from "react";
import styled from "@/components/idea/Idea.module.scss";
import { ICostInputItem, ICostData } from "@/store/financeStore";

interface Props {
  name: string;
  inputHide: string;
  itemData: {
    costItems: ICostInputItem[];
    setCostItems: React.Dispatch<React.SetStateAction<ICostInputItem[]>>;
    profitMargin: number;
    setProfitMargin: React.Dispatch<React.SetStateAction<number>>;
    totalCost: number;
    setTotalCost: React.Dispatch<React.SetStateAction<number>>;
    sellingPrice: number;
    setSellingPrice: React.Dispatch<React.SetStateAction<number>>;
  };
}

// [발행주식 수 설정] : stock
// [투자목표 설정] : investGoal
const StockCalulator: React.FC<Props> = ({ name, inputHide, itemData }) => {
  const {
    costItems,
    setCostItems,
    profitMargin,
    setProfitMargin,
    totalCost,
    setTotalCost,
    sellingPrice,
    setSellingPrice,
  } = itemData;

  // 발행주식 테이블 컬럼
  const [stockItems, setStockItems] = useState<ICostInputItem[]>(
    costItems.filter((item) => item.formPath === "StockItems")
  );

  // 투자목표 설정 테이블 컬럼
  const [investItems, setInvestItems] = useState<ICostInputItem[]>(
    costItems.filter((item) => item.formPath === "InvestItems")
  );

  // 발행주식 수 설정 입력항목
  const [stockInputItems, setStockInputItems] = useState<ICostInputItem[]>(
    costItems
      .filter((item) => item.formPath === "StockItems")
      .filter((item) => item.inputYn === "Y")
  );

  // 투자목표 설정 입력항목
  const [investInputItems, setInvestInputItems] = useState<ICostInputItem[]>(
    costItems
      .filter((item) => item.formPath === "InvestItems")
      .filter((item) => item.inputYn === "Y")
  );

  // 재사용 하기 위함
  var calulatorUi = name == "stock" ? stockItems : investItems;
  var inputUi = name == "stock" ? stockInputItems : investInputItems;

  // 기존 액면가 항목의 금액을 변경할 수 있는 입력 필드와 핸들러
  const handleAmountChange = (apiId: string, amount: number) => {
    let chkTotalMarketPrice = 0;

    if (name == "stock") {
      const newCostItems = costItems.map((item) =>
        item.apiId === apiId ? { ...item, amount } : item
      );
      setCostItems(newCostItems);
    } else if (name == "investGoal") {
      const newCostItems = costItems.map((item) =>
        item.apiId === apiId ? { ...item, amount } : item
      );
      setCostItems(newCostItems);
    }
  };

  // 포커스 여부에 따라 calulatorUi 금액 className 변경
  function setFocusCol(item: ICostInputItem) {
    if (item.focus) {
      return (
        <td className={styled.em}>
          {item.amount ? item.amount.toLocaleString() : 0}
          {item.strType}
        </td>
      );
    } else {
      return <td>{item.amount}</td>;
    }
  }

  // 변수에 따라 원가 항목 입력을 숨긴다
  function chkInputHide() {
    if (inputHide == "N")
      return (
        <div className={styled.inputContainer}>
          <div className={styled.inputWrap}>
            {inputUi.map((item, index) => (
              <div key={index} className={styled.inputItem}>
                <div className={styled.iconInfo}></div>
                <div className={styled.title}>
                  <input type="text" value={item.name} />
                </div>
                <div className={styled.input}>
                  <input
                    type="number"
                    value={item.amount}
                    onChange={(e) =>
                      handleAmountChange(item.apiId, Number(e.target.value))
                    }
                    placeholder="금액을 입력하세요."
                  />
                </div>
              </div>
            ))}
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
          {calulatorUi.map((item, index) => (
            <tr key={index}>
              <th>{item.name}</th>
              {setFocusCol(item)}
              <th>{item.description}</th>
            </tr>
          ))}
        </tbody>
      </table>
      {chkInputHide()}
    </div>
  );
};

export default StockCalulator;
