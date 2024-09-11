"use client";
import React from "react";
import styled from "@/components/main/MainComponent.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

type Props = {};

const MainSwiper = (props: Props) => {
  const Swiper1 = () => {
    return (
      <div className={styled.swiperItem}>
        <div className={styled.text}>
          <div className={styled.bold}>당신만의 창업의 문을 열다!</div>
          <div>창업준비단계에 있는 예비창업자와</div>
          <div>투자자의 연결을 지원하는 종합창업플랫폼</div>
        </div>
        <div className={styled.icon}></div>
      </div>
    );
  };
  const swiperData = [
    { id: 1, content: Swiper1 },
    { id: 2, content: Swiper1 },
    { id: 3, content: Swiper1 },
  ];
  return (
    <div className={styled.mainSwiper}>
      <div className={styled.swiperWrap}>
        <Swiper slidesPerView={1} pagination={true} modules={[Pagination]}>
          {swiperData.map((item, index) => {
            return <SwiperSlide key={item.id}>{item.content}</SwiperSlide>;
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default MainSwiper;
