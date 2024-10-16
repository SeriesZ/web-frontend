// src/types/IdeaDataType.ts

export type TeamMemberType = {
    name: string;
    member_img: string;
    member_position: string[];
  };
  
  export type IdeaDataType = {
    id: number;
    title: string;
    div_cd: string;
    desc: string;
    industry: string;
    idea_summery: string;
    idea_detail: string;
    idea_video: string;
    attach_file: string[];
    team_member: TeamMemberType[];
    bookmark_cnt: number;
    views_cnt: number;
    update_dt: string;
    img_url: string; 
    progress_status: string;
    investors_number: string;
    max_investors_number: string;
    raised_amt: string;
    online_meeting_yn: string;
    online_dday: string;
    share_ratio: string;
    par_amt: string;
    min_invest_amt: string;
    max_invest_amt: string;
  };
  