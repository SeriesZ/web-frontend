"use client";
import React, { useState } from "react";
import styled from "@/components/main/MainComponent.module.scss";
import CategoryItem from "./CategoryItem";
import CompanyCard from "../common/Card";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import SwiperCore from "swiper";

type Props = {};

const IdeaList = (props: Props) => {
  const [swiper, setSwiper] = useState<SwiperCore>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setOpen] = useState(false);
  const handleActiveIndex = (index: number) => {
    setActiveIndex(index);
  };
  const categoryData = [
    { id: 1, categoryNm: "전체", class: "all" },
    { id: 2, categoryNm: "BEST 투자", class: "best" },
    { id: 3, categoryNm: "농림업", class: "agriculture" },
    { id: 4, categoryNm: "광업", class: "mining" },
    { id: 5, categoryNm: "제조업", class: "manufacturing" },
    { id: 6, categoryNm: "음식료/담배", class: "food" },
    { id: 7, categoryNm: "섬유/의류", class: "apparel" },
    { id: 8, categoryNm: "종이/목재", class: "wood" },
    { id: 9, categoryNm: "출판/매체복제", class: "publishing" },
    { id: 10, categoryNm: "화학", class: "chemicals" },
    { id: 11, categoryNm: "자약", class: "herbal" },
    { id: 12, categoryNm: "비금속", class: "nonmetals" },
    { id: 13, categoryNm: "금속", class: "metals" },
    { id: 14, categoryNm: "기계장비", class: "mechanical" },
    { id: 15, categoryNm: "일반전기전자", class: "electrical" },
    { id: 16, categoryNm: "의료/정밀기계", class: "medical" },
  ];
  const swiperData = [
    { id: 1, title: "홈짐", desc: "나만의 PT 선생님", adYn: "Y" },
    {
      id: 2,
      title: "마이풋볼러",
      desc: "내 축구선수의 꿈을 이루어주는 트레이닝 코치",
      adYn: "N",
    },
    {
      id: 3,
      title: "R House",
      desc: "무인 로봇이 운영하는 차세대 첨단 숙박시설",
      adYn: "Y",
    },
  ];
  const listData = [
    {
      id: 1,
      title: "홈짐",
      desc: "모바일 디바이스 기반의 어플리케이션을 통해 컴퓨터 비전 기술을 활용하여 집안에서 본인의 체형, 건강을 확인하고..",
      dday: 32,
      dueDt: "2024-06-25",
      hits: 10000,
      rate: 0.8,
      thumbnail: "",
    },
    {
      id: 2,
      title: "마이 풋볼러",
      desc: "Computer Vision 기술을 활용하여 자신의 축구 플레이 영상을 녹화/저장한 후 유명 선수 데이터를 기준으로 부족한 점을 찾아드립니다.",
      dday: 32,
      dueDt: "2024-06-25",
      hits: 10000,
      rate: 0.8,
      thumbnail: "",
    },
    {
      id: 3,
      title: "나만의 드로잉",
      desc: "창작이 가능한 아트테크 플랫폼 나만의 창작물을 Tool 내에서 만들고 결과물을 가상거래소에 업로드하세요!자신의 창작물을 판매할 수 있습니다.",
      dday: 32,
      dueDt: "2024-06-25",
      hits: 10000,
      rate: 0.8,
      thumbnail: "",
    },
    {
      id: 4,
      title: "바디 메이킹",
      desc: "체형 교정이 가능하고 착용감이 편리한 척추 교정 제품! 직장인들의 굽은 등, 거북목의 교정을 위한 저렴하고 합리적인 가격!",
      dday: 32,
      dueDt: "2024-06-25",
      hits: 10000,
      rate: 0.8,
      thumbnail: "",
    },
    {
      id: 1,
      title: "홈짐",
      desc: "모바일 디바이스 기반의 어플리케이션을 통해 컴퓨터 비전 기술을 활용하여 집안에서 본인의 체형, 건강을 확인하고..",
      dday: 32,
      dueDt: "2024-06-25",
      hits: 10000,
      rate: 0.8,
      thumbnail: "",
    },
    {
      id: 2,
      title: "마이 풋볼러",
      desc: "Computer Vision 기술을 활용하여 자신의 축구 플레이 영상을 녹화/저장한 후 유명 선수 데이터를 기준으로 부족한 점을 찾아드립니다.",
      dday: 32,
      dueDt: "2024-06-25",
      hits: 10000,
      rate: 0.8,
      thumbnail: "",
    },
    {
      id: 3,
      title: "나만의 드로잉",
      desc: "창작이 가능한 아트테크 플랫폼 나만의 창작물을 Tool 내에서 만들고 결과물을 가상거래소에 업로드하세요!자신의 창작물을 판매할 수 있습니다.",
      dday: 32,
      dueDt: "2024-06-25",
      hits: 10000,
      rate: 0.8,
      thumbnail: "",
    },
    {
      id: 4,
      title: "바디 메이킹",
      desc: "체형 교정이 가능하고 착용감이 편리한 척추 교정 제품! 직장인들의 굽은 등, 거북목의 교정을 위한 저렴하고 합리적인 가격!",
      dday: 32,
      dueDt: "2024-06-25",
      hits: 10000,
      rate: 0.8,
      thumbnail: "",
    },
    {
      id: 1,
      title: "홈짐",
      desc: "모바일 디바이스 기반의 어플리케이션을 통해 컴퓨터 비전 기술을 활용하여 집안에서 본인의 체형, 건강을 확인하고..",
      dday: 32,
      dueDt: "2024-06-25",
      hits: 10000,
      rate: 0.8,
      thumbnail: "",
    },
    {
      id: 2,
      title: "마이 풋볼러",
      desc: "Computer Vision 기술을 활용하여 자신의 축구 플레이 영상을 녹화/저장한 후 유명 선수 데이터를 기준으로 부족한 점을 찾아드립니다.",
      dday: 32,
      dueDt: "2024-06-25",
      hits: 10000,
      rate: 0.8,
      thumbnail: "",
    },
    {
      id: 3,
      title: "나만의 드로잉",
      desc: "창작이 가능한 아트테크 플랫폼 나만의 창작물을 Tool 내에서 만들고 결과물을 가상거래소에 업로드하세요!자신의 창작물을 판매할 수 있습니다.",
      dday: 32,
      dueDt: "2024-06-25",
      hits: 10000,
      rate: 0.8,
      thumbnail: "",
    },
    {
      id: 4,
      title: "바디 메이킹",
      desc: "체형 교정이 가능하고 착용감이 편리한 척추 교정 제품! 직장인들의 굽은 등, 거북목의 교정을 위한 저렴하고 합리적인 가격!",
      dday: 32,
      dueDt: "2024-06-25",
      hits: 10000,
      rate: 0.8,
      thumbnail: "",
    },
    {
      id: 1,
      title: "홈짐",
      desc: "모바일 디바이스 기반의 어플리케이션을 통해 컴퓨터 비전 기술을 활용하여 집안에서 본인의 체형, 건강을 확인하고..",
      dday: 32,
      dueDt: "2024-06-25",
      hits: 10000,
      rate: 0.8,
      thumbnail: "",
    },
    {
      id: 2,
      title: "마이 풋볼러",
      desc: "Computer Vision 기술을 활용하여 자신의 축구 플레이 영상을 녹화/저장한 후 유명 선수 데이터를 기준으로 부족한 점을 찾아드립니다.",
      dday: 32,
      dueDt: "2024-06-25",
      hits: 10000,
      rate: 0.8,
      thumbnail: "",
    },
    {
      id: 3,
      title: "나만의 드로잉",
      desc: "창작이 가능한 아트테크 플랫폼 나만의 창작물을 Tool 내에서 만들고 결과물을 가상거래소에 업로드하세요!자신의 창작물을 판매할 수 있습니다.",
      dday: 32,
      dueDt: "2024-06-25",
      hits: 10000,
      rate: 0.8,
      thumbnail: "",
    },
    {
      id: 4,
      title: "바디 메이킹",
      desc: "체형 교정이 가능하고 착용감이 편리한 척추 교정 제품! 직장인들의 굽은 등, 거북목의 교정을 위한 저렴하고 합리적인 가격!",
      dday: 32,
      dueDt: "2024-06-25",
      hits: 10000,
      rate: 0.8,
      thumbnail: "",
    },
  ];

  return (
    <div className={`${styled.wrapper} ${styled.ideaList}`}>
      <div className={styled.swiperWrap}>
        {swiper && (
          <div className={"swiper-navigation-wrap"}>
            <div
              className={`swiper-button-prev ${
                activeIndex === 0 ? "hidden" : ""
              }`}
            ></div>
            <div
              className={`swiper-button-next ${
                activeIndex === swiper?.slides?.length - 1 ? "hidden" : ""
              }`}
            ></div>
          </div>
        )}
        <Swiper
          effect={"coverflow"}
          slidesPerView={3}
          spaceBetween={64}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          modules={[EffectCoverflow, Navigation]}
          centeredSlides={true}
          // loop={true}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2,
            slideShadows: false,
          }}
          onSwiper={setSwiper}
          onSlideChange={(swiper: any) => handleActiveIndex(swiper.activeIndex)}
        >
          {swiperData.map((item, index) => {
            return (
              <SwiperSlide key={item.id}>
                <div className={styled.swiperItem}>
                  {/* <img className={styled.bg} alt="background" /> */}
                  <div className={styled.bg}></div>
                  <div className={styled.info}>
                    {item.adYn === "Y" && <div className={styled.ad}>AD</div>}
                    <div className={styled.title}>{item.title}</div>
                    <div className={styled.desc}>{item.desc}</div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
      <div className={styled.categoryWrap}>
        {categoryData?.map((item, index) => {
          return (
            <React.Fragment key={item.id}>
              <CategoryItem data={item} />
            </React.Fragment>
          );
        })}
      </div>
      <div className={styled.listWrap}>
        {/* 카테고리에 따라 url 변경하고 데이터 가져와서 뿌릴건지? */}
        <div className={styled.sortWrap}>
          <div
            className={`${styled.iconArrow} ${!isOpen ? styled.close : ""}`}
          ></div>
          <div className={styled.sortItems}>
            <div>추천순</div>
            <div>조회수</div>
            <div>달성율</div>
            <div>모집금액순</div>
            <div>마감임박순</div>
            <div>최신순</div>
          </div>
        </div>
        <div className={styled.cardWrap}>
          {listData.map((item, index) => {
            return (
              <React.Fragment key={item.id}>
                <CompanyCard data={item} type={"idea"} />
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default IdeaList;
