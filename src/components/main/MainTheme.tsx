import React, { useState } from "react";
import styled from "@/components/main/MainComponent.module.scss";
import { Category } from "@/model/IdeaList";
import { useRouter } from "next/navigation";

interface Props {
  itemData: Category[];
  moveUrl?: string;
}

const MainTheme: React.FC<Props> = ({ itemData, moveUrl }) => {
  const router = useRouter();
  const handleSelect = (item: Category) => {
    if (!moveUrl) return;
    router.push(`${moveUrl}?id=${item.id}&nm=${item.name}`);
  };

  return (
    <div className={styled.mainTheme}>
      <div className={styled.themeWrap}>
        {itemData.map((item, index) => {
          return (
            <div
              key={item.id}
              className={styled.themeItem}
              onClick={() => handleSelect(item)}
            >
              {item.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MainTheme;
