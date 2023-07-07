"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideoDetails = void 0;
// Use [OEmbed](https://oembed.com/)
// to get video metadata (from NoEmbed.com)
async function getVideoDetails(videoUrl) {
    return await fetch(`https://noembed.com/embed?url=${videoUrl}`)
        .then(async (res) => {
        const { title, url, thumbnail_url, author_name, author_url, error: err, } = await res.json();
        if (!title || !url) {
            return Promise.reject(`failed to get title and url for content: ${videoUrl}`);
        }
        if (err)
            return Promise.reject(err);
        return {
            videoTitle: title,
            videoUrl: url,
            thumbnailUrl: thumbnail_url ??
                "https://placehold.jp/38/fab005/ffffff/480x360.png?text=No+Preview+Available",
            creatorName: author_name ?? "",
            creatorUrl: author_url ?? "",
        };
    })
        .catch((err) => Promise.reject(err));
}
exports.getVideoDetails = getVideoDetails;
//# sourceMappingURL=oembed.js.map