import React from "react";
import styled from "@/components/idea/InvestPop.module.scss";

const InvestSecretAplConfirmPop: React.FC<{
  closeModal: () => void;
  clickInvestAplDone: () => void;
}> = ({ closeModal, clickInvestAplDone }) => {
  return (
    <div className={styled.beforeCheckContractPopContainer}>
      <div className={styled.modalContent}>
        <h2 className={styled.modalTitle}>
          비밀유지계약서 작성이 완료되었습니다. <br />
          투자의향 신청을 완료하겠습니까?
        </h2>
      </div>
      <div className={styled.actionCell}>
        <button
          onClick={() => {
            clickInvestAplDone();
          }}
        >
          예
        </button>
        <button onClick={closeModal}>아니오</button>
      </div>
    </div>
  );
};

export default InvestSecretAplConfirmPop;
