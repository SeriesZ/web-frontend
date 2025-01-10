import React, { useRef, useEffect, useState } from "react";
import styled from "@/components/idea/InvestPop.module.scss";
import DaumPostcode from "react-daum-postcode";

type Investor = {
  id: number;
  name: string;
  amount: number;
  equity: number;
  founder_name: string;
};

const SearchAddressPop: React.FC<{
  closeModal: () => void;
  onSelectAddress: (address: string) => void;
}> = ({ closeModal, onSelectAddress }) => {
  const [zodecode, setZonecode] = useState("");
  const [address, setAddress] = useState("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const themeObj = {
    bgColor: "#FFFFFF",
    pageBgColor: "#FFFFFF",
    postcodeTextColor: "#C05850",
    emphTextColor: "#222222",
  };

  const postCodeStyle = {
    width: "360px",
    height: "480px",
  };

  const completeHandler = (data: any) => {
    const { address } = data;
    onSelectAddress(address); // ✅ 선택한 주소 전달
    closeModal(); // 모달 닫기
  };

  const closeHandler = (state: any) => {
    if (state === "FORCE_CLOSE") {
      setIsOpen(false);
    } else if (state === "COMPLETE_CLOSE") {
      setIsOpen(false);
    }
  };

  return (
    <div className={styled.searchAddressPopContainer}>
      <DaumPostcode
        onComplete={completeHandler}
        style={{ width: "100%", height: "530px" }}
      />
      <button className={styled.closeModal} onClick={closeModal}>
        닫기
      </button>
    </div>
  );
};

export default SearchAddressPop;
