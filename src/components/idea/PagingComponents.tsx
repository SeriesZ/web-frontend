"use client";
import React, { useEffect, useState } from "react";
import styled from "@/components/idea/Idea.module.scss";
import Pagination from "react-js-pagination";

interface Props {
  page: number;
  count: number;
  setPage: number;
}

const Paging: React.FC<Props> = ({ page, count, setPage }) => {
  const handlePageChange = (page: number) => {};

  return (
    <div className={styled.pageContainer}>
      <Pagination
        activePage={page} // 현재 페이지
        itemsCountPerPage={10} // 한 페이지랑 보여줄 아이템 갯수 (10)
        totalItemsCount={count} // 총 아이템 갯수 // totalItemCount
        pageRangeDisplayed={10} // paginator의 페이지 범위
        prevPageText={"‹"} // "이전"을 나타낼 텍스트
        nextPageText={"›"} // "다음"을 나타낼 텍스트
        onChange={handlePageChange} // 페이지 변경을 핸들링하는 함수
      />
    </div>
  );
};

export default Paging;
