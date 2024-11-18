import React from "react";
import styled from "@/components/main/MainComponent.module.scss";

type Props = {
  data: any;
};

const CategoryItem: React.FC<{
  data: any;
  searchThemeList: (data: any) => void;
}> = ({ data, searchThemeList }) => {
  return (
    <div
      className={styled.categoryItem}
      onClick={() => {
        searchThemeList(data);
      }}
    >
      <div className={`${styled.icon}`}>
        <img src={data?.image} alt={data?.name || "category icon"}></img>
      </div>
      <div className={styled.name}>{data?.name}</div>
    </div>
  );
};

export default CategoryItem;
