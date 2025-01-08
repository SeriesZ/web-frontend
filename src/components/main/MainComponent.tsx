import React from "react";
import styled from "@/components/main/MainComponent.module.scss";
import ThemeIdea from "./ThemeIdea";
import CorpList from "./CorpList";
import Magazine from "./Magazine";
import NoticePreview from "./NoticePreview";
import AccountInfo from "./AccountInfo";

type Props = {};

const MainComponent = (props: Props) => {
  return (
    <div className={styled.mainContainer}>
      <ThemeIdea />
      <CorpList />
      <Magazine />
      <NoticePreview />
      <AccountInfo />
    </div>
  );
};

export default MainComponent;
