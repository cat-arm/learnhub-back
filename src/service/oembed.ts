export interface IOEmbedResponseDto {
  url: string;
  error: string;
  thumbnail_height: number;
  version: string;
  width: number;
  thumbnail_width: number;
  provider_name: string;
  thumbnail_url: string;
  author_url: string;
  author_name: string;
  title: string;
  type: string;
  height: number;
  provider_url: string;
  html: string;
}

interface IOEmbedDetails {
  videoTitle: string;
  videoUrl: string;
  thumbnailUrl: string;
  creatorName: string;
  creatorUrl: string;
}

// Use [OEmbed](https://oembed.com/)
// to get video metadata (from NoEmbed.com)
export async function getVideoDetails(
  videoUrl: string
): Promise<IOEmbedDetails> {
  return await fetch(`https://noembed.com/embed?url=${videoUrl}`)
    .then(async (res) => {
      const {
        title,
        url,
        thumbnail_url,
        author_name,
        author_url,
        error: err,
      } = await res.json();

      if (!title || !url) {
        return Promise.reject(
          `failed to get title and url for content: ${videoUrl}`
        );
      }

      if (err) return Promise.reject(err);

      return {
        videoTitle: title,
        videoUrl: url,
        thumbnailUrl:
          thumbnail_url ??
          "https://placehold.jp/38/fab005/ffffff/480x360.png?text=No+Preview+Available",
        creatorName: author_name ?? "",
        creatorUrl: author_url ?? "",
      };
    })
    .catch((err) => Promise.reject(err));
}
