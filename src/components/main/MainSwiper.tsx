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
        <div className={styled.icon1}></div>
      </div>
    );
  };
  const Swiper2 = () => {
    return (
      <div className={styled.swiperItem}>
        <div className={styled.text}>
          <div className={styled.bold}>
            시리즈제로의 데이터 분석 시스템을 통해
          </div>
          <div>스타트업 성장과 투자 EXIT 가능성을 확인하고,</div>
          <div>합리적이고 신뢰할 수 있는 투자 결정을 지원합니다.</div>
        </div>
        <div className={styled.icon2}></div>
      </div>
    );
  };
  const Swiper3 = () => {
    return (
      <div className={styled.swiperItem}>
        <div className={styled.text}>
          <div className={styled.bold}>
            체계적인 비즈니스 전략으로 시장 진입부터 확장까지 지원하며,
          </div>
          <div>
            실패를 줄이고 성장 가능성을 극대화하는 멘토링을 제공합니다.{" "}
          </div>
          <div>지금 시작해보세요!</div>
        </div>
        <div className={styled.icon3}></div>
      </div>
    );
  };
  const swiperData = [
    { id: 1, content: Swiper1 },
    { id: 2, content: Swiper2 },
    { id: 3, content: Swiper3 },
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
