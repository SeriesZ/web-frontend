import React, { useState } from "react";
import { InvestAmtMap } from "@/model/financeType";
import styled from "@/components/idea/InvestPop.module.scss";

const InvestSecretAplDonePop: React.FC<{
  closeModal: () => void;
  moveInvestList: () => void;
  investData: InvestAmtMap;
}> = ({ closeModal, moveInvestList, investData }) => {
  const [investData4Setting, setInvestData] =
    useState<InvestAmtMap>(investData);

  return (
    <div className={styled.investSendContainer}>
      <div className={styled.modalContent}>
        <h2 className={styled.modalTitle}>투자의향 신청이 완료되었습니다.</h2>
        <div className={styled.tableSection}>
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
                <td>{investData4Setting.capitalAmt}원</td>
              </tr>
              <tr>
                <td>지분율</td>
                <td>{Number(investData4Setting.ownershipPercentage)}%</td>
              </tr>
              <tr>
                <td>취득 주식 수</td>
                <td>
                  {investData4Setting.plusProtitRate
                    ? Number(
                        investData4Setting.ownershipCnt.toFixed(0)
                      ).toLocaleString()
                    : 0}
                  주
                </td>
              </tr>
              <tr>
                <td>(EXIT까지의) 기간</td>
                <td>투자 {investData4Setting.plusProfitYear}년차</td>
              </tr>
              <tr>
                <td>(EXIT까지의) 수익율</td>
                <td>
                  {investData4Setting.plusProtitRate
                    ? Number(
                        investData4Setting.plusProtitRate.toFixed(0)
                      ).toLocaleString()
                    : 0}
                  %
                </td>
              </tr>
              <tr>
                <td>연 수익율</td>
                <td>
                  {investData4Setting.plusProfitYear
                    ? Number(
                        (
                          investData4Setting.plusProtitRate /
                          investData4Setting.plusProfitYear
                        ).toFixed(0)
                      ).toLocaleString()
                    : 0}
                  %
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className={styled.buttonSection}>
        <button
          className={styled.submitBtn}
          onClick={() => {
            moveInvestList();
          }}
        >
          내 투자 관리
        </button>
        <button className={styled.cancelBtn} onClick={closeModal}>
          확인
        </button>
      </div>
    </div>
  );
};

export default InvestSecretAplDonePop;
