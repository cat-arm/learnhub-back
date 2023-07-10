/*
getcontents
createcontent
getcontentbyid
editusercontentbyid
deleteusercontentbyid
*/

import { Response } from "express";

import { IRepositoryContent } from "../repositories";
import { Empty, IHandlerContent, WithCommentAndRating, WithId } from ".";

import { ICreateContentDto } from "../entities/content";
import { getVideoDetails } from "../service/oembed";
import { JwtAuthRequest } from "../auth/jwt";

export function newHandlerContent(repo: IRepositoryContent): IHandlerContent {
  return new HandlerContent(repo);
}

class HandlerContent implements IHandlerContent {
  private repo: IRepositoryContent;

  constructor(repo: IRepositoryContent) {
    this.repo = repo;
  }

  async getContents(
    req: JwtAuthRequest<Empty, Empty>,
    res: Response
  ): Promise<Response> {
    // not sure
    return this.repo
      .getContents()
      .then((contents) => res.status(200).json({data: contents}).end())
      .catch((err) => {
        console.error(`failed to create todo: ${err}`);
        return res.status(500).json({ error: `failed to get todos` }).end();
      });
  }

  async createContent(
    req: JwtAuthRequest<Empty, ICreateContentDto>,
    res: Response
  ): Promise<Response> {
    const createContent: ICreateContentDto = req.body;
    if (!createContent.videoUrl) {
      return res.status(400).json({ error: "missing videoUrl in body" }).end();
    }
    const details = await getVideoDetails(createContent.videoUrl);
    const ownerId = req.payload.id;
    return await this.repo
      .createContent({ ...details, ...createContent, ownerId })
      .then((content) => res.status(201).json(content).end())
      .catch((err) => {
        const errMsg = "failed to create content";
        console.error(`${errMsg}: ${err}`);
        return res
          .status(500)
          .json({ error: `${errMsg}` })
          .end();
      });
  }

  async getContentById(
    req: JwtAuthRequest<WithId, Empty>,
    res: Response
  ): Promise<Response> {
    if (!req.params.id) {
      return res.status(400).json({ error: "missing id in params" }).end();
    }
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: `id ${req.params.id} is not a number` });
    }

    try {
      const content = await this.repo.getContentById(id);
      if (!content) {
        return res
          .status(404)
          .json({ error: `no such content: ${id}` })
          .end();
      }

      return res.status(200).json(content).end();
    } catch (err) {
      const errMsg = `failed to get todo ${id}`;
      console.error(`${errMsg}: ${err}`);
      return res.status(500).json({ error: errMsg }).end();
    }
  }

  async updateUserContentById(
    req: JwtAuthRequest<WithId, WithCommentAndRating>,
    res: Response
  ): Promise<Response> {
    if (!req.params.id) {
      return res.status(400).json({ error: "missing id in params" }).end();
    }
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: `id ${req.params.id} is not a number` });
    }
    //  Use undefined to skip field when updating
    let rating: number | undefined = req.body.rating;
    let comment: string | undefined = req.body.comment;
    if (!comment || comment === "") {
      comment = undefined;
    }

    return this.repo
      .updateUserContentById({ id, ownerId: req.payload.id, comment, rating })
      .then((updated) => res.status(201).json(updated).end())
      .catch((err) => {
        const errMsg = `failed to update content ${id}: ${err}`;
        console.error(errMsg);
        return res.status(500).json({ error: errMsg }).end();
      });
  }

  async deleteUserContentById(
    req: JwtAuthRequest<WithId, WithId>,
    res: Response
  ): Promise<Response> {
    if (!req.params.id) {
      return res.status(400).json({ error: "missing id in params" }).end();
    }

    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: `id ${req.params.id} is not a number` });
    }

    return this.repo
      .deleteUserContentById({ id, ownerId: req.payload.id })
      .then((deleted) => res.status(201).json(deleted).end())
      .catch((err) => {
        const errMsg = `failed to delete content ${id}: ${err}`;
        console.error(errMsg);
        return res.status(500).json({ error: errMsg }).end();
      });
  }
}
