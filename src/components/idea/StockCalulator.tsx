"use client";
import React, { useEffect, useState } from "react";
import styled from "@/components/idea/Idea.module.scss";
import useIdeaPriceStore from "@/store/useIdeaPriceStore";

interface Props {
  name: string;
  inputHide: string;
}

const StockCalulator: React.FC<Props> = ({ name, inputHide }) => {
  const { totalMarketPrice } = useIdeaPriceStore();
  // 발행주식 수 설정 테이블 컬럼
  const [stockItems, setStockItems] = useState<ICostItem[]>([
    {
      id: 9999,
      name: "액면가",
      amount: 0,
      description: "1주의 최소금액은 상법상 100원 이상",
      focus: true,
    },
    {
      id: 9999,
      name: "총 발생주식 수",
      amount: 0,
      description: "5년차까지 평균매출 x PSR",
      focus: false,
    },
    {
      id: 9999,
      name: "지분율 당 주식수",
      amount: 0,
      description: "",
      focus: false,
    },
  ]);

  // 투자목표 설정 테이블 컬럼
  const [investItems, setInvestItems] = useState<ICostItem[]>([
    {
      id: 9999,
      name: "목표 투자자 지분율",
      amount: 40,
      description: "경영권 유지를 위해 49%이하를 가정해야 함",
      focus: true,
      strType: "%",
    },
    {
      id: 9999,
      name: "투자자 지분 총 주식 수",
      amount: 386568,
      description: "",
      focus: false,
    },
    {
      id: 9999,
      name: "목표 투자자 조달금액",
      amount: 386568000,
      description: "",
      focus: false,
    },
    {
      id: 9999,
      name: "1인당 최소투자금",
      amount: 0,
      description: "액면가를 기준으로 자동으로 설정됨",
      focus: false,
    },
    {
      id: 9999,
      name: "1인당 최대투자금",
      amount: 200000000,
      description: "",
      focus: true,
    },
    {
      id: 9999,
      name: "최대 투자자 수 설정(명)",
      amount: 1000,
      description: "",
      focus: true,
    },
  ]);

  // 발행주식 수 설정 입력항목
  const [stockInputItems, setStockInputItems] = useState<ICostItem[]>([
    {
      id: 9999,
      name: "액면가",
      amount: 0,
    },
  ]);

  // 투자목표 설정 입력항목
  const [investInputItems, setInvestInputItems] = useState<ICostItem[]>([
    {
      id: 9999,
      name: "목표투자자 지분율",
      amount: 0,
    },
    {
      id: 9999,
      name: "1인당 최대 투자금",
      amount: 0,
    },
    {
      id: 9999,
      name: "최대 투자자 수 설정",
      amount: 0,
    },
  ]);

  // 재사용 하기 위함
  var calulatorUi = name == "stock" ? stockItems : investItems;
  var inputUi = name == "stock" ? stockInputItems : investInputItems;

  // 기존 액면가 항목의 금액을 변경할 수 있는 입력 필드와 핸들러
  const handleAmountChange = (index: number, amount: number) => {
    let chkTotalMarketPrice = 0;
    if (totalMarketPrice) {
      chkTotalMarketPrice = totalMarketPrice;
    }

    if (name == "stock") {
      const newCostItems = [...stockItems];
      newCostItems[0].amount = amount;
      newCostItems[1].amount = amount * chkTotalMarketPrice;
      newCostItems[2].amount = (amount * chkTotalMarketPrice) / 100;
      setStockItems(newCostItems);

      const newCostInputItems = [...stockInputItems];
      newCostInputItems[0].amount = amount;
      setStockInputItems(newCostInputItems);
    } else if (name == "investGoal") {
      const newCostItems = [...investItems];
      switch (index) {
        case 0:
          newCostItems[0].amount = amount; //목표 투자자 지분율
          break;
        case 1:
          newCostItems[4].amount = amount; // 1인당 최대 투자금
          break;
        case 2:
          newCostItems[5].amount = amount; // 최대 투자자 수 설정
          break;
      }
      setInvestItems(newCostItems);

      const newCostInputItems = [...investInputItems];
      newCostInputItems[index].amount = amount;
      setInvestInputItems(newCostInputItems);
    }
  };

  useEffect(() => {
    console.log("totalMarketPrice 변동 :: ", totalMarketPrice);
    //handleAmountChange(stockItems[0].amount);
  }, [totalMarketPrice]);

  // 포커스 여부에 따라 calulatorUi 금액 className 변경
  function setFocusCol(item: ICostItem) {
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
                      handleAmountChange(index, Number(e.target.value))
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
