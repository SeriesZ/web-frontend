"use client";
import React from "react";
import styled from "@/components/main/MainComponent.module.scss";
import { useRouter } from "next/navigation";

type Props = {
  title: string;
  desc: string;
  moveUrl?: string;
  iconHidden?: boolean;
};

const SectionTitle = ({ title, desc, moveUrl, iconHidden }: Props) => {
  const router = useRouter();
  const moveLink = () => {
    if (!moveUrl) return;
    router.push(moveUrl);
  };
  return (
    <div className={styled.sectionTitle}>
      <div className={styled.desc}>{desc}</div>
      <div
        className={`${styled.title} ${iconHidden ? styled.iconHidden : ""}`}
        onClick={moveLink}
      >
        {title}
      </div>
    </div>
  );
};

export default SectionTitle;
