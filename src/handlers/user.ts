import { Response } from "express";

import { hashPassword, compareHash } from "../auth/bcrypt";
import { IRepositoryBlacklist, IRepositoryUser } from "../repositories";
import { AppRequest, Empty, IHandlerUser, WithUser } from ".";
import { JwtAuthRequest, Payload, newJwt } from "../auth/jwt";

export function newHandlerUser(
  repo: IRepositoryUser,
  repoBlacklist: IRepositoryBlacklist
): IHandlerUser {
  return new handlerUser(repo, repoBlacklist);
}

class handlerUser implements IHandlerUser {
  private repo: IRepositoryUser;
  private repoBlacklist: IRepositoryBlacklist;

  constructor(repo: IRepositoryUser, repoBlacklist: IRepositoryBlacklist) {
    this.repo = repo;
    this.repoBlacklist = repoBlacklist;
  }

  async register(
    req: AppRequest<Empty, WithUser>,
    res: Response
  ): Promise<Response> {
    const { username, name, password } = req.body;
    if (!username || !name || !password) {
      return res
        .status(400)
        .json({ error: "missing username or name or password" })
        .end();
    }
    return this.repo
      .createUser({
        username,
        name,
        password: hashPassword(password)
      })
      .then((user) => {
        if (!user) {
          return res
            .status(404)
            .json({ error: `no such user: ${username}` })
            .end();
        }
        return res
          .status(201)
          .json({ ...user, password: undefined })
          .end();
      })
      .catch((err) => {
        const errMsg = `failed to create user ${username}`;
        console.error(`${errMsg}: ${err}`);
        return res.status(500).json({ error: errMsg }).end();
      });
  }

  async login(
    req: AppRequest<Empty, WithUser>,
    res: Response
  ): Promise<Response> {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "missing username or password" })
        .end();
    }

    return this.repo
      .getUser(username)
      .then((user) => {
        if (!compareHash(password, user.password)) {
          return res
            .status(401)
            .json({ error: "invalid username or password" })
            .end();
        }

        const payload: Payload = { id: user.id, username: user.username };
        const token = newJwt(payload);

        return res
          .status(200)
          .json({
            status: "logged in",
            id: user.id,
            username,
            token,
          })
          .end();
      })
      .catch((err) => {
        console.error(`failed to get user: ${err}`);
        return res.status(500).end();
      });
  }

  async logout(
    req: JwtAuthRequest<Empty, Empty>,
    res: Response
  ): Promise<Response> {
    return await this.repoBlacklist
      .addToBlacklist(req.token)
      .then(() =>
        res.status(200).json({ status: `logged out`, token: req.token }).end()
      )
      .catch((err) => {
        return res
          .status(500)
          .json({ error: `could not log out with token ${req.token}` })
          .end();
      });
  }
}
