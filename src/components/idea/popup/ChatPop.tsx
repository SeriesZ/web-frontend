import React, { useRef, useEffect, useState } from "react";
import styled from "@/components/idea/InvestPop.module.scss";

type Investor = {
  id: number;
  name: string;
  amount: number;
  equity: number;
  founder_name: string;
};

const ChatPop: React.FC<{
  closeModal: () => void;
  data: any;
}> = ({ closeModal, data }) => {
  const [chatMessage, setChatMessage] = useState([
    {
      id: 1,
      divCd: "received",
      detail: "투자를 희망합니다. 투자금 1,000,000원 / 지분율 0.125%",
      time: "오후 3:42",
    },
    {
      id: 2,
      divCd: "sent",
      detail: "투자 제안 감사합니다. 제안서를 검토 중입니다.",
      time: "오후 3:45",
    },
    {
      id: 3,
      divCd: "received",
      detail: "혹시 투자 조건에 대해 추가 논의가 가능할까요?",
      time: "오후 3:50",
    },
    {
      id: 4,
      divCd: "sent",
      detail: "물론입니다. 다음 주에 미팅 일정을 조율해보겠습니다.",
      time: "오후 3:55",
    },
    {
      id: 5,
      divCd: "received",
      detail: "네, 감사합니다. 일정 알려주시면 맞추겠습니다.",
      time: "오후 4:00",
    },
  ]);
  const [inputMessage, setInputMessage] = useState(""); // 입력 메시지 관리
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  // 전송 버튼 클릭 시 메시지 추가
  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return; // 빈 메시지는 전송하지 않음
    const newMessage = {
      id: chatMessage.length + 1,
      divCd: "sent", // 전송된 메시지
      detail: inputMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }), // 현재 시간
    };
    setChatMessage([...chatMessage, newMessage]); // 새 메시지 추가
    setInputMessage(""); // 입력창 비우기
  };

  // 메시지가 추가될 때마다 스크롤을 하단으로 이동
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessage]);

  return (
    <div className={styled.chatContainer}>
      <div className={styled.closeBtnWarp} onClick={closeModal}>
        <div></div>
        <h3>{data?.name}님</h3>
      </div>
      <div className={styled.messageContainer}>
        <div className={styled.investorName}>{data?.name}님</div>
        {chatMessage.map((msg) => (
          <div
            key={msg.id}
            className={
              msg.divCd === "received" ? styled.recievedWrap : styled.sentWrap
            }
          >
            <div className={styled.detail}>{msg.detail}</div>
            <div className={styled.time}>{msg.time}</div>
          </div>
        ))}
        {/* 스크롤을 위해 마지막 위치에 ref 추가 */}
        <div ref={messageEndRef} />
      </div>
      <input
        placeholder="채팅을 입력해주세요."
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
      ></input>
      <button
        onClick={handleSendMessage}
        className={
          inputMessage.trim() === "" ? styled.disabledBtn : styled.activeBtn
        }
      >
        전송
      </button>
    </div>
  );
};

export default ChatPop;
