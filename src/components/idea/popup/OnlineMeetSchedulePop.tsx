import React, { useState } from "react";
import styled from "@/components/idea/InvestPop.module.scss";
import TextField from "@mui/material/TextField";

const OnlineMeetSchedulePop: React.FC<{
  closeModal: () => void;
  data: any;
  saveOnlineUrl: (closeDt: string, url: string) => void;
}> = ({ closeModal, data, saveOnlineUrl }) => {
  const [ptDate, setPtDate] = useState(data.presentation_date);
  const [ptUrl, setPtUrl] = useState(data.presentation_url);

  return (
    <div className={styled.beforeCheckContractPopContainer}>
      <div className={styled.modalContent}>
        <h2 className={styled.modalTitle}>온라인 사업설명회 등록</h2>
        <TextField
          id="date"
          type="datetime-local"
          label="일정"
          value={ptDate}
          InputLabelProps={{ shrink: true }}
          sx={{
            width: "100%", // 너비 조정
            backgroundColor: "white", // 배경색
            marginTop: "10px",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#B6BDC4", // 기본 테두리 색상
              },
              "&:hover fieldset": {
                borderColor: "#1363DF", // 마우스 호버 시 테두리 색상
                borderWidth: "1px",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#1363DF", // 포커스 시 테두리 색상
                borderWidth: "1px",
              },
            },
          }}
          onChange={(e) => setPtDate(e.target.value)}
        />
        <TextField
          id="date"
          type="text"
          label="URL"
          value={ptUrl}
          InputLabelProps={{ shrink: true }}
          placeholder="온라인 사업설명회를 진행할 URL을 입력해주세요."
          sx={{
            width: "100%", // 너비 조정
            backgroundColor: "white", // 배경색
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#B6BDC4", // 기본 테두리 색상
              },
              "&:hover fieldset": {
                borderColor: "#1363DF", // 마우스 호버 시 테두리 색상
                borderWidth: "1px",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#1363DF", // 포커스 시 테두리 색상
                borderWidth: "1px",
              },
            },
          }}
          onChange={(e) => setPtUrl(e.target.value)}
        />
      </div>
      <div className={styled.actionCell}>
        <button
          onClick={() => {
            saveOnlineUrl(ptDate, ptUrl);
          }}
        >
          확인
        </button>
        <button onClick={closeModal}>취소</button>
      </div>
    </div>
  );
};

export default OnlineMeetSchedulePop;
