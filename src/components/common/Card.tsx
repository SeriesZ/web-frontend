import React from "react";
import styled from "@/components/common/Card.module.scss";

type Props = {
  data: any;
  type?: string;
};
// 나중에 Props 그냥 data로 받아서 뿌려야함. type만 따로 받아서 하단 상세 정보 유무 파악
const CompanyCard = ({ data, type }: Props) => {
  const SubInfo = () => {
    if (!type) {
      return <></>;
    } else {
      if (type === "idea") {
        return (
          <div className={styled.bottom}>
            <div className={styled.row}>
              <div className={styled.info}>
                D-<span>{data?.dday}</span>
              </div>
              <div className={styled.info}>
                투자 라운드 마감 <span>{data?.dueDt}</span>
              </div>
            </div>
            <div className={styled.row}>
              <div className={styled.info}>
                조회수 <span>{data?.hits}</span>
              </div>
              <div className={styled.info}>
                달성율 <span>{data?.rate}</span>
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
    <div className={styled.companyCard}>
      <div className={styled.thumbWrap}></div>
      <div className={styled.infoWrap}>
        <div className={`${styled.top} ${!type ? styled.notype : ""}`}>
          <div className={styled.title}>{data?.title}</div>
          <div className={styled.desc}>{data?.desc}</div>
        </div>
        <SubInfo />
      </div>
    </div>
  );
};

export default CompanyCard;
