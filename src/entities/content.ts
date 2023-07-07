import { IUserDto } from "./user";

export interface ICreateContentDto {
  videoUrl: string;
  comment: string;
  rating: number;
}

export interface ICreateContent extends ICreateContentDto {
  videoTitle: string;
  thumbnailUrl: string;
  creatorName: string;
  creatorUrl: string;

  // The original code embeds more user data here,
  // but I think we only need user ID.
  ownerId: string;
}

export interface IContent extends ICreateContent {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IContentWithUser extends IContent {
  user: IUserDto;
}
