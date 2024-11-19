


export  type Category = {
  id: string;
  name: string;
  image: string;
  description: string;
  psr?: '3'
};

export  type IdeaContentsType ={
  "id": "string",
  "title": "string",
  "content": "string",
  "theme": {
    "id": "string",
    "name": "string",
    "image": "string",
    "description": "string"
  },
  "presentation_date": "2024-11-13T02:23:29.042Z",
  "close_date": "2024-11-13T02:23:29.042Z",
  "status": "string",
  "view_count": 0,
  "investment_goal": 0,
  "investments": [
    {
      "ideation_id": "string",
      "investor": {
        "name": "string",
        "description": "string",
        "image": "string",
        "assets_under_management": "string",
        "investment_count": 0
      },
      "amount": 0,
      "approval_status": true
    }
  ],
  "images": [
    {
      "id": "string",
      "related_id": "string",
      "file_name": "string",
      "file_path": "string"
    }
  ],
  "attachments": [
    {
      "id": "string",
      "related_id": "string",
      "file_name": "string",
      "file_path": "string"
    }
  ],
  "comments": [
    {
      "id": "string",
      "related_id": "string",
      "content": "string",
      "rating": 0,
      "user": {
        "id": "string",
        "email": "string",
        "name": "string",
        "role": "string",
        "group_id": "string"
      }
    }
  ]
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