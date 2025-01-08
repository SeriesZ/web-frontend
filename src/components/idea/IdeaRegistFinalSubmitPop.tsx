import React from "react";
import styled from "@/components/idea/InvestPop.module.scss";

const IdeaRegistFinalSubmitPop: React.FC<{
  closeModal: () => void;
  clickFinalSubmit: () => void;
}> = ({ closeModal, clickFinalSubmit }) => {
  return (
    <div className={styled.beforeCheckContractPopContainer}>
      <div className={styled.modalContent}>
        <h2 className={styled.modalTitle}>최종 업로드를 완료하시겠습니까?</h2>
        <p className={styled.submitMsg}>
          1. 업로드 이후에 수정이 필요하시다면, '내 아이디어 관리'에서
          아이디어를 수정할 수 있습니다. 다만, 잦은 수정과 업데이트는
          투자자분들에게 신뢰적이지 않은 것으로 노출될 수 있으니 유의해주세요!
        </p>
        <p className={styled.submitMsg}>
          2. 아이디어의 게시 기간은 최초 업로드일 기준으로 +30일입니다. 30일이
          지나면 자동으로 마감되니 참고해주세요!
        </p>
      </div>
      <div className={styled.actionCell}>
        <button
          onClick={() => {
            clickFinalSubmit();
          }}
        >
          예
        </button>
        <button onClick={closeModal}>아니오</button>
      </div>
    </div>
  );
};

export default IdeaRegistFinalSubmitPop;
