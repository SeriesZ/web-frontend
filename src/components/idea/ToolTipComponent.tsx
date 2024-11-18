"use client";
import React, { useEffect, useState } from "react";
import styled from "@/components/idea/Idea.module.scss";
import tooltipData from "../../store/ideaRegisterToolTipData.json";

interface Props {
  index: number; // index의 타입을 명시
}

const ToolTipComponent: React.FC<Props> = ({ index }) => {
  const createTooltip = (id: number) => {
    if (id == 9999) return;
    else
      return (
        <div className={styled.tooltip}>
          {tooltipData[id].messageList.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </div>
      );
  };

  return <>{createTooltip(index)}</>;
};

export default ToolTipComponent;
