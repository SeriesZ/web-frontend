import React, { useState, useEffect } from "react";
import styled from "@/components/idea/InvestPop.module.scss";
import { Category, IdeaContentsType, investorsDataTy } from "@/model/IdeaList";
import { YearData, ICostInputItem } from "@/model/financeType";
import Paging from "../PagingComponents";

const InvestStatusPop: React.FC<{
  closeModal: () => void;
  dataList: IdeaContentsType;
  itemData: {
    costItems: ICostInputItem[];
    plan: YearData[];
    selectedTheme4Psr: Category;
    averageSales: number;
  };
  viewOption: string;
  openBeforeCheckContractPop: (data: any) => void;
}> = ({
  closeModal,
  dataList,
  itemData,
  viewOption,
  openBeforeCheckContractPop,
}) => {
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const { costItems, plan, selectedTheme4Psr, averageSales } = itemData;
  const [investorsDataAllList, setInvestorsAllData] = useState<
    investorsDataTy[]
  >([]);
  const [investorsDataShowList, setInvestorsShowData] = useState<
    investorsDataTy[]
  >([]);

  useEffect(() => {
    if (dataList) {
      // 목록 넣을 데이터 생성성
      const settingDataAllList: investorsDataTy[] = [];
      const settingDataShowList: investorsDataTy[] = [];
      dataList.investments.forEach((item, index) => {
        // 지분율 계산
        const psrValue = selectedTheme4Psr.psr_value
          ? selectedTheme4Psr.psr_value
          : 0;
        const maraketCap = averageSales * psrValue;
        const ownershipPercentageCal = (item.amount / maraketCap) * 100; // 지분율

        const dataForm = {
          id: index,
          investor_id: item.investor.id,
          investment_id: item.id,
          name: item.investor.name,
          amount: item.amount,
          equity: Number(Math.floor(ownershipPercentageCal * 10) / 10),
          founder_name: item.investor.name,
        };
        settingDataAllList.push(dataForm);

        if (index < 10) settingDataShowList.push(dataForm);
      });
      setTotalCount(settingDataAllList.length);
      setInvestorsAllData(settingDataAllList);
      setInvestorsShowData(settingDataShowList);
    }
  }, [dataList]);

  useEffect(() => {
    if (page && investorsDataAllList.length > 0) {
      let data: investorsDataTy[] = [];
      for (let i = 1; i < investorsDataAllList.length + 1; i++) {
        var startIdx = (page - 1) * 10 + 1;
        var endIdx =
          page * 10 > investorsDataAllList.length
            ? investorsDataAllList.length
            : page * 10;

        if (i >= startIdx && i <= endIdx) {
          data.push(investorsDataAllList[i - 1]);
        }
      }
      setInvestorsShowData(data);
    }
  }, [page]); // 상태 변경 시 실행

  const InvestorItem: React.FC<{ investor: investorsDataTy }> = ({
    investor,
  }) => (
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

  const showFinalBtnItems = (
    viewOption: string,
    investorInfo: investorsDataTy
  ) => {
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
            <span className={styled.highlight}>
              {investorsDataAllList.length}명
            </span>
          </p>
          <p>
            투자의향금액{" "}
            <span className={styled.highlight}>
              {investorsDataAllList
                .reduce((acc, curr) => acc + curr.amount, 0)
                .toLocaleString()}
              원
            </span>
          </p>
        </div>
        {showFinalBtnHeader(viewOption)}
      </div>
      <div className={styled.investorList}>
        {investorsDataShowList.map((investor) => (
          <InvestorItem key={investor.id} investor={investor} />
        ))}
      </div>

      <div className={styled.pagination}>
        <Paging
          page={page}
          count={totalCount}
          setPage={setPage}
          stytleDivCd={"pop-up"}
        />
        {/* <div className={styled.paginationLeft}></div>
        <button>1</button>
        <button className={styled.active}>2</button>
        <button>3</button>
        <button>4</button>
        <button>5</button>
        <button>6</button>
        <div className={styled.paginationRight}></div> */}
      </div>
    </div>
  );
};

export default InvestStatusPop;
