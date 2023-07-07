import { IContent, ICreateContent } from "../entities/content";
import { ICreateUser, IUser } from "../entities/user";

export interface IRepositoryUser {
  createUser(user: ICreateUser): Promise<IUser>;
  getUser(username: string): Promise<IUser>;
}

export interface IRepositoryContent {
  getContents(): Promise<IContent[]>;
  createContent(arg: ICreateContent): Promise<IContent>;
  getContentById(id: number): Promise<IContent | null>;
  updateUserContentById(arg: {
    id: number;
    ownerId: string;
    comment: string | undefined;
    rating: number | undefined;
  }): Promise<IContent>;
  deleteUserContentById(arg: {
    id: number;
    ownerId: string;
  }): Promise<IContent>;
}

export interface IRepositoryBlacklist {
  addToBlacklist(token: string): Promise<void>;
  isBlacklisted(token: string): Promise<boolean>;
}
