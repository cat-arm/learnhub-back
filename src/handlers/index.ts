import { Request, Response } from "express";
import { JwtAuthRequest } from "../auth/jwt";
import { ICreateContentDto } from "../entities/content";

// Custom Express `Request` (no Query)
export interface AppRequest<Params, Body> extends Request<Params, any, Body> {}

export interface Empty {}

export interface WithId {
  id: string;
}

export interface WithCreateContent {}

export interface WithCommentAndRating {
  ownerId: string;
  comment: string;
  rating: number;
}

export interface WithUser {
  username: string;
  password: string;
  name: string;
  registeredAt: Date;
}

export interface IHandlerContent {
  getContents(
    req: JwtAuthRequest<Empty, Empty>,
    res: Response
  ): Promise<Response>;
  createContent(
    req: JwtAuthRequest<Empty, ICreateContentDto>,
    res: Response
  ): Promise<Response>;
  getContentById(
    req: JwtAuthRequest<WithId, Empty>,
    res: Response
  ): Promise<Response>;
  updateUserContentById(
    req: JwtAuthRequest<WithId, WithCommentAndRating>,
    res: Response
  ): Promise<Response>;
  deleteUserContentById(
    req: JwtAuthRequest<WithId, WithId>,
    res: Response
  ): Promise<Response>;
}

export interface IHandlerUser {
  register(req: AppRequest<Empty, WithUser>, res: Response): Promise<Response>;
  login(req: AppRequest<Empty, WithUser>, res: Response): Promise<Response>;
  logout(req: JwtAuthRequest<Empty, Empty>, res: Response): Promise<Response>;
}
