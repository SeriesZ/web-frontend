"use client";
import React from "react";
import styled from "@/components/common/Card.module.scss";
import userStore from "@/store/userLoginInfo";
import { useRouter } from "next/navigation";

type Props = {
  data: any;
  type?: string;
};

const CompanyCard = ({ data, type }: Props) => {
  const { userInfo } = userStore();
  const router = useRouter();
  const moveIdeaContents = (id: String) => {
    if (userInfo.bearer == "xxxx")
      return alert("해당 내용을 열람하시려면 로그인을 해주세요.");
    router.push(`/idea/ideaContents?id=${id}`);
  };

  const stripHtmlTags = (html: string) => {
    if (!html) return "";
    return html.replace(/<\/?[^>]+(>|$)/g, ""); // 정규식을 사용하여 태그 제거
  };
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return dateString.split("T")[0]; // "T"를 기준으로 문자열을 분리하여 날짜 부분만 반환
  };
  const calculateDday = (targetDateString: string) => {
    if (!targetDateString) {
      return "0";
    }
    const targetDate = new Date(formatDate(targetDateString));
    const currentDate = new Date();
    // 시간 차이를 계산하고 일 단위로 변환
    const timeDifference = targetDate.getTime() - currentDate.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return daysDifference >= 0
      ? `${daysDifference}`
      : `${Math.abs(daysDifference)}`;
  };

  const SubInfo = () => {
    if (!type) {
      return <></>;
    } else {
      if (type === "idea") {
        return (
          <div className={styled.bottom}>
            <div className={styled.row}>
              <div className={`${styled.info}`}>
                D-<span>{calculateDday(data?.close_date)}</span>
              </div>
              <div className={styled.info}>
                투자 라운드 마감 <span>{formatDate(data?.close_date)}</span>
              </div>
            </div>
            <div className={styled.row}>
              <div className={styled.info}>
                조회수 <span>{data?.view_count}</span>
              </div>
              <div className={styled.info}>
                달성율 <span>{data?.investment_goal}</span>
              </div>
            </div>
          </div>
        );
      } else if (type === "corp") {
        return (
          <div className={styled.bottom}>
            <div className={styled.row}>
              <div className={styled.info}>
                운용 펀드금액 <span>{data?.amount}</span>
              </div>
            </div>
            <div className={styled.row}>
              <div className={styled.info}>
                시리즈제로 투자 건수 <span>{`${data?.cnt}회`}</span>
              </div>
            </div>
          </div>
        );
      }
    }
  };
  return (
    <div
      className={`${
        type === "magz" ? styled.magazineCard : styled.companyCard
      }`}
      onClick={() => moveIdeaContents(data.id)}
    >
      <div className={styled.thumbWrap}>
        <img
          className={styled.img}
          src={data.images[0] ? data.images[0].file_path : ""}
        />
      </div>
      <div className={styled.infoWrap}>
        <div className={`${styled.top} ${!type ? styled.notype : ""}`}>
          <div className={styled.title}>{data?.title}</div>
          <div className={styled.desc}>{stripHtmlTags(data.content)}</div>
        </div>
        <SubInfo />
      </div>
    </div>
  );
};

export default CompanyCard;
