"use strict";
/*
getcontents
createcontent
getcontentbyid
editusercontentbyid
deleteusercontentbyid
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const redis_1 = require("redis");
const express_1 = __importDefault(require("express"));
const user_1 = require("./repositories/user");
const content_1 = require("./repositories/content");
const blacklist_1 = require("./repositories/blacklist");
const user_2 = require("./handlers/user");
const content_2 = require("./handlers/content");
const jwt_1 = require("./auth/jwt");
async function main() {
    const db = new client_1.PrismaClient();
    const redis = (0, redis_1.createClient)();
    try {
        redis.connect();
        db.$connect();
    }
    catch (err) {
        console.error(err);
        return;
    }
    const repoUser = (0, user_1.newRepositoryUser)(db);
    const repoContent = (0, content_1.newRepositoryContent)(db);
    const repoBlacklist = (0, blacklist_1.newRepositoryBlacklist)(redis);
    const handlerUser = (0, user_2.newHandlerUser)(repoUser, repoBlacklist);
    const handlerContent = (0, content_2.newHandlerContent)(repoContent);
    const handlerMiddleware = new jwt_1.HandlerMiddleware(repoBlacklist);
    const port = process.env.PORt || 8000;
    const server = (0, express_1.default)();
    const userRouter = express_1.default.Router();
    const contentRouter = express_1.default.Router();
    server.use(express_1.default.json());
    server.use("/user", userRouter);
    server.use("/content", contentRouter);
    // check server status
    // server.get("/", (_, res) => {
    //   return res.status(200).json({ status: "ok" }).end();
    // });
    // User API
    userRouter.post("/register", handlerUser.register.bind(handlerUser));
    userRouter.get("/login", handlerUser.login.bind(handlerUser));
    userRouter.get("/logout", handlerMiddleware.jwtMiddleware.bind(handlerMiddleware), handlerUser.logout.bind(handlerUser));
    // Content API
    server.get("/", handlerContent.getContents.bind(handlerContent));
    server.post("/new", handlerMiddleware.jwtMiddleware.bind(handlerMiddleware), handlerContent.createContent.bind(handlerContent));
    contentRouter.get("/:id", handlerContent.getContentById.bind(handlerContent));
    contentRouter.patch("/:id/edit", handlerMiddleware.jwtMiddleware.bind(handlerMiddleware), handlerContent.updateUserContentById.bind(handlerContent));
    contentRouter.delete("/:id", handlerMiddleware.jwtMiddleware.bind(handlerMiddleware), handlerContent.deleteUserContentById.bind(handlerContent));
    server.listen(port, () => console.log(`server listener on ${port}`));
}
main();
//# sourceMappingURL=index.js.map