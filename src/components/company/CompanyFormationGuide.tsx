"use client";
import React, { useEffect, useState } from "react";
import commonStyled from "@/components/expert/Expert.module.scss";
import styled from "./Company.module.scss";
type Props = {};

const CompanyFormationGuide = (props: Props) => {
  const [capitalAmt, setCapitalAmt] = useState<string>("");
  const [proofFee, setProofFee] = useState<number>(2000);
  const [corpRegiTax, setCorpRegiTax] = useState<number>(0);
  const [corpRegiFee, setCorpRegiFee] = useState<number>(20000);
  const [valueAddedTax, setValueAddedTax] = useState<number>(0);
  const [agencyFee, setAgencyFee] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  // 자본금 입력되면 콤마 찍기
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, ""); // 입력 값에서 콤마 제거
    if (!isNaN(Number(rawValue))) {
      const formattedValue = new Intl.NumberFormat().format(Number(rawValue)); // 세 자리마다 콤마 추가
      setCapitalAmt(formattedValue); // 상태 업데이트
    }
  };

  // 설립등기 비용계산하기
  const clickCalBtn = () => {
    const rawValue = capitalAmt.replace(/,/g, "");
    const corpRegiTaxValue = Number(rawValue) * 0.004;
    const valueAddedTaxValue = (proofFee + corpRegiTax + corpRegiFee) * 0.1;
    const agencyFeeValue = Number(rawValue) * 0.01;
    setCorpRegiTax(corpRegiTaxValue);
    setValueAddedTax(valueAddedTaxValue);
    setAgencyFee(agencyFeeValue);

    const sum =
      proofFee +
      corpRegiTaxValue +
      corpRegiFee +
      valueAddedTaxValue +
      agencyFeeValue;
    setTotal(sum);
  };

  return (
    <div>
      <div className={commonStyled.mainContainer}>
        <div className={commonStyled.headerWrap}>
          <div className={commonStyled.titleWrap}>
            <div className={commonStyled.title}>법인 설립 가이드</div>
            <div className={commonStyled.desc}>
              법인 설립 가이드는 아이디어를 통해 신규법인을 설립하시고자 하는
              예비창업자분들을 위해 시리즈제로에서 제공하고 있는 가이드
              페이지입니다. 예비창업자님은 본 페이지를 통해 법인설립 단계와
              방법을 확인하실 수 있으며, 가장 중요한 법인설립 시 발생되는 비용에
              대한 계산과 설립 업체와의 연계를 통한 실제 설립까지 진행하실 수
              있습니다.
            </div>
          </div>
        </div>

        <div className={styled.contentContainer}>
          <div className={styled.contentWrap}>
            <h2>법인설립 신청 단계</h2>
            <div className={styled.steps}>
              <div className={styled.step}>
                <h4>
                  <span>1.</span> 비용확인·법인 신청
                </h4>
                <ul>
                  <li>시일조견표·법인설립/연계등록 대리점 신청</li>
                </ul>
              </div>
              <div className={styled.shortArrow}></div>
              <div className={styled.step}>
                <h4>
                  <span>2.</span> 법인회사 요건 결정
                </h4>
                <ul>
                  <li>사업목적</li>
                  <li>주식/기명/무기명 결정</li>
                  <li>법인소재지</li>
                  <li>자본금</li>
                  <li>상호</li>
                </ul>
              </div>
              <div className={styled.shortArrow}></div>
              <div className={styled.step}>
                <h4>
                  <span>3.</span> 등록면허세, 교육세 납부
                </h4>
                <p>자본금에 따른 등록면허세, 교육세 납부</p>
              </div>
              <div className={styled.stepBlank}></div>
              <div className={styled.step}>
                <h4>
                  <span>4.</span> 법인설립 필요서류 준비
                </h4>
                <ul>
                  <li>설립등기신청서</li>
                  <li>법인정관</li>
                  <li>발기인회의사록</li>
                  <li>주식발행사항동의서</li>
                  <li>주주명부</li>
                  <li>법인인감신고서 등</li>
                </ul>
              </div>
              <div className={styled.shortArrow}></div>
              <div className={styled.step}>
                <h4>
                  <span>5.</span> 법인설립등기 접수
                </h4>
              </div>
              <div className={styled.shortArrow}></div>
              <div className={styled.step}>
                <h4>
                  <span>6.</span> 법인사업자등록 신고
                </h4>
              </div>
              <div className={styled.stepLongArrow}></div>
            </div>
          </div>
          <h2>법인설립 모의 견적 계산</h2>
          <div className={styled.estimateSection}>
            <label>설립 자본금</label>
            <div className={styled.inputContainer}>
              <div className={styled.searchWrap}>
                <input
                  type="text" // 텍스트로 설정 (콤마 처리 때문에)
                  id="capitalInput"
                  placeholder="자본금을 입력해주세요."
                  value={capitalAmt} // 포맷된 값 사용
                  onChange={handleInputChange} // 입력 값 변경 핸들러
                />
                <div className={styled.iconSearch}></div>
              </div>
              <button
                className={styled.calculateBtn}
                id="calculateBtn"
                onClick={clickCalBtn} // 버튼 클릭 시 상태 출력
              >
                설립등기 비용계산하기
              </button>
            </div>
          </div>
          <p className={styled.result}>
            <strong>KTH1126</strong>님의 법인설립비용은{" "}
            <strong>{total.toLocaleString()}</strong>원 입니다.
          </p>
          <table className={styled.estimateTable}>
            <thead>
              <tr>
                <th className={styled.tableTitle}>비용항목</th>
                <th>비용 (단위: 원)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>잔액고 증명수수료</td>
                <td>{proofFee.toLocaleString()}</td>
              </tr>
              <tr>
                <td>법인등록면허세</td>
                <td>{corpRegiTax.toLocaleString()}</td>
              </tr>
              <tr>
                <td>법인등기수수료</td>
                <td>{corpRegiFee.toLocaleString()}</td>
              </tr>
              <tr>
                <td>부가가치세</td>
                <td>{valueAddedTax.toLocaleString()}</td>
              </tr>
              <tr>
                <td>대행사 수수료</td>
                <td>{agencyFee.toLocaleString()}</td>
              </tr>
              <tr>
                <td>계</td>
                <td>{total.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
          <p className={styled.disclaimer}>
            ※본 약식계산기는 일반과세를 기준하며 정확한 금액은 법인 설립 시
            법인설립대행사의 가이드를 통해 확인해야 합니다.
          </p>{" "}
          <p className={styled.disclaimer}>
            ※과밀억제권역인 수도권 소재 법인의 경우, 중과세 대상으로 약 3~4배의
            금액이 발생할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyFormationGuide;
