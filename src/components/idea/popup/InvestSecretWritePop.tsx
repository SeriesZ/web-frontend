"use client";
import React, { useState, useRef } from "react";
import styled from "@/components/idea/InvestPop.module.scss";
import SearchAddressPop from "./SearchAddressPop";
import Modal from "react-modal";
import html2pdf from "html2pdf.js";

type Investor = {
  id: number;
  name: string;
  amount: number;
  equity: number;
  founder_name: string;
};

const InvestSecretWritePop: React.FC<{
  closeModal: () => void;
  data: any;
  signImage?: string;
  openContractSign4SecretPop: (data: any) => void;
  openInvestSecretAplConfirmPop: (data: any) => void;
}> = ({
  closeModal,
  data,
  signImage,
  openContractSign4SecretPop,
  openInvestSecretAplConfirmPop,
}) => {
  // 현재 날짜
  const today = new Date();
  const year = today.getFullYear(); // 년도
  const month = String(today.getMonth() + 1).padStart(2, "0"); // 월 (0부터 시작하므로 +1)
  const day = String(today.getDate()).padStart(2, "0"); // 일
  const formattedDate = `${year}년 ${month}월 ${day}일`;

  // 주소 상태 및 모달 상태
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  // 주소 팝업 열기
  const openSearchAddressPop = () => {
    setIsAddressModalOpen(true);
  };
  const closSearchAddressPop = () => {
    setIsAddressModalOpen(false);
  };

  // 주소 선택 핸들러
  const handleAddressSelect = (address: string) => {
    setSelectedAddress(address); // 주소 입력창에 값 설정
    setIsAddressModalOpen(false); // 모달 닫기
  };

  /* 모달 재사용 */
  interface CustomModalProps {
    isOpen: boolean;
    closeModal: () => void;
    content: React.ReactNode; // or React.ReactElement if you want to be more specific
    customStyles?: React.CSSProperties; // Optional, as not all modals may need custom styles
  }
  const ModalComponent: React.FC<CustomModalProps> = ({
    isOpen,
    closeModal,
    content,
    customStyles,
  }) => (
    <Modal
      isOpen={isOpen}
      ariaHideApp={false}
      onRequestClose={closeModal}
      style={{
        content: {
          top: "50%",
          left: "50%",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          ...customStyles,
          borderRadius: "8px",
          boxShadow: "0px 6px 16px 0px #A5ABBA4D",
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)", // 검은색 배경, 투명도 50%
          zIndex: 1000, // 다른 요소 위에 나타나도록 설정
        },
      }}
    >
      {content}
    </Modal>
  );

  const handleExportClick = async () => {
    const contentElement = contentRef.current;
    if (!contentElement) return;

    // 1버튼 숨기기 (btn 클래스 모두 숨김)
    const buttons = contentElement.querySelectorAll(`.${styled.hiddenBtn}`);
    buttons.forEach((btn) => {
      (btn as HTMLElement).style.opacity = "0";
    });

    const option = {
      margin: [15, 25, 15, 25], // 마진을 배열로 설정하여 용지 여백없이 꽉 차게 export 할 수 있었다.
      filename: "비밀유지계약서", // 파일 이름을 props로 받는다.
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }, // ✅ orientation 추가
    };

    try {
      await html2pdf().from(contentElement).set(option).save();
    } catch (error) {
      console.error(error);
    } finally {
      // 버튼 다시 보이기
      buttons.forEach((btn) => {
        (btn as HTMLElement).style.opacity = "100";
      });
    }
  };

  return (
    <div className={styled.investSecretWritePopContainer} ref={contentRef}>
      <div className={styled.container}>
        <div className={styled.headerWrap}>
          <h1>비밀유지계약서 (Non Disclosure Agrrement)</h1>
          <div
            className={`${styled.btn} ${styled.hiddenBtn}`}
            onClick={handleExportClick}
          >
            <div className={styled.downloadImg}></div>
            Export
          </div>
        </div>
        <p className={styled.subTitle}>
          <strong>Kyoungmin</strong>(이하 “갑”이라 한다)와{" "}
          <strong>{data?.name ? data?.name : "Taehyun"}</strong>(이하 “을”이라
          한다)는 아래와 같이 비밀유지계약을 체결한다.
        </p>
        <div className={styled.contents}>
          <p>제1조(계약의 목적) </p>본 계약은 갑이 을에게 기술 또는 아이디어
          자료 등 비밀정보를 제공하는 경우 해당 자료를 비밀로 유지하고 보호하기
          위해 필요한 제반 사항을 규정함을 목적으로 한다.
          <br />
          <br />
          <p>제2조(기술자료의 정의) </p>① 이 계약에서 ‘기술자료’라 함은 갑에
          의해 비밀로 관리되고 있는 것으로서 다음 각 목의 어느 하나에 해당하는
          정보․자료를 말한다. <br />
          가. 제조․수리․시공 또는 용역수행 방법에 관한 정보․자료 <br />
          나. 특허권, 실용신안권, 디자인권, 저작권 등의 지식재산권과 관련된
          기술정보․자료로서 수급사업자의 기술개발(R&D)․생산․영업활동에
          기술적으로 유용하고 독립된 경제적 가치가 있는 것 <br />
          다. 시공프로세스 매뉴얼, 장비 제원, 설계도면, 연구자료, 연구개발보고서
          등 가목 또는 나목에 포함되지 않는 기타 사업자의 정보․자료로서
          수급사업자의 기술개발(R&D)․생산․영업활동에 기술적으로 유용하고 독립된
          경제적 가치가 있는 것 <br />② 갑이 기술자료를 제공함에 있어, 비밀임을
          알리는 문구(비밀 또는 대외비 등의 국문 또는 영문 표시 등을 의미)가
          표시되어 있지 아니하더라도 비밀로 관리되고 있는지 여부에는 영향을
          미치지 아니한다. <br />③ 을은 갑의 기술자료가 비밀로 관리되고 있는지
          여부(기술자료에서 제외되는지 여부)에 대해 의문이 있는 때에는 갑에게
          그에 대한 확인을 요청할 수 있다. 이 경우 갑은 확인 요청을 받은
          날로부터 15일 이내에 을에게 해당
        </div>
        <p className={styled.note}>
          이 계약의 체결사실 및 계약내용을 증명하기 위하여
          <br />이 계약서 2통 작성하여 “갑”과 “을”이 각자 서명 또는 기명날인한
          후 각자 1통씩 보관한다.
        </p>
        <div className={styled.dateCenter}>
          <span>{formattedDate}</span>
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
              <input
                type="text"
                placeholder="주소를 입력해주세요."
                value={selectedAddress} // 선택한 주소 반영
                readOnly
                onClick={openSearchAddressPop}
              />
            </div>
            <div className={styled.info}>
              <span>사업자(법인)번호</span>
              <input type="text" placeholder="111-11-1111111" />
            </div>
            <div className={`${styled.info} ${styled.sign}`}>
              <span>대표자 성명</span>
              <div>
                {data?.founder_name ? data?.founder_name : "Taehyun"}
                <span
                  className={styled.signatureText}
                  onClick={() => {
                    openContractSign4SecretPop(data);
                  }}
                >
                  (인)
                </span>
                {signImage && (
                  <img
                    src={signImage}
                    alt="서명"
                    style={{
                      width: "50px",
                      height: "50px",
                      marginRight: "10px",
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={styled.actionCell}>
          <button
            className={`${styled.submit} ${styled.hiddenBtn}`}
            onClick={() => {
              openInvestSecretAplConfirmPop(data);
            }}
          >
            완료
          </button>
          <button
            className={`${styled.cancel} ${styled.hiddenBtn}`}
            onClick={closeModal}
          >
            취소
          </button>
        </div>

        {/* 주소 검색 모달 */}
        <ModalComponent
          isOpen={isAddressModalOpen}
          closeModal={closSearchAddressPop}
          content={
            <div>
              {" "}
              <SearchAddressPop
                closeModal={closSearchAddressPop}
                onSelectAddress={handleAddressSelect}
              />
            </div>
          }
          customStyles={{
            width: "500px",
            height: "700px",
            padding: "40px",
            borderRadius: "8px",
          }}
        />
      </div>
    </div>
  );
};

export default InvestSecretWritePop;
