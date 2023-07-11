"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandlerMiddleware = exports.newJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRET || "todo-secretes";
function newJwt(payload) {
    return jsonwebtoken_1.default.sign(payload, secret, {
        algorithm: "HS512",
        expiresIn: "12h",
        issuer: "express-demo",
        subject: "user-login",
        audience: "user",
    });
}
exports.newJwt = newJwt;
class HandlerMiddleware {
    constructor(repoBlacklist) {
        this.repoBlacklist = repoBlacklist;
    }
    async jwtMiddleware(req, res, next) {
        //  confused
        const token = req.header("Authorization")?.replace("Bearer ", "");
        try {
            if (!token) {
                return res.status(401).json({ error: "missing JWT token" }).end();
            }
            const isBlacklisted = await this.repoBlacklist.isBlacklisted(token);
            if (isBlacklisted) {
                return res
                    .status(401)
                    .json({ status: `logged out Please login` })
                    .end();
            }
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            const id = decoded["id"];
            const username = decoded["username"];
            if (!id) {
                return res.status(401).json({ error: "missing payload id" }).end();
            }
            if (!username) {
                return res
                    .status(401)
                    .json({ error: "missing payload username" })
                    .end();
            }
            req.token = token;
            req.payload = {
                id,
                username,
            };
            return next();
        }
        catch (err) {
            console.error(`Auth failed for token ${token}: ${err}`);
            return res.status(401).json({ error: "authentication failed" }).end();
        }
    }
}
exports.HandlerMiddleware = HandlerMiddleware;
//# sourceMappingURL=jwt.js.map