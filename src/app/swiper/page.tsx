import Carousel from '@/components/common/Carousel'
import React from 'react'

type Props = {}

const SwiperPage = (props: Props) => {
  const slides = [
    { id: '1', content: <div>Slide 1</div> },
    { id: '2', content: <div>Slide 2</div> },
    { id: '3', content: <div>Slide 3</div> },
    { id: '4', content: <div>Slide 4</div> },
    { id: '5', content: <div>Slide 5</div> },
  ];    
  return (
    <Carousel slides={slides} />
  )
}

export default SwiperPage