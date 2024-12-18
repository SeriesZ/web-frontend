"use client";
import React, { useRef, useEffect } from "react";
import debounce from "lodash/debounce";
import styled from "@/components/idea/Idea.module.scss";
import ToolTipComponent from "./ToolTipComponent";
import { ICostInputItem, ICostData } from "@/model/financeType";

interface Props {
  inputHide: string;
  itemData: {
    costItems: ICostInputItem[];
    setCostItems: React.Dispatch<React.SetStateAction<ICostInputItem[]>>;
    totalCost: number;
    sellingPrice: number;
    totalSelYear: number;
  };
}

// [실적 단위 계산]
const PerformanceCalculator: React.FC<Props> = ({ inputHide, itemData }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { costItems, setCostItems, totalCost, sellingPrice, totalSelYear } =
    itemData;

  // 기존 원가 항목의 금액을 변경
  const handleCostChange = (apiId: string, amount: number) => {
    console.log("변경 : " + apiId);
    debouncedUpdateCost(apiId, amount);
  };

  // 기존 원가 항목의 이름을 변경
  const handleNameChange = (apiId: string, name: string) => {
    const newCostItems = costItems.map((item) =>
      item.apiId === apiId ? { ...item, name } : item
    );
    setCostItems(newCostItems);
  };

  // 새 원가 항목을 추가할 수 있는 입력 필드와 핸들러
  const handleAddCostItem = () => {
    const randomId = Math.floor(1000 + Math.random() * 9000).toString();
    setCostItems([
      ...costItems,
      {
        id: 9999,
        name: "항목입력",
        amount: 0,
        apiId: `performanceCalculator_${randomId}` as keyof ICostData,
        formPath: "PerformanceCalculator",
      },
    ]);
  };

  const handleRemoveCostItem = (apiId: string) => {
    const newCostItems = [...costItems].filter(
      (item, index) => item.apiId !== apiId
    );
    setCostItems(newCostItems);
  };

  // 원가율 계산(원가계/매출단위)
  function calculateCostRate(salesUnit: number, costUnit: number): number {
    if (salesUnit === 0) {
      throw new Error("Sales unit cannot be zero");
    }
    const costRate = (costUnit / salesUnit) * 100;
    return costRate;
  }

  // 디바운스
  const debouncedUpdateCost = debounce((apiId: string, amount: number) => {
    const newCostItems = costItems.map((item) =>
      item.apiId === apiId ? { ...item, amount } : item
    );
    setCostItems(newCostItems);
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
              .filter((item) => item.formPath === "PerformanceCalculator")
              .map((item, index) => (
                <div key={index} className={styled.inputItem}>
                  <div className={styled.iconInfo}>
                    <ToolTipComponent index={item.id} />
                  </div>
                  <div className={styled.title}>
                    <input
                      type="text"
                      className={styled.inputText}
                      value={item.name}
                      onChange={(e) =>
                        handleNameChange(item.apiId, e.target.value)
                      }
                    />
                  </div>
                  <div className={styled.input}>
                    <input
                      type="text"
                      className={styled.inputNumber}
                      ref={inputRef}
                      defaultValue={formatNumber(item.amount)}
                      placeholder="금액을 입력하세요."
                      onChange={(e) =>
                        handleCostChange(
                          item.apiId,
                          parseNumber(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div
                    className={styled.iconRemove}
                    onClick={() => handleRemoveCostItem(item.apiId)}
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
            <th>
              <div className={styled.thWrap}>
                매출 단위
                <span>
                  <ToolTipComponent index={8} />
                </span>
              </div>
            </th>
            <td>{sellingPrice ? sellingPrice.toLocaleString() : 0}</td>
          </tr>
          <tr>
            <th rowSpan={2}>매출원가</th>
            <th>
              <div className={styled.thWrap}>
                원가 단위
                <span>
                  <ToolTipComponent index={9} />
                </span>
              </div>
            </th>
            <td>{totalCost.toLocaleString()}</td>
          </tr>
          <tr>
            <th>
              <div className={styled.thWrap}>
                원가율
                <span>
                  <ToolTipComponent index={10} />
                </span>
              </div>
            </th>
            <td>
              {sellingPrice && totalCost
                ? calculateCostRate(sellingPrice, totalCost).toFixed(0)
                : 0}
              %
            </td>
          </tr>
          {costItems
            .filter((item) => item.formPath === "PerformanceCalculator")
            .map((item, index) => (
              <tr key={index}>
                {index === 0 && (
                  <th
                    rowSpan={
                      costItems.filter(
                        (item) => item.formPath === "PerformanceCalculator"
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
            <th colSpan={2} className={styled.total}>
              판관비 계(연비용)
            </th>
            <td className={styled.total}>{totalSelYear.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
      {chkInputHide()}
    </div>
  );
};

export default PerformanceCalculator;
