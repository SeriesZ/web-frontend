"use client";
import React, { useEffect, useState } from "react";
import useIdeaPriceStore from "@/store/useIdeaPriceStore";
import styled from "@/components/idea/Idea.module.scss";

interface Props {
  inputHide: string;
}

const PerformanceCalculator: React.FC<Props> = ({ inputHide }) => {
  const { setSgnaExpenses, totalPrice, sellingPrice } = useIdeaPriceStore();
  // 원가 항목을 관리하는 상태
  const [costItems, setCostItems] = useState<ICostItem[]>([
    { name: "급여(1인 평균)", amount: 35000000 },
    { name: "업무추진비", amount: 3600000 },
    { name: "사무실 임차료", amount: 6000000 },
    { name: "접대비", amount: 5000000 },
    { name: "광고선전비", amount: 12000000 },
    { name: "예비비용", amount: 3000000 },
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
    setCostItems([...costItems, { name: "항목입력", amount: 0 }]);
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

  function chkInputHide() {
    if (inputHide == "N")
      return (
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
      );
    else return;
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>구분</th>
            <th>원가 항목</th>
            <th>금액</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>수익</th>
            <th>매출 단위</th>
            <td>{sellingPrice ? sellingPrice.toLocaleString() : 0}</td>
          </tr>
          <tr>
            <th rowSpan={2}>매출원가</th>
            <th>원가 단위</th>
            <td>{totalPrice ? totalPrice.toLocaleString() : 0}</td>
          </tr>
          <tr>
            <th>원가율</th>
            <td>
              {sellingPrice && totalPrice
                ? calculateCostRate(sellingPrice, totalPrice).toFixed(0)
                : 0}
              %
            </td>
          </tr>
          {costItems.map((item, index) => (
            <tr key={index}>
              {index === 0 && <th rowSpan={costItems.length}>원가</th>}
              <th>{item.name}</th>
              <td className={styled.em}>
                {item.amount ? item.amount.toLocaleString() : 0}
              </td>
            </tr>
          ))}
          <tr>
            <th colSpan={2} className={styled.total}>
              판관비 계(연비용)
            </th>
            <td className={styled.total}>
              {totalCost ? totalCost.toLocaleString() : 0}
            </td>
          </tr>
        </tbody>
      </table>
      {chkInputHide()}
    </div>
  );
};

export default PerformanceCalculator;
