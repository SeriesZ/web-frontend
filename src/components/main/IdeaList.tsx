"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Pagination,
  Navigation,
  Autoplay,
} from "swiper/modules";
import { Category, IdeaContentsType } from "@/model/IdeaList";
import styled from "@/components/main/MainComponent.module.scss";
import CategoryItem from "./CategoryItem";
import CompanyCard from "../common/Card";
import SwiperCore from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

type Props = {};

const MAX_VISIBLE_ITEMS = 15; // 한 페이지에 보여줄 아이템 수

const IdeaList = (props: Props) => {
  const [swiper, setSwiper] = useState<SwiperCore>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setOpen] = useState(false);
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  const [listData, setListData] = useState<IdeaContentsType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const prevButtonRef = useRef<HTMLDivElement>(null);
  const nextButtonRef = useRef<HTMLDivElement>(null);
  const router = useSearchParams();
  const id = router.get("id");
  const nm = router.get("nm");

  // 배너 스와이프 버튼
  const handleActiveIndex = (index: number) => {
    console.log("변경");
    setActiveIndex(index);
  };

  // 렌더 시 실행
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        // 카테고리 아이콘 로딩
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/themes`
        );
        const data = await response.json();
        const firstDataKey = id ? id : data[0].id;
        const firstDataNm = nm ? nm : data[0].name;
        let fetchUrl = "";

        // 새로운 항목 정의
        const newTheme = {
          id: "",
          name: "전체",
          image: "/images/theme_all.png",
          description: "",
          psr_value: 0,
        };
        data.unshift(newTheme);
        setCategoryData(data);

        // 아이디어 리스트 로딩
        if (id) {
          fetchUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/ideation/themes?theme_id=${firstDataKey}&limit=500`;
        } else {
          fetchUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/ideation/themes?limit=500`;
        }

        const themes = await fetch(fetchUrl);
        const themesData = await themes.json();

        let ideaDataList: IdeaContentsType[] = [];
        Object.keys(themesData).map((item, index) => {
          themesData[item].forEach((element: IdeaContentsType) => {
            if (element.close_date) {
              ideaDataList.push(element); // 최종 제출이 된 건만 표시
            }
          });
        });

        // close_date가 최신순으로 정렬
        ideaDataList.sort((a, b) => {
          const dateA = new Date(a.close_date).getTime(); // close_date를 Date 객체로 변환
          const dateB = new Date(b.close_date).getTime();
          return dateB - dateA; // 최신순 정렬
        });

        setListData(ideaDataList);
      } catch (error) {
        console.error("Error fetching category data:", error);
      } finally {
        setLoading(false); // 로딩 완료
      }
    };

    fetchCategoryData();
  }, []);

  // 카테코리 좌우 버튼
  const handleNext = () => {
    if (currentIndex < categoryData.length - MAX_VISIBLE_ITEMS) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // 카테고리 클릭 시 조회
  const searchThemeList = async (data: any) => {
    try {
      var url = "";
      if (data.id) {
        url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/ideation/themes?theme_id=${data.id}&limit=100`;
      } else {
        url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/ideation/themes?limit=1000`;
      }
      const themes = await fetch(url);

      if (!themes.ok) {
        throw new Error("Network response was not ok");
      }

      const themesData = await themes.json();

      let ideaDataList: IdeaContentsType[] = [];
      Object.keys(themesData).map((item, index) => {
        themesData[item].forEach((element: IdeaContentsType) => {
          if (element.close_date) {
            ideaDataList.push(element); // 최종 제출이 된 건만 표시
          }
        });
      });

      // close_date가 최신순으로 정렬
      ideaDataList.sort((a, b) => {
        const dateA = new Date(a.close_date).getTime(); // close_date를 Date 객체로 변환
        const dateB = new Date(b.close_date).getTime();
        return dateB - dateA; // 최신순 정렬
      });

      setListData(ideaDataList);
    } catch (error) {
      console.error("Error fetching themes:", error);
    }
  };

  const swiperData = [
    {
      id: 1,
      title: "홈짐",
      desc: "나만의 PT 선생님",
      adYn: "Y",
      image: "/images/ideaContents_homeGyn.png",
    },
    {
      id: 2,
      title: "마이풋볼러",
      desc: "내 축구선수의 꿈을 이루어주는 트레이닝 코치",
      adYn: "N",
      image: "/images/ideaContents_myfootball.png",
    },
    {
      id: 3,
      title: "R House",
      desc: "무인 로봇이 운영하는 차세대 첨단 숙박시설",
      adYn: "Y",
      image: "/images/ideaContents_rHouse.png",
    },
    {
      id: 1,
      title: "홈짐",
      desc: "나만의 PT 선생님",
      adYn: "Y",
      image: "/images/ideaContents_homeGyn.png",
    },
    {
      id: 2,
      title: "마이풋볼러",
      desc: "내 축구선수의 꿈을 이루어주는 트레이닝 코치",
      adYn: "N",
      image: "/images/ideaContents_myfootball.png",
    },
    {
      id: 3,
      title: "R House",
      desc: "무인 로봇이 운영하는 차세대 첨단 숙박시설",
      adYn: "Y",
      image: "/images/ideaContents_rHouse.png",
    },
  ];

  return (
    <div className={`${styled.wrapper} ${styled.ideaList}`}>
      <div className={styled.swiperWrap}>
        {swiper && (
          <div className={`swiper-navigation-wrap ${styled.swiperNav}`}>
            <div
              ref={prevButtonRef}
              className={`swiper-button-prev ${
                activeIndex === 0 ? "hidden" : ""
              }`}
            ></div>
            <div
              ref={nextButtonRef}
              className={`swiper-button-next ${
                activeIndex === swiper?.slides?.length - 1 ? "hidden" : ""
              }`}
            ></div>
          </div>
        )}
        <Swiper
          className={styled.swiperSlideWrap}
          effect={"coverflow"}
          navigation={{
            prevEl: prevButtonRef.current,
            nextEl: nextButtonRef.current,
          }}
          slidesPerView={2}
          spaceBetween={-300}
          initialSlide={1}
          pagination={true}
          centeredSlides={true}
          loop={true}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 200,
            modifier: 1,
            slideShadows: false,
          }}
          autoplay={{
            delay: 3000, // 3초마다 자동으로 넘기기
            disableOnInteraction: false, // 유저가 슬라이드 넘겨도 autoplay 유지
          }}
          onSwiper={setSwiper}
          onSlideChange={(swiper: any) => handleActiveIndex(swiper.activeIndex)}
          modules={[EffectCoverflow, Navigation, Autoplay]}
        >
          {swiperData.map((item, index) => {
            return (
              <SwiperSlide key={item.id}>
                <div className={styled.swiperItem}>
                  <img
                    className={styled.bg}
                    alt="background"
                    src={item.image}
                  />
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
        {/* << 버튼 */}
        <button
          className={styled.prevButton}
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          {"<"}
        </button>
        <div className={styled.categorySlider}>
          <div className={styled.categoryItems}>
            {categoryData
              .slice(currentIndex, currentIndex + MAX_VISIBLE_ITEMS)
              .map((item, index) => {
                return (
                  <React.Fragment key={item.id}>
                    <CategoryItem
                      data={item}
                      searchThemeList={searchThemeList}
                    />
                  </React.Fragment>
                );
              })}
          </div>
        </div>
        <button
          className={styled.nextButton}
          onClick={handleNext}
          disabled={currentIndex >= categoryData.length - MAX_VISIBLE_ITEMS}
        >
          {">"}
        </button>
      </div>
      <div className={styled.listWrap}>
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
          {listData && listData.length > 0 ? (
            listData.map((item) => (
              <React.Fragment key={item.id}>
                <CompanyCard data={item} type={"idea"} />
              </React.Fragment>
            ))
          ) : (
            <p>데이터가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdeaList;
