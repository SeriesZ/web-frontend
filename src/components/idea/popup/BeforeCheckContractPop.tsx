import React from "react";
import styled from "@/components/idea/InvestPop.module.scss";

type Investor = {
  id: number;
  name: string;
  amount: number;
  equity: number;
  founder_name: string;
};

const BeforeCheckContractPop: React.FC<{
  closeModal: () => void;
  data: any;
  openContractWritePop: (data: any) => void;
}> = ({ closeModal, data, openContractWritePop }) => {
  return (
    <div className={styled.beforeCheckContractPopContainer}>
      <div className={styled.modalContent}>
        <h2 className={styled.modalTitle}>
          투자자 <span>{data?.name}</span>님의 투자의향신청을 승인하고, <br />
          투자의향계약서를 작성하시겠습니까?
        </h2>
        <p className={styled.investorName}>
          본 투자 계약은 실제 투자 이전의 약식 계약서로 절대적인 법적 효력을
          지니고 있지는 않습니다. <br />본 계약서는 시리즈 제로 플랫폼에서
          약속된 투자 조건에 대한 합의각서로, <br />
          실제 투자 계약의 경우 투자자-예비창업자간 오프라인 미팅을 통해 합의된
          조건에 따라 실제 투자계약서를 작성하셔야 합니다.
        </p>
      </div>
      <div className={styled.actionCell}>
        <button
          onClick={() => {
            openContractWritePop(data);
          }}
        >
          확인
        </button>
        <button onClick={closeModal}>취소</button>
      </div>
    </div>
  );
};

export default BeforeCheckContractPop;
