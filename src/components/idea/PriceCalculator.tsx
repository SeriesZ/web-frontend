"use client";
import React, { useEffect, useState } from "react";
import styled from "@/components/idea/Idea.module.scss";
import useIdeaPriceStore from "@/store/useIdeaPriceStore";

interface Props {
  inputHide: string;
}

const PriceCalculator: React.FC<Props> = ({ inputHide }) => {
  const { setSellingPrice, setTotalPrice } = useIdeaPriceStore();
  // 원가 항목을 관리하는 상태
  const [costItems, setCostItems] = useState<ICostItem[]>([
    { name: "직접재료비", amount: 7000 },
    { name: "직접노무비", amount: 2000 },
    { name: "직접경비", amount: 2000 },
    { name: "제조간접비", amount: 1000 },
  ]);
  // 이익률을 관리하는 상태
  const [profitMargin, setProfitMargin] = useState(150);

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
  // totalCost와 profitMargin을 바탕으로 계산된 판매 가격
  const sellingPrice = totalCost * (1 + profitMargin / 100);

  useEffect(() => {
    console.log("totalPrice (원가 단위) :: ", totalCost);
    setTotalPrice(totalCost);
  }, [totalCost]);
  useEffect(() => {
    console.log("sellingPrice (판매가 소비자 가격) :: ", sellingPrice);
    setSellingPrice(sellingPrice);
  }, [sellingPrice]);

  // 변수에 따라 원가 항목 입력을 숨긴다
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
            <div className={styled.inputItem}>
              <div className={styled.iconInfo}></div>
              <div className={styled.title}>이익율</div>
              <div className={styled.input}>
                <input
                  type="number"
                  value={profitMargin}
                  placeholder="금액을 입력하세요."
                  onChange={(e) => setProfitMargin(Number(e.target.value))}
                />
              </div>
              <div className={styled.iconRemove}></div>
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
            <th>원가 항목</th>
            <th>금액</th>
          </tr>
        </thead>
        <tbody>
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
            <th colSpan={2}>이익율(마진)</th>
            <td className={styled.em}>
              {profitMargin ? profitMargin.toLocaleString() : 0}%
            </td>
          </tr>
          <tr>
            <th colSpan={2} className={styled.total}>
              판매가(소비자가격)
            </th>
            <td className={styled.total}>
              {sellingPrice ? sellingPrice.toLocaleString() : 0}
            </td>
          </tr>
        </tbody>
      </table>
      {chkInputHide()}
    </div>
  );
};

export default PriceCalculator;
