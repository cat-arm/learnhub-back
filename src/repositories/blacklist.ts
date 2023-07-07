import { RedisClientType } from "redis";
import jwt from "jsonwebtoken";

import { IRepositoryBlacklist } from ".";

export const keyBlacklist = "todo-jwt-blacklist"; // set
export const keyJwtExpire = "todo-jwt-expirations"; // hash

export function newRepositoryBlacklist(
  db: RedisClientType<any, any, any>
): IRepositoryBlacklist {
  return new RepositoryBlacklist(db);
}

class RepositoryBlacklist {
  private db: RedisClientType<any, any, any>;
  constructor(db: RedisClientType<any, any, any>) {
    this.db = db;
  }

  private async sAdd(token: string): Promise<void> {
    await this.db.sAdd(keyBlacklist, token);
  }

  async addToBlacklist(token: string): Promise<void> {
    const decoded = jwt.decode(token);
    if (!decoded) {
      return this.sAdd(token);
    }
    if (typeof decoded === "string") {
      return this.sAdd(token);
    }
    const exp = decoded.exp;
    if (!exp) {
      return this.sAdd(token);
    }

    await this.sAdd(token);
    await this.db.hSet(keyJwtExpire, token, exp);
  }
  async isBlacklisted(token: string): Promise<boolean> {
    return await this.db.sIsMember(keyBlacklist, token);
  }
}
