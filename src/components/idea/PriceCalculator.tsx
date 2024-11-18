"use client";
import React, { useRef, useEffect } from "react";
import debounce from "lodash/debounce";
import ToolTipComponent from "./ToolTipComponent";
import styled from "@/components/idea/Idea.module.scss";
import { ICostInputItem, ICostData } from "@/store/financeStore";

interface Props {
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

// [상품가격결정]
const PriceCalculator: React.FC<Props> = ({ inputHide, itemData }) => {
  const inputRef = useRef<HTMLInputElement>(null);
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

  // 기존 원가 항목의 금액을 변경
  const handleCostChange = (id: number, amount: number) => {
    debouncedUpdateCost(id, amount);
  };

  // 기존 원가 항목의 이름을 변경
  const handleNameChange = (id: number, name: string) => {
    const newCostItems = costItems.map((item) =>
      item.id === id ? { ...item, name } : item
    );
    setCostItems(newCostItems);
  };

  // 새 원가 항목을 추가할 수 있는 입력 필드와 핸들러
  const handleAddCostItem = () => {
    const maxId = Math.max(...costItems.map((item) => item.id));
    const newId = maxId + 1;
    const randomId = Math.floor(1000 + Math.random() * 9000).toString();
    const newItem: ICostInputItem = {
      id: newId,
      name: "항목입력",
      amount: 0,
      apiId: `custom_${randomId}` as keyof ICostData,
      formPath: "PriceCalculator",
    };
    setCostItems([...costItems, newItem]);
  };

  const handleRemoveCostItem = (id: number) => {
    const newCostItems = [...costItems].filter((item, index) => item.id !== id);
    setCostItems(newCostItems);
  };

  // 이익율 변경
  const handleProfitChange = (value: number) => {
    debouncedUpdateProfit(value);
  };

  // 디바운스
  const debouncedUpdateCost = debounce((id: number, amount: number) => {
    const newCostItems = costItems.map((item) =>
      item.id === id ? { ...item, amount } : item
    );
    setCostItems(newCostItems);
  }, 400);

  const debouncedUpdateProfit = debounce((value: number) => {
    setProfitMargin(value);
  }, 400);

  // 모든 원가 항목의 합계
  useEffect(() => {
    const totalTotal = costItems
      .filter((item) => item.formPath === "PriceCalculator")
      .reduce((sum, item) => sum + (item.amount ? item.amount : 0), 0);
    const sellingPrice = totalTotal * (profitMargin / 100);
    setTotalCost(totalTotal);
    setSellingPrice(sellingPrice);
  }, [costItems, profitMargin]);

  // 변수에 따라 원가 항목 입력을 숨김
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
            {costItems
              .filter((item) => item.formPath === "PriceCalculator")
              .map((item, index) => (
                <div key={index} className={styled.inputItem}>
                  <div className={styled.iconInfo}>
                    <ToolTipComponent index={item.id} />
                  </div>
                  <div className={styled.title}>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        handleNameChange(item.id, e.target.value)
                      }
                    />
                  </div>
                  <div className={styled.input}>
                    <input
                      type="number"
                      ref={inputRef}
                      defaultValue={item.amount}
                      placeholder="금액을 입력하세요."
                      onChange={(e) =>
                        handleCostChange(item.id, Number(e.target.value))
                      }
                    />
                  </div>
                  <div
                    className={styled.iconRemove}
                    onClick={() => handleRemoveCostItem(item.id)}
                  ></div>
                </div>
              ))}
            <div className={styled.inputItem}>
              <div className={styled.iconInfo}>
                <ToolTipComponent index={5} />
              </div>
              <div className={styled.title}>이익율</div>
              <div className={styled.input}>
                <input
                  type="number"
                  ref={inputRef}
                  defaultValue={profitMargin}
                  placeholder="금액을 입력하세요."
                  onChange={(e) => handleProfitChange(Number(e.target.value))}
                />
              </div>
              <div className={`${styled.iconRemove} ${styled.hidden}`}></div>
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
          {costItems
            .filter((item) => item.formPath === "PriceCalculator")
            .map((item, index) => (
              <tr key={index}>
                {index === 0 && (
                  <th
                    rowSpan={
                      costItems.filter(
                        (item) => item.formPath === "PriceCalculator"
                      ).length
                    }
                  >
                    원가
                  </th>
                )}
                <th>{item.name}</th>
                <td className={styled.em}>
                  {item.amount ? item.amount.toLocaleString() : 0}
                </td>
              </tr>
            ))}
          <tr>
            <th colSpan={2}>이익율(마진)</th>
            <td className={styled.em}>{profitMargin}%</td>
          </tr>
          <tr>
            <th colSpan={2} className={styled.total}>
              판매가(소비자가격)
            </th>
            <td className={styled.total}>{sellingPrice.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
      {chkInputHide()}
    </div>
  );
};

export default PriceCalculator;
