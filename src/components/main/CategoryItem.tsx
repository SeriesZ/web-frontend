import React from "react";
import styled from "@/components/main/MainComponent.module.scss";

type Props = {
  data: any;
};

const CategoryItem = ({ data }: Props) => {
  return (
    <div className={styled.categoryItem}>
      <div className={`${styled.icon} ${styled[data?.class]}`}></div>
      <div className={styled.name}>{data?.categoryNm}</div>
    </div>
  );
};

export default CategoryItem;
