"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRepositoryUser = void 0;
function newRepositoryUser(db) {
    return new RepositoryUser(db);
}
exports.newRepositoryUser = newRepositoryUser;
class RepositoryUser {
    constructor(db) {
        this.db = db;
    }
    async createUser(user) {
        return await this.db.user
            .create({
            data: user,
        })
            .catch((err) => Promise.reject(`failed to create user ${user.username}: ${err}`));
    }
    async getUser(username) {
        return await this.db.user
            .findUnique({
            where: { username },
        })
            .then((user) => {
            if (!user) {
                return Promise.reject(`no such user ${username}`);
            }
            return Promise.resolve(user);
        });
    }
}
//# sourceMappingURL=user.js.map