'use client'
import React, { useEffect, useState } from 'react'
import styled from '@/components/idea/Idea.module.scss';
import RegisterComponents from './RegisterComponents';
type Props = {}

const Register = (props: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const handleActiveIndex = (index:number) => {
    setActiveIndex(index);
  }
  return (
    <div className={styled.mainContainer}>
      <div className={styled.headerWrap}>
        <div className={styled.titleWrap}>
          <div className={styled.title}>아이디어 제안</div>
          <div className={styled.desc}>투자자에게 아이디어를 인지시키기 위해서는<br/>아이디어의 내용을 간결하고 명확하게 표현하여 이해시켜야 합니다.</div>
        </div>
        <div className={styled.stepWrap}>
          <div className={activeIndex === 0 ? styled.active : ''} onClick={() => handleActiveIndex(0)}>아이디어 입력</div>
          <div className={activeIndex === 1 ? styled.active : ''} onClick={() => handleActiveIndex(1)}>상품가격결정/매출계획수립</div>
          <div className={activeIndex === 2 ? styled.active : ''} onClick={() => handleActiveIndex(2)}>기업가치평가/투자목표 설정</div>
          <div className={activeIndex === 3 ? styled.active : ''} onClick={() => handleActiveIndex(3)}>최종 수정 및 업로드</div>
        </div>
      </div>
      <RegisterComponents activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
    </div>
  )
}

export default Register