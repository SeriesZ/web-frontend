import React from "react";
import styled from "@/components/idea/InvestPop.module.scss";

type Investor = {
  id: number;
  name: string;
  amount: number;
  equity: number;
  founder_name: string;
};

const BeforeCheckInvestPop: React.FC<{
  closeModal: () => void;
  data: any;
  openInvestSecretWritePop: (data: any) => void;
}> = ({ closeModal, data, openInvestSecretWritePop }) => {
  return (
    <div className={styled.beforeCheckContractPopContainer}>
      <div className={styled.modalContent}>
        <h2 className={styled.modalTitle}>
          투자의향 신청을 위해 비밀유지협약을 <br /> 체결하시겠습니까?
        </h2>
        <p className={styled.investorName}>
          KTH1126님은 {data?.name ? data?.name : "예비 창업자"}님의 아이디어에
          대한 지색재산권을 보호하며, 투자 목적으로 본 정보를 활용할 것을
          협약합니다. 본 플랫폼 내에서의 투자 이외의 목적으로 지식재산물을 활용
          시, 시리즈 제로와 아이디어 보유자는 본 서비스 이용 중지에 대한 조치와
          민형사상의 손해배상을 청구할 수 있습니다.
        </p>
      </div>
      <div className={styled.actionCell}>
        <button
          onClick={() => {
            openInvestSecretWritePop(data);
          }}
        >
          확인
        </button>
        <button onClick={closeModal}>취소</button>
      </div>
    </div>
  );
};

export default BeforeCheckInvestPop;
