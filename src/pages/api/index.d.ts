import { IronSession } from 'iron-session';

export type ISession = IronSession & Record<string, any>;

export type IUserInfo = {
  userId?: number | null;
  nickname?: string;
  avatar?: string;
  id?: number;
};

export type IComment = {
  id: number;
  content: string;
  create_time: Date;
  update_time: Date;
};

export type IArticle = {
  id: number;
  title: string;
  content: string;
  views: number;
  create_time: Date;
  update_time: Date;
  user: IUserInfo;
  comments: IComment[];
};
