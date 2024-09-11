import React from "react";
import styled from "@/components/main/Main.module.scss";
import MainComponent from "./MainComponent";
import IdeaList from "./IdeaList";
import MainSwiper from "./MainSwiper";

type Props = {};

const MainPageComponent = (props: Props) => {
  return (
    <>
      <MainSwiper />
      <MainComponent />
    </>
  );
};

export default MainPageComponent;
