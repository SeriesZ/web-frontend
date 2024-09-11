'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperProps, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper as SwiperType } from 'swiper';
import styles from './Carousel.module.scss';

type Props = {}

interface CarouselProps {
  slides: { id: string; content: React.ReactNode }[];
}

const Carousel: React.FC<CarouselProps> = ({ slides }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType>(null);

  const onSlideChange: SwiperProps['onSlideChange'] = (swiper:SwiperType) => {
    setActiveIndex(swiper.activeIndex);
  };

  return (
    <div className={styles.carousel}>
      <Swiper
        modules={[Navigation]}
        slidesPerView={3}
        centeredSlides={true}
        spaceBetween={30}
        navigation={{
          prevEl: `.${styles.prevBtn}`,
          nextEl: `.${styles.nextBtn}`,
        }}
        onSlideChange={onSlideChange}
        className={styles.swiperContainer}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className={styles.slide}>
            {slide.content}
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className={styles.navigationContainer}
        // style={{
        //   position: 'absolute',
        //   top: '50%',
        //   transform: 'translateY(-50%)',
        //   width: '100%',
        //   display: 'flex',
        //   justifyContent: 'space-between',
        //   alignItems: 'center',
        //   maxWidth: '1200px', // 원하는 최대 폭 설정
        //   margin: '0 auto', // 가운데 정렬
        // }}
      >
        <button
          className={`${styles.prevBtn} ${
            activeIndex === 0 ? styles.disabled : ''
          }`}
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-100%)',
            marginLeft: '-30px', // 버튼 크기에 맞춰 조정
          }}          
          onClick={() => swiperRef.current?.slidePrev()}
        >
          Prev
        </button>
        <button
          className={`${styles.nextBtn} ${
            activeIndex >= slides.length - 3 ? styles.disabled : ''
          }`}         
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(100%)',
            marginLeft: '30px', // 버튼 크기에 맞춰 조정
          }}          
          onClick={() => swiperRef.current?.slideNext()}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Carousel