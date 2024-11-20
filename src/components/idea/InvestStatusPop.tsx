import React from "react";
import styled from "@/components/idea/InvestPop.module.scss";

type Investor = {
  id: number;
  name: string;
  amount: number;
  equity: number;
  founder_name: string;
};

const InvestStatusPop: React.FC<{
  closeModal: () => void;
  viewOption: string;
  openBeforeCheckContractPop: (data: any) => void;
}> = ({ closeModal, viewOption, openBeforeCheckContractPop }) => {
  const investorsData = [
    {
      id: 1,
      name: "Taehyun",
      amount: 2000000,
      equity: 0.25,
      founder_name: "고태현",
    },
    {
      id: 2,
      name: "Taehyun",
      amount: 2000000,
      equity: 0.25,
      founder_name: "고태현",
    },
    {
      id: 3,
      name: "Taehyun",
      amount: 2000000,
      equity: 0.125,
      founder_name: "고태현",
    },
    {
      id: 4,
      name: "Taehyun",
      amount: 2000000,
      equity: 0.125,
      founder_name: "고태현",
    },
    {
      id: 5,
      name: "Taehyun",
      amount: 2000000,
      equity: 0.52,
      founder_name: "고태현",
    },
    {
      id: 6,
      name: "Taehyun",
      amount: 2000000,
      equity: 0.52,
      founder_name: "고태현",
    },
    {
      id: 7,
      name: "Taehyun",
      amount: 2000000,
      equity: 0.25,
      founder_name: "고태현",
    },
    {
      id: 8,
      name: "Taehyun",
      amount: 2000000,
      equity: 0.125,
      founder_name: "고태현",
    },
    {
      id: 9,
      name: "Taehyun",
      amount: 2000000,
      equity: 0.25,
      founder_name: "고태현",
    },
    {
      id: 10,
      name: "Taehyun",
      amount: 2000000,
      equity: 0.25,
      founder_name: "고태현",
    },
  ];

  const InvestorItem: React.FC<{ investor: Investor }> = ({ investor }) => (
    <div className={styled.investorItem}>
      <table className={styled.investorTable}>
        <tbody>
          <tr>
            <td className={styled.label}>투자자</td>
            <td className={styled.value}>{investor.name}님</td>
          </tr>
          <tr>
            <td className={styled.label}>투자금</td>
            <td className={styled.value}>
              {investor.amount.toLocaleString()}원
            </td>
            <td className={styled.label}>지분율</td>
            <td className={styled.value}>{investor.equity}%</td>
          </tr>
          {showFinalBtnItems(viewOption, investor)}
        </tbody>
      </table>
    </div>
  );

  const showFinalBtnHeader = (viewOption: string) => {
    if (viewOption === "final") {
      return (
        <div className={styled.finalBtnHeader}>
          <button>일괄승인</button>
          <button>일괄거절</button>
        </div>
      );
    }
    return null;
  };

  const showFinalBtnItems = (viewOption: string, investorInfo: Investor) => {
    if (viewOption === "final") {
      return (
        <tr>
          <td></td>
          <td></td>
          <td colSpan={2} className={styled.actionCell}>
            <div className={styled.buttonWrapper}>
              <button
                className={styled.button}
                onClick={() => {
                  openBeforeCheckContractPop(investorInfo);
                }}
              >
                승인
              </button>
              <button className={styled.button}>거절</button>
            </div>
          </td>
        </tr>
      );
    }
    return null;
  };

  return (
    <div className={styled.investStatusContainer}>
      <div className={styled.closeBtnWarp} onClick={closeModal}>
        <div></div>
      </div>
      <div className={styled.header}>
        <h1>투자 신청 현황</h1>
        <div className={styled.summary}>
          <p>
            투자의향자{" "}
            <span className={styled.highlight}>{investorsData.length}명</span>
          </p>
          <p>
            투자의향금액{" "}
            <span className={styled.highlight}>
              {investorsData
                .reduce((acc, curr) => acc + curr.amount, 0)
                .toLocaleString()}
              원
            </span>
          </p>
        </div>
        {showFinalBtnHeader(viewOption)}
      </div>
      <div className={styled.investorList}>
        {investorsData.map((investor) => (
          <InvestorItem key={investor.id} investor={investor} />
        ))}
      </div>
      <div className={styled.pagination}>
        <div className={styled.paginationLeft}></div>
        <button>1</button>
        <button className={styled.active}>2</button>
        <button>3</button>
        <button>4</button>
        <button>5</button>
        <button>6</button>
        <div className={styled.paginationRight}></div>
      </div>
    </div>
  );
};

export default InvestStatusPop;
