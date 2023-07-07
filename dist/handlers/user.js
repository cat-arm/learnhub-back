"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newHandlerUser = void 0;
const bcrypt_1 = require("../auth/bcrypt");
const jwt_1 = require("../auth/jwt");
function newHandlerUser(repo, repoBlacklist) {
    return new handlerUser(repo, repoBlacklist);
}
exports.newHandlerUser = newHandlerUser;
class handlerUser {
    constructor(repo, repoBlacklist) {
        this.repo = repo;
        this.repoBlacklist = repoBlacklist;
    }
    async register(req, res) {
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
            password: (0, bcrypt_1.hashPassword)(password)
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
    async login(req, res) {
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
            if (!(0, bcrypt_1.compareHash)(password, user.password)) {
                return res
                    .status(401)
                    .json({ error: "invalid username or password" })
                    .end();
            }
            const payload = { id: user.id, username: user.username };
            const token = (0, jwt_1.newJwt)(payload);
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
    async logout(req, res) {
        return await this.repoBlacklist
            .addToBlacklist(req.token)
            .then(() => res.status(200).json({ status: `logged out`, token: req.token }).end())
            .catch((err) => {
            return res
                .status(500)
                .json({ error: `could not log out with token ${req.token}` })
                .end();
        });
    }
}
//# sourceMappingURL=user.js.map