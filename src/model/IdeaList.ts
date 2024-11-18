


export  type Category = {
  id: string;
  name: string;
  image: string;
  description: string;
};

export  type IdeaContents = {
  id: "string";
  title: "string";
  content: "string";
  image: "string";
  theme: {
    id: "string";
    name: "string";
    image: "string";
    description: "string";
  };
  presentation_date: "2024-10-21T13:40:39.048Z";
  close_date: "2024-10-21T13:40:39.048Z";
  status: "string";
  view_count: 0;
  investment_goal: 0;
  investments: [
    {
      ideation_id: "string";
      investor: {
        name: "string";
        description: "string";
        image: "string";
        assets_under_management: "string";
        investment_count: 0;
      };
      amount: 0;
      approval_status: true;
    }
  ];
  attachments: [
    {
      id: "string";
      related_id: "string";
      file_name: "string";
      file_path: "string";
    }
  ];
  comments: [
    {
      id: "string";
      related_id: "string";
      content: "string";
      rating: 0;
      user: {
        id: "string";
        email: "string";
        name: "string";
        role: "string";
        group_id: "string";
      };
    }
  ];
};