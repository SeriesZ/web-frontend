import React from "react";
import styled from "@/components/idea/InvestPop.module.scss";

const InvestSecretAplDonePop: React.FC<{
  closeModal: () => void;
  moveInvestList: () => void;
}> = ({ closeModal, moveInvestList }) => {
  return (
    <div className={styled.investSecretAplDonePopContainer}>
      <div className={styled.modalContent}>
        <div>
          {" "}
          <img src={""} alt="투자확인" />
        </div>
        <h2 className={styled.modalTitle}>투자의향 신청이 완료되었습니다.</h2>
      </div>
      <div className={styled.actionCell}>
        <button
          onClick={() => {
            moveInvestList();
          }}
        >
          내 투자 관리
        </button>
        <button onClick={closeModal}>확인</button>
      </div>
    </div>
  );
};

export default InvestSecretAplDonePop;
