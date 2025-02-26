"use client";
import React, { useState, useEffect } from "react";
import styled from "@/components/main/MainComponent.module.scss";
import SectionTitle from "./SectionTitle";
import MainTheme from "./MainTheme";
import CompanyCard from "../common/Card";
import { Category, IdeaContentsType } from "@/model/IdeaList";

type Props = {};

const ThemeIdea = (props: Props) => {
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  const [listData, setListData] = useState<IdeaContentsType[]>([]);

  // 렌더 시 실행
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        // 카테고리 아이콘 로딩
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/themes`
        );
        const data = await response.json();
        const firstDataKey = data[0].id;
        const firstDataNm = data[0].name;
        setCategoryData(data);

        // 랜덤 4개 로딩
        const themes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/ideation/themes?offset=1`
        );
        const themesData = await themes.json();
        let ideaDataList: IdeaContentsType[] = [];
        Object.keys(themesData).map((item, index) => {
          themesData[item].forEach((element: IdeaContentsType) => {
            if (ideaDataList.length < 4 && element.close_date) {
              ideaDataList.push(element);
            }
          });
        });

        setListData(ideaDataList);
      } catch (error) {
        console.error("Error fetching category data:", error);
      } finally {
      }
    };

    fetchCategoryData();
  }, []);

  return (
    <div className={`${styled.wrapper} ${styled.themeIdea}`}>
      <SectionTitle
        title={"테마별 아이디어"}
        desc={"투자자에게 관심도가 높은 산업별 아이디어 목록을 알려드립니다."}
        moveUrl={"/idea/list"}
      />
      <MainTheme itemData={categoryData} moveUrl={"/idea/list"} />
      <div className={styled.cardWrap}>
        {listData && listData.length > 0 ? (
          listData.map((idea, index) => (
            <React.Fragment key={idea.id}>
              <CompanyCard data={idea} type={"idea"} />
            </React.Fragment>
          ))
        ) : (
          <p>데이터가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default ThemeIdea;
