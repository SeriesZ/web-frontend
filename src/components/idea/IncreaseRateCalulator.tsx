"use client";
import React, { useEffect, useState } from "react";
import useIdeaPriceStore from "@/store/useIdeaPriceStore";
import styled from "@/components/idea/Idea.module.scss";

type Props = {};

const IncreaseRateCalulator = (props: Props) => {
  const { setSgnaExpenses, totalPrice, sellingPrice } = useIdeaPriceStore();
  // 원가 항목을 관리하는 상태
  const [costItems, setCostItems] = useState<ICostItem[]>([
    { name: "급여인상율", amount: 0.02, description: "직원 1명당 연봉 인상율" },
    {
      name: "업무추진비 인상율",
      amount: 0.05,
      description: "직원 증가 시 인상되도록 설정",
    },
    {
      name: "사무실 임차료 인상율",
      amount: 0.05,
      description: "직원 증가 시 인상되도록 설정",
    },
    { name: "접대비 인상율", amount: 0.1, description: "예상 및 추정" },
    { name: "광고선전비 인상율", amount: 0.1, description: "예상 및 추정" },
    { name: "예비비 인상율", amount: 0.05, description: "예상 및 추정" },
  ]);

  // 기존 원가 항목의 금액을 변경할 수 있는 입력 필드와 핸들러
  const handleCostChange = (index: number, amount: number) => {
    const newCostItems = [...costItems];
    newCostItems[index].amount = amount;
    setCostItems(newCostItems);
  };

  const handleNameChange = (index: number, name: string) => {
    const newCostItems = [...costItems];
    newCostItems[index].name = name;
    setCostItems(newCostItems);
  };

  // 새 원가 항목을 추가할 수 있는 입력 필드와 핸들러
  const handleAddCostItem = () => {
    console.log("handleAddCostItem");
    setCostItems([
      ...costItems,
      { name: "항목입력", amount: 0, description: "" },
    ]);
  };

  const handleRemoveCostItem = (targetIndex: number) => {
    const newCostItems = [...costItems].filter(
      (item, index) => index !== targetIndex
    );
    setCostItems(newCostItems);
  };

  // 모든 원가 항목의 합계
  const totalCost = costItems.reduce((sum, item) => sum + item.amount, 0);

  useEffect(() => {
    console.log("S&GA Expenses :: ", totalCost);
    setSgnaExpenses(totalCost);
  }, [totalCost]);

  function calculateCostRate(salesUnit: number, costUnit: number): number {
    if (salesUnit === 0) {
      throw new Error("Sales unit cannot be zero");
    }
    const costRate = (costUnit / salesUnit) * 100;
    return costRate;
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>구분</th>
            <th>원가 항목</th>
            <th>비고</th>
          </tr>
        </thead>
        <tbody>
          {costItems.map((item, index) => (
            <tr key={index}>
              <th>{item.name}</th>
              <td className={styled.em}>
                {item.amount ? (item.amount * 100).toLocaleString() : 0}%
              </td>
              <th>{item.description}</th>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styled.inputContainer}>
        <div className={styled.inputHeader}>
          <button className={styled.btnInput} onClick={handleAddCostItem}>
            + 원가 항목 추가
          </button>
        </div>
        <div className={styled.inputWrap}>
          {costItems.map((item, index) => (
            <div key={index} className={styled.inputItem}>
              <div className={styled.iconInfo}></div>
              <div className={styled.title}>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                />
              </div>
              <div className={styled.input}>
                <input
                  type="number"
                  value={item.amount}
                  onChange={(e) =>
                    handleCostChange(index, Number(e.target.value))
                  }
                  placeholder="금액을 입력하세요."
                />
              </div>
              <div
                className={styled.iconRemove}
                onClick={() => handleRemoveCostItem(index)}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IncreaseRateCalulator;
