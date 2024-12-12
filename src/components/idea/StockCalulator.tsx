"use client";
import React, { useRef, useState } from "react";
import { ICostInputItem } from "@/model/financeType";
import styled from "@/components/idea/Idea.module.scss";
import debounce from "lodash/debounce";
import ToolTipComponent from "./ToolTipComponent";

interface Props {
  name: string;
  inputHide: string;
  itemData: {
    costItems: ICostInputItem[];
    setCostItems: React.Dispatch<React.SetStateAction<ICostInputItem[]>>;
    maraketCap: number;
  };
}

// [발행주식 수 설정] : stock
// [투자목표 설정] : investGoal
const StockCalulator: React.FC<Props> = ({ name, inputHide, itemData }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { costItems, setCostItems, maraketCap } = itemData;
  const parValueItem = costItems.find((item) => item.apiId === "par_value");
  const targetRateItem = costItems.find(
    (item) => item.apiId === "target_investor_rate"
  );
  const [parValue, setParValue] = useState(parValueItem?.amount || 1);
  const [targetRate, setTargetRate] = useState(targetRateItem?.amount || 1);

  // 발행주식 테이블 컬럼
  const [stockItems, setStockItems] = useState<ICostInputItem[]>(
    costItems
      .filter((item) => item.formPath === "StockItems")
      .map((item) => {
        if (item.apiId === "total_stock_cnt") {
          return { ...item, amount: maraketCap / parValue };
        }
        if (item.apiId === "number_shares_per_share") {
          const totalStockCntAmount = maraketCap / parValue;
          return { ...item, amount: totalStockCntAmount / 100 };
        }
        return item;
      })
  );

  // 투자목표 설정 테이블 컬럼
  const [investItems, setInvestItems] = useState<ICostInputItem[]>(
    costItems
      .filter((item) => item.formPath === "InvestItems")
      .map((item) => {
        if (item.apiId === "investor_shares_total_shares") {
          return {
            ...item,
            amount: (maraketCap / parValue) * targetRate * 0.01,
          };
        } else if (item.apiId === "target_investor_amt") {
          return {
            ...item,
            amount: (maraketCap / parValue) * targetRate * 0.01 * parValue,
          };
        } else if (item.apiId === "min_investor_count") {
          return {
            ...item,
            amount: parValue,
          };
        }
        return item;
      })
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
    debouncedUpdateValue(apiId, amount);
  };

  // 디바운스
  const debouncedUpdateValue = debounce((apiId: string, amount: number) => {
    const newCostItems = costItems.map((item) =>
      item.apiId === apiId ? { ...item, amount } : item
    );
    setCostItems(newCostItems);
  }, 300);

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

  // 포커스 여부에 따라 calulatorUi 금액 className 변경
  function setFocusCol(item: ICostInputItem) {
    if (item.focus) {
      if (item.toolTip && item.toolTip > 0) {
        return (
          <td className={`${styled.em}`}>
            {item.amount ? Number(item.amount.toFixed(0)).toLocaleString() : 0}
            {item.strType}
          </td>
        );
      } else {
        return (
          <td className={`${styled.em}`}>
            {item.amount ? Number(item.amount.toFixed(0)).toLocaleString() : 0}
            {item.strType}
          </td>
        );
      }
    } else {
      if (item.toolTip && item.toolTip > 0) {
        return (
          <td>
            {Number(item.amount.toFixed(0)).toLocaleString()}
            <span>
              <ToolTipComponent index={item.toolTip} />
            </span>
          </td>
        );
      } else {
        return <td>{Number(item.amount.toFixed(0)).toLocaleString()}</td>;
      }
    }
  }
  const handleChangeNAme = () => {};

  // 변수에 따라 원가 항목 입력을 숨긴다
  function chkInputHide() {
    if (inputHide == "N")
      return (
        <div className={styled.inputContainer}>
          <div className={styled.inputWrap}>
            {inputUi.map((item, index) => (
              <div key={index} className={styled.inputItem}>
                <div className={styled.iconInfo}>
                  <ToolTipComponent index={item.toolTip ? item.toolTip : 25} />
                </div>
                <div className={styled.title}>
                  <input
                    type="text"
                    className={styled.inputText}
                    value={item.name}
                    onChange={handleChangeNAme}
                  />
                </div>
                <div className={styled.input}>
                  <input
                    type="text"
                    className={styled.inputNumber}
                    ref={inputRef}
                    defaultValue={formatNumber(item.amount)}
                    onChange={(e) =>
                      handleAmountChange(
                        item.apiId,
                        parseNumber(e.target.value)
                      )
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
