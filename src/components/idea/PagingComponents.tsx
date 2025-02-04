"use client";
import React, { useEffect, useState } from "react";
import styled from "@/components/idea/Idea.module.scss";
import modulStytle from "@/components/idea/InvestPop.module.scss";
import Pagination from "react-js-pagination";

interface Props {
  page: number;
  count: number;
  setPage: (page: number) => void;
  stytleDivCd: string;
}

const Paging: React.FC<Props> = ({ page, count, setPage, stytleDivCd }) => {
  const handlePageChange = (page: number) => {
    setPage(page);
  };

  useEffect(() => {
    show4StyleDivCd(stytleDivCd);
  }, [stytleDivCd]); // 상태 변경 시 실행

  const show4StyleDivCd = (divcd: string) => {
    if (divcd == "pop-up") {
      return (
        <>
          <div className={styled.pageContainer}>
            {" "}
            <Pagination
              activePage={page} // 현재 페이지
              itemsCountPerPage={10} // 한 페이지랑 보여줄 아이템 갯수 (10)
              totalItemsCount={count} // 총 아이템 갯수 // totalItemCount
              pageRangeDisplayed={10} // paginator의 페이지 범위
              prevPageText={<div className={modulStytle.paginationLeft}></div>}
              nextPageText={<div className={modulStytle.paginationRight}></div>}
              firstPageText=""
              lastPageText=""
              onChange={handlePageChange} // 페이지 변경을 핸들링하는 함수
              activeClass={modulStytle.active} // 활성화된 li 태그의 클래스
              itemClass={modulStytle.pageItem} // 활성화된 li 태그의 클래스
            />
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className={styled.pageContainer}>
            {" "}
            <Pagination
              activePage={page} // 현재 페이지
              itemsCountPerPage={10} // 한 페이지랑 보여줄 아이템 갯수 (10)
              totalItemsCount={count} // 총 아이템 갯수 // totalItemCount
              pageRangeDisplayed={10} // paginator의 페이지 범위
              prevPageText={"‹"} // "이전"을 나타낼 텍스트
              nextPageText={"›"} // "다음"을 나타낼 텍스트
              onChange={handlePageChange} // 페이지 변경을 핸들링하는 함수
              activeClass={styled.activeClasse} // 활성화된 li 태그의 클래스
            />
          </div>
        </>
      );
    }
  };

  return <>{show4StyleDivCd(stytleDivCd)}</>;
};

export default Paging;
