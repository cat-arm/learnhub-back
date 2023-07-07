/*
getcontents
createcontent
getcontentbyid
editusercontentbyid
deleteusercontentbyid
*/

import { PrismaClient } from "@prisma/client";
import { IContent, ICreateContent } from "../entities/content";

export function newRepositoryContent(db: PrismaClient) {
  return new RepositoryContent(db);
}

class RepositoryContent {
  private db: PrismaClient;
  constructor(db: PrismaClient) {
    this.db = db;
  }

  async getContents(): Promise<IContent[]> {
    return await this.db.content.findMany();
  }

  async createContent(arg: ICreateContent): Promise<IContent> {
    return await this.db.content.create({
      include: {
        postedBy: {
          select: {
            id: true,
            username: true,
            name: true,
            registeredAt: true,
            updateAt: true,
            contents: true,
            password: false,
          },
        },
      },
      data: {
        ...arg,
        ownerId: undefined,
        postedBy: {
          connect: {
            id: arg.ownerId,
          },
        },
      },
    });
  }

  async getContentById(id: number): Promise<IContent | null> {
    return await this.db.content.findUnique({
      where: { id },
    });
  }

  async updateUserContentById(arg: {
    id: number;
    ownerId: string;
    comment: string | undefined;
    rating: number | undefined;
  }): Promise<IContent> {
    const content = await this.db.content.findUnique({
      where: { id: arg.id },
    });
    if (!content) {
      return Promise.reject(`no such content ${arg.id}`);
    }

    if (content.ownerId !== arg.ownerId) {
      return Promise.reject(`bad ownerId: ${arg.ownerId}`);
    }

    return await this.db.content.update({
      where: { id: arg.id },
      data: {
        comment: arg.comment,
        rating: arg.rating,
      },
    });
  }

  async deleteUserContentById(arg: {
    id: number;
    ownerId: string;
  }): Promise<IContent> {
    const content = await this.db.content.findUnique({
      where: { id: arg.id },
    });
    if (!content) {
      return Promise.reject(`no such content ${arg.id}`);
    }

    if (content.ownerId !== arg.ownerId) {
      return Promise.reject(`bad ownerId: ${arg.ownerId}`);
    }

    return await this.db.content.delete({
      where: { id: arg.id },
    });
  }
}
