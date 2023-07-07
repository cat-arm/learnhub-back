"use strict";
/*
getcontents
createcontent
getcontentbyid
editusercontentbyid
deleteusercontentbyid
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRepositoryContent = void 0;
function newRepositoryContent(db) {
    return new RepositoryContent(db);
}
exports.newRepositoryContent = newRepositoryContent;
class RepositoryContent {
    constructor(db) {
        this.db = db;
    }
    async getContents() {
        return await this.db.content.findMany();
    }
    async createContent(arg) {
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
    async getContentById(id) {
        return await this.db.content.findUnique({
            where: { id },
        });
    }
    async updateUserContentById(arg) {
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
    async deleteUserContentById(arg) {
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
//# sourceMappingURL=content.js.map