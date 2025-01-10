import React, { useRef, useEffect, useState } from "react";
import styled from "@/components/idea/InvestPop.module.scss";

type Investor = {
  id: number;
  name: string;
  amount: number;
  equity: number;
  founder_name: string;
};

const ContractSignPop: React.FC<{
  closeModal: () => void;
  data: any;
  openRoot: string;
  openChatPop: (data: any) => void;
  onSignComplete: (imageUrl: string) => void; // 서명 이미지 전달
}> = ({ closeModal, data, openRoot, openChatPop, onSignComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        setCtx(context);
        context.lineWidth = 2; // 선의 두께
        context.lineCap = "round"; // 선 끝 모양
        context.strokeStyle = "#000"; // 선 색상
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (ctx) {
      setDrawing(true);
      ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing || !ctx) return;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (ctx) {
      setDrawing(false);
      ctx.beginPath(); // 새로운 선을 시작
    }
  };

  const clearCanvas = () => {
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    }
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const imageUrl = canvas.toDataURL("image/png");
      onSignComplete(imageUrl); // ✅ 상위 컴포넌트로 서명 전달
      closeModal(); // 모달 닫기
    }
  };

  return (
    <div className={styled.contractSignPopContainer}>
      <h1>전자서명</h1>
      <div>
        <canvas
          ref={canvasRef}
          width={360}
          height={200}
          style={{ border: "1px solid #000", cursor: "crosshair" }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          className={styled.canvas}
        />
        {/* <div style={{ marginTop: "10px" }}>
          <button onClick={clearCanvas}>지우기</button>
          <button onClick={saveCanvas} style={{ marginLeft: "10px" }}>
            저장하기
          </button>
        </div> */}
      </div>
      <div className={styled.actionCell}>
        <button
          onClick={() => {
            if (openRoot == "invest") {
              saveCanvas();
            } else {
              openChatPop(data);
            }
          }}
        >
          확인
        </button>
        <button onClick={closeModal}>취소</button>
      </div>
    </div>
  );
};

export default ContractSignPop;
