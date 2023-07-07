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
        this.includePostedBy = {
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
        };
        this.db = db;
    }
    async getContents() {
        return await this.db.content.findMany({
            include: this.includePostedBy,
        });
    }
    async createContent(arg) {
        return await this.db.content.create({
            include: this.includePostedBy,
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
            include: this.includePostedBy,
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
            include: this.includePostedBy,
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
            include: this.includePostedBy,
        });
    }
}
//# sourceMappingURL=content.js.map