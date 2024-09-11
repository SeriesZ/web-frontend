import React from "react";
import styled from "@/components/idea/Idea.module.scss";

type Props = {};

const PriceTable = (props: Props) => {
  return (
    <table>
      <thead>
        <tr>
          <th>구분</th>
          <th>원가 항목</th>
          <th>금액</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th rowSpan={4}>원가</th>
          <th>직접재료비</th>
          <td className={styled.em}></td>
        </tr>
        <tr>
          <th>직접노무비</th>
          <td className={styled.em}></td>
        </tr>
        <tr>
          <th>직접경비</th>
          <td className={styled.em}></td>
        </tr>
        <tr>
          <th>제조간접비</th>
          <td className={styled.em}></td>
        </tr>
        <tr>
          <th colSpan={2}>이익율(마진)</th>
          <td className={styled.em}></td>
        </tr>
        <tr>
          <th colSpan={2} className={styled.total}>
            판매가(소비자가격)
          </th>
          <td className={styled.total}></td>
        </tr>
      </tbody>
    </table>
  );
};

export default PriceTable;
