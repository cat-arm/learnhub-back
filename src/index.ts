/*
getcontents
createcontent
getcontentbyid
editusercontentbyid
deleteusercontentbyid
*/

import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";
import express from "express";

import { newRepositoryUser } from "./repositories/user";
import { newRepositoryContent } from "./repositories/content";
import { newRepositoryBlacklist } from "./repositories/blacklist";

import { newHandlerUser } from "./handlers/user";
import { newHandlerContent } from "./handlers/content";

import { HandlerMiddleware } from "./auth/jwt";

async function main() {
  const db = new PrismaClient();
  const redis = createClient();

  try {
    redis.connect();
    db.$connect();
  } catch (err) {
    console.error(err);
    return;
  }

  const repoUser = newRepositoryUser(db);
  const repoContent = newRepositoryContent(db);
  const repoBlacklist = newRepositoryBlacklist(redis);

  const handlerUser = newHandlerUser(repoUser, repoBlacklist);
  const handlerContent = newHandlerContent(repoContent);

  const handlerMiddleware = new HandlerMiddleware(repoBlacklist);

  const port = process.env.PORt || 8000;
  const server = express();
  const userRouter = express.Router();
  const contentRouter = express.Router();

  server.use(express.json());
  server.use("/user", userRouter);
  server.use("/content", contentRouter);

  // check server status
  // server.get("/", (_, res) => {
  //   return res.status(200).json({ status: "ok" }).end();
  // });

  // User API

  userRouter.post("/register", handlerUser.register.bind(handlerUser));
  userRouter.get("/login", handlerUser.login.bind(handlerUser));
  userRouter.get(
    "/logout",
    handlerMiddleware.jwtMiddleware.bind(handlerMiddleware),
    handlerUser.logout.bind(handlerUser)
  );

  // Content API
  server.get("/", handlerContent.getContents.bind(handlerContent));
  server.post(
    "/new",
    handlerMiddleware.jwtMiddleware.bind(handlerMiddleware),
    handlerContent.createContent.bind(handlerContent)
  );

  contentRouter.get("/:id", handlerContent.getContentById.bind(handlerContent));
  contentRouter.patch(
    "/:id/edit",
    handlerMiddleware.jwtMiddleware.bind(handlerMiddleware),
    handlerContent.updateUserContentById.bind(handlerContent)
  );
  contentRouter.delete(
    "/:id",
    handlerMiddleware.jwtMiddleware.bind(handlerMiddleware),
    handlerContent.deleteUserContentById.bind(handlerContent)
  );

  server.listen(port, () => console.log(`server listener on ${port}`));
}

main();
