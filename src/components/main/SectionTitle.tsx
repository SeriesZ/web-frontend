"use client";
import React from "react";
import styled from "@/components/main/MainComponent.module.scss";
import { useRouter } from "next/navigation";

type Props = {
  title: string;
  desc: string;
  moveUrl?: string;
};

const SectionTitle = ({ title, desc, moveUrl }: Props) => {
  const router = useRouter();
  const moveLink = () => {
    if (!moveUrl) return;
    router.push(moveUrl);
  };
  return (
    <div className={styled.sectionTitle}>
      <div className={styled.desc}>{desc}</div>
      <div className={styled.title} onClick={moveLink}>
        {title}
      </div>
    </div>
  );
};

export default SectionTitle;
