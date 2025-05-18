export interface VideoThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface VideoSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: {
    default: VideoThumbnail;
    medium: VideoThumbnail;
    high: VideoThumbnail;
    standard?: VideoThumbnail;
    maxres?: VideoThumbnail;
  };
  channelTitle: string;
  tags?: string[];
  categoryId?: string;
}

export interface VideoStatistics {
  viewCount: string;
  likeCount: string;
  favoriteCount: string;
  commentCount: string;
}

export interface Video {
  kind: string;
  etag: string;
  id: string | { kind: string; videoId: string };
  snippet: VideoSnippet;
  statistics?: VideoStatistics;
}

export interface YouTubeSearchResponse {
  kind: string;
  etag: string;
  items: Video[];
  nextPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}