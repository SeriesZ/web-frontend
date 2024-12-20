import React, { useRef, useEffect, useState } from "react";
import styled from "@/components/idea/InvestPop.module.scss";

type Investor = {
  id: number;
  name: string;
  amount: number;
  equity: number;
  founder_name: string;
};

const InvestSendPop: React.FC<{
  closeModal: () => void;
  data: any;
}> = ({ closeModal, data }) => {
  const [investment, setInvestment] = useState("");

  const handleInputChange = (e: any) => {
    setInvestment(e.target.value);
  };

  return (
    <div className={styled.investSendContainer}>
      <div className={styled.topSection}>
        <h1 className={styled.title}>
          투자의향 전달을 위해 다음의 항목을 설정하셔야 합니다.
        </h1>
        <div className={styled.infoSection}>
          <button className={styled.blueBtn}>최근정보불러오기</button>
          <span className={styled.infoDate}>2024.05.30 19:35:00</span>
        </div>
        <div className={styled.inputSection}>
          <label className={styled.label}>투자예상금액</label>
          <input
            type="text"
            placeholder="금액을 입력하세요."
            className={styled.inputBox}
            value={investment}
            onChange={handleInputChange}
          />
        </div>
        <div className={styled.tableSection}>
          <h3 className={styled.tableTitle}>투자 조건표 (요약)</h3>
          <table>
            <thead>
              <tr>
                <th>구분</th>
                <th>금액</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>개인 투자금액</td>
                <td>0원</td>
              </tr>
              <tr>
                <td>지분율</td>
                <td>0%</td>
              </tr>
              <tr>
                <td>취득 주식 수</td>
                <td>0주</td>
              </tr>
              <tr>
                <td>(EXIT까지의) 기간</td>
                <td>투자 0년차</td>
              </tr>
              <tr>
                <td>(EXIT까지의) 수익율</td>
                <td>0%</td>
              </tr>
              <tr>
                <td>연 수익율</td>
                <td>0%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className={styled.buttonSection}>
        <button className={styled.submitBtn}>최종완료</button>
        <button className={styled.cancelBtn} onClick={closeModal}>
          취소
        </button>
      </div>
    </div>
  );
};

export default InvestSendPop;
