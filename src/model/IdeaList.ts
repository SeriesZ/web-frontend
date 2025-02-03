


export  type Category = {
  id: string;
  name: string;
  image: string;
  description: string;
  psr_value?: number;
};

export type IdeaContentsType = {
  no:number;
  id: string;
  title: string;
  content: string;
  theme: {
    id: string;
    name: string;
    image: string;
    description: string;
    psr_value:number;
  };
  presentation_url: string;
  presentation_date: string;
  close_date: string;
  status: string;
  view_count: number;
  investment_goal: number;
  investments: {
    ideation_id: string;
    investor: {
      name: string;
      description: string;
      image: string;
      assets_under_management: string;
      investment_count: number;
    };
    amount: number;
    approval_status: boolean;
  }[];
  images: {
    id: string;
    related_id: string;
    file_name: string;
    file_path: string;
  }[];
  attachments: {
    id: string;
    related_id: string;
    file_name: string;
    file_path: string;
  }[];
  comments: {
    id: string;
    related_id: string;
    content: string;
    rating: number;
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      group_id: string;
    };
  }[];
};

export const initializeIdeaContents = (): IdeaContentsType => {
  return {
    no:0,
    id: "",
    title: "",
    content: "",
    theme: {
      id: "",
      name: "",
      image: "",
      description: "",
      psr_value: 0
    },
    presentation_url:"",
    presentation_date: new Date().toISOString(),
    close_date: new Date().toISOString(),
    status: "",
    view_count: 0,
    investment_goal: 0,
    investments: [
      {
        ideation_id: "",
        investor: {
          name: "",
          description: "",
          image: "",
          assets_under_management: "",
          investment_count: 0,
        },
        amount: 0,
        approval_status: false,
      },
    ],
    images: [
    ],
    attachments: [
    ],
    comments: [
      {
        id: "",
        related_id: "",
        content: "",
        rating: 0,
        user: {
          id: "",
          email: "",
          name: "",
          role: "",
          group_id: "",
        },
      },
    ],
  };
};

export type TeamMemberType = {
  name: string;
  member_img: string;
  member_position: string[];
};

export interface Attachment {
  id: string;
  related_id: string;
  file_name: string;
  file_path: string;
}