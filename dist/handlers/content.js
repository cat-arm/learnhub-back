"use strict";
/*
getcontents
createcontent
getcontentbyid
editusercontentbyid
deleteusercontentbyid
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.newHandlerContent = void 0;
const oembed_1 = require("../service/oembed");
function newHandlerContent(repo) {
    return new HandlerContent(repo);
}
exports.newHandlerContent = newHandlerContent;
class HandlerContent {
    constructor(repo) {
        this.repo = repo;
    }
    async getContents(req, res) {
        return this.repo
            .getContents()
            .then((contents) => res.status(200).json(contents).end())
            .catch((err) => {
            console.error(`failed to create todo: ${err}`);
            return res.status(500).json({ error: `failed to get todos` }).end();
        });
    }
    async createContent(req, res) {
        const createContent = req.body;
        if (!createContent.videoUrl) {
            return res.status(400).json({ error: "missing videoUrl in body" }).end();
        }
        const details = await (0, oembed_1.getVideoDetails)(createContent.videoUrl);
        const ownerId = req.payload.id;
        return await this.repo
            .createContent({ ...details, ...createContent, ownerId })
            .then((content) => res.status(201).json(content).end())
            .catch((err) => {
            const errMsg = "failed to create content";
            console.error(`${errMsg}: ${err}`);
            return res
                .status(500)
                .json({ error: `${errMsg}` })
                .end();
        });
    }
    async getContentById(req, res) {
        if (!req.params.id) {
            return res.status(400).json({ error: "missing id in params" }).end();
        }
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res
                .status(400)
                .json({ error: `id ${req.params.id} is not a number` });
        }
        try {
            const content = await this.repo.getContentById(id);
            if (!content) {
                return res
                    .status(404)
                    .json({ error: `no such content: ${id}` })
                    .end();
            }
            return res.status(200).json(content).end();
        }
        catch (err) {
            const errMsg = `failed to get todo ${id}`;
            console.error(`${errMsg}: ${err}`);
            return res.status(500).json({ error: errMsg }).end();
        }
    }
    async updateUserContentById(req, res) {
        if (!req.params.id) {
            return res.status(400).json({ error: "missing id in params" }).end();
        }
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res
                .status(400)
                .json({ error: `id ${req.params.id} is not a number` });
        }
        //  Use undefined to skip field when updating
        let rating = req.body.rating;
        let comment = req.body.comment;
        if (!comment || comment === "") {
            comment = undefined;
        }
        return this.repo
            .updateUserContentById({ id, ownerId: req.payload.id, comment, rating })
            .then((updated) => res.status(201).json(updated).end())
            .catch((err) => {
            const errMsg = `failed to update content ${id}: ${err}`;
            console.error(errMsg);
            return res.status(500).json({ error: errMsg }).end();
        });
    }
    async deleteUserContentById(req, res) {
        if (!req.params.id) {
            return res.status(400).json({ error: "missing id in params" }).end();
        }
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res
                .status(400)
                .json({ error: `id ${req.params.id} is not a number` });
        }
        return this.repo
            .deleteUserContentById({ id, ownerId: req.payload.id })
            .then((deleted) => res.status(201).json(deleted).end())
            .catch((err) => {
            const errMsg = `failed to delete content ${id}: ${err}`;
            console.error(errMsg);
            return res.status(500).json({ error: errMsg }).end();
        });
    }
}
//# sourceMappingURL=content.js.map