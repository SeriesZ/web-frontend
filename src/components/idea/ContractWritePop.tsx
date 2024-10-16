import React from "react";
import styled from "@/components/idea/InvestPop.module.scss";

type Investor = {
  id: number;
  name: string;
  amount: number;
  equity: number;
  founder_name: string;
};

const ContractWritePop: React.FC<{
  closeModal: () => void;
  data: any;
  openContractSignPop: (data: any) => void;
}> = ({ closeModal, data, openContractSignPop }) => {
  return (
    <div className={styled.contractWritePopContainer}>
      <div className={styled.container}>
        <h1>투자 의향 계약서</h1>
        <p className={styled.subTitle}>
          투자자인 <strong>Kyoungmin</strong>(이하 “갑”이라 한다)과 예비창업자{" "}
          <strong>{data?.name}</strong>(이하 “을”이라 한다)은 다음과 같은
          조건으로 투자계약을 체결한다.
        </p>
        <div className={styled.contents}>
          <strong>제1조</strong>(계약의 목적)본 계약은 “을”의 아이디어에 대해
          재원지원자로서 “갑”이 자금을 투자하여 이에 대한 수익을 분배하는 내용을
          규율함을 목적으로 한다. 다만, 본 계약은 실질 투자 진행에 따른 법적
          효력을 갖지 아니하며, 시리즈 프로젝트 내에 사실적 투자조건에 대한
          협의가 전제로 진행된다.
          <br />
          <br />
          <strong>제2조</strong>(투자자금) “갑”은 “을”에게 현금으로 임금
          월정(W)을 지원하며, 지급기는 넉 달인이다.
          <br />
          <br />
          <strong>제3조</strong>(투자수익) 본 계약 제1조의 “을”의 아이디어로부터
          수익을 창출할 시 “갑”에게 최소한 0%를 지급한다.
          <br />
          <br />
          <strong>제4조</strong>(비밀유지) “갑”은 투자 방법론 및 당사자의 진행
          방법론에 관한 상대방의 정보에 대하여 비밀의 보안을 유지한다. “갑”은
          단순한 정보 전부에 대해 제3자에게 이전, 전송, 처분할 수 없다.
          <br />
          <br />
          <strong>제5조</strong>(투자금의 관리) “을”은 투자를 위한 경영상의
          목적로만 사용하며 기타의 부동산 구입이나 그 밖의 개인적 용도 등의
          경영의 이외의 목적으로 사용할 수 없다.
        </div>
        <p className={styled.note}>
          이 계약의 체결사실 및 계약내용을 증명하기 위하여
          <br />이 계약서 2통 작성하여 “갑”과 “을”이 각자 서명 또는 기명날인한
          후 각자 1통씩 보관한다.
        </p>
        <div className={styled.date}>
          <span>2024년 06월 26일</span>
        </div>
        <div className={styled.signatures}>
          <div className={styled.signature}>
            <h3>Kyoungmin</h3>
            <p>
              <span>주소</span>서울시 서초구 방배동 1234
            </p>
            <p>
              <span>성명</span>김 정 민
              <span className={styled.signatureText}>(인)</span>
            </p>
          </div>
          <div className={styled.founderInfo}>
            <h3>Taehyun</h3>
            <div className={styled.info}>
              <span>상호 또는 명칭</span>
              <input type="text" placeholder="시리즈제료" />
            </div>
            <div className={`${styled.info} ${styled.addr}`}>
              <span>주소</span>
              <input type="text" placeholder="주소를 입력해주세요." disabled />
            </div>
            <div className={styled.info}>
              <span>사업자(법인)번호</span>
              <input type="text" placeholder="111-11-1111111" />
            </div>
            <div className={`${styled.info} ${styled.sign}`}>
              <span>대표자 성명</span>
              <p>
                {data?.founder_name}
                <span className={styled.signatureText}>(인)</span>
              </p>
            </div>
          </div>
        </div>
        <div className={styled.actionCell}>
          <button
            className={`${styled.submit}`}
            onClick={() => {
              openContractSignPop(data);
            }}
          >
            완료
          </button>
          <button className={`${styled.cancel}`} onClick={closeModal}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractWritePop;
