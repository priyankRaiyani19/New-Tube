import React from "react";

export interface VideoThumbnail {
    url: string;
    width: number;
    height: number;
}

export interface Video {
    id: string | { videoId: string }
    title: string
    url: string
}


export interface VideoApiProps {
    pageParam?: string
    videoCategoryId?: string
}


export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ReactNode;
}

export interface VideoCategorySliderProps {
    onCategoryClick: (category: string) => void
}

export interface ErrorStateProps {
    error?: unknown,
    onRetry?: () => void,
    message?: string,

}

export interface NavbarProps {
    onSearch: (query: string) => void;
}

export interface VideoContextType {
    selectedVideo: Video | null
    setSelectedVideo: (video: Video | null) => void
    queue: Video[]
    addToQueue: (video: Video) => void
    removeFromQueue: (videoId: string) => void
    // saveForLater: (video: Video) => void
    // savedVideos: Video[]
    playFromQueue: (video: Video, index: number) => void
    playNext: () => void
    setQueue: (queue: Video[]) => void
    playPrevious: () => void
    currentIndex: number,
    clearQueue: () => void,
}

export interface VideoGridProps {
    title: string;
    videos: Video[] | undefined;
    isLoading: boolean;
    isError: boolean;
    error: unknown;
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
    dislikeCount: string;
    commentCount: string;

}

export interface Video {
    kind: string;
    etag: string;
    id: string | { videoId: string }
    snippet: VideoSnippet;
    statistics: VideoStatistics;
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
