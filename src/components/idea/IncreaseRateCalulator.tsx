"use client";
import React, { useRef } from "react";
import debounce from "lodash/debounce";
import styled from "@/components/idea/Idea.module.scss";
import { ICostInputItem, ICostData } from "@/model/financeType";

interface Props {
  inputHide: string;
  itemData: {
    costItems: ICostInputItem[];
    setCostItems: React.Dispatch<React.SetStateAction<ICostInputItem[]>>;
  };
}

// [인상률 설정]
const IncreaseRateCalulator: React.FC<Props> = ({ inputHide, itemData }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { costItems, setCostItems } = itemData;

  // 기존 원가 항목의 금액을 변경
  const handleCostChange = (apiId: string, amount: number) => {
    debouncedUpdateCost(apiId, amount);
  };

  // 기존 원가 항목의 이름을 변경
  const handleNameChange = (apiId: string, name: string) => {
    debouncedUpdateName(apiId, name);
  };

  // 새 원가 항목을 추가할 수 있는 입력 필드와 핸들러
  const handleAddCostItem = () => {
    const randomId = Math.floor(1000 + Math.random() * 9000).toString();
    const newItem: ICostInputItem = {
      id: 9999,
      name: "항목입력",
      amount: 0,
      apiId: `increaseRateCalulator_${randomId}` as keyof ICostData,
      formPath: "IncreaseRateCalulator",
    };
    setCostItems([...costItems, newItem]);
  };

  const handleRemoveCostItem = (apiId: string) => {
    const newCostItems = [...costItems].filter(
      (item, index) => item.apiId !== apiId
    );
    setCostItems(newCostItems);
  };

  // 디바운스
  const debouncedUpdateCost = debounce((apiId: string, amount: number) => {
    const newCostItems = costItems.map((item) =>
      item.apiId === apiId ? { ...item, amount } : item
    );
    setCostItems(newCostItems);
  }, 400);

  const debouncedUpdateName = debounce((apiId: string, name: string) => {
    const newCostItems = costItems.map((item) =>
      item.apiId === apiId ? { ...item, name } : item
    );
    setCostItems(newCostItems);
  }, 400);

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
            {costItems
              .filter((item) => item.formPath === "IncreaseRateCalulator")
              .map((item, index) => (
                <div key={index} className={styled.inputItem}>
                  {item.id !== 9999 && <div className={styled.iconInfo}></div>}
                  <div className={styled.title}>
                    <input
                      type="text"
                      ref={inputRef}
                      defaultValue={item.name}
                      onChange={(e) =>
                        handleNameChange(item.apiId, e.target.value)
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
                        handleCostChange(item.apiId, Number(e.target.value))
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
            <th>비고</th>
          </tr>
        </thead>
        <tbody>
          {costItems
            .filter((item) => item.formPath === "IncreaseRateCalulator")
            .map((item, index) => (
              <tr key={index}>
                <th>{item.name}</th>
                <td className={styled.em}>{item.amount.toLocaleString()}%</td>
                <th>{item.description}</th>
              </tr>
            ))}
        </tbody>
      </table>
      {chkInputHide()}
    </div>
  );
};

export default IncreaseRateCalulator;
