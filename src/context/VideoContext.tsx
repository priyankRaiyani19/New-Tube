import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {Video, VideoContextType} from "../types/video";
import {useTrendingVideos} from "../hooks/useYouTubeApi";

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [queue, setQueue] = useState<Video[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(-1);
    const [isInitialized, setIsInitialized] = useState(false);

    const [trendingIndex, setTrendingIndex] = useState<number>(0);
    const {
        data: trendingVideos,
        fetchNextPage: fetchTrendingNextPage,
        hasNextPage: hasTrendingNextPage,
        isFetchingNextPage: isFetchingTrendingNextPage
    } = useTrendingVideos();

    useEffect(() => {
        const storedQueue = localStorage.getItem("video-queue");
        const storedSelectedVideo = localStorage.getItem("selected-video");
        const storedIndex = localStorage.getItem("current-index");

        if (storedQueue) {

                const parsedQueue = JSON.parse(storedQueue);
                setQueue(parsedQueue);

        }

        if (storedSelectedVideo) {

                const parsedVideo = JSON.parse(storedSelectedVideo);
                setSelectedVideo(parsedVideo);

        }

        if (storedIndex) {
            const parsedIndex = parseInt(storedIndex, 10);
            if (!isNaN(parsedIndex)) {
                setCurrentIndex(parsedIndex);
            }
        }

        setIsInitialized(true);
    }, []);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("video-queue", JSON.stringify(queue));
        }
    }, [queue, isInitialized]);

    useEffect(() => {
        if (isInitialized) {
            if (selectedVideo) {
                localStorage.setItem("selected-video", JSON.stringify(selectedVideo));
            } else {
                localStorage.removeItem("selected-video");
            }
        }
    }, [selectedVideo, isInitialized]);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("current-index", currentIndex.toString());
        }
    }, [currentIndex, isInitialized]);

    const getVideoId = (video: Video) => video.id;

    const addToQueue = (video: Video) => {
        setQueue((prevQueue) => {
            if (prevQueue.find((v) => getVideoId(v) === getVideoId(video))) {
                return prevQueue;
            }
            return [...prevQueue, video];
        });
    };

    const removeFromQueue = (videoOrId: Video | string) => {
        const videoId = typeof videoOrId === 'string' ? videoOrId : getVideoId(videoOrId);
        const updatedQueue = queue.filter((v) => getVideoId(v) !== videoId);
        setQueue(updatedQueue);
        if (updatedQueue.length === 0) {
            setSelectedVideo(null);
            setCurrentIndex(-1);
        } else if (currentIndex >= updatedQueue.length) {
            setSelectedVideo(null);
            setCurrentIndex(-1);
        }
    };

    const playFromQueue = (video: Video, index: number) => {

        setSelectedVideo(video);
        setCurrentIndex(index);
    };



    const playNext = () => {

        if (currentIndex + 1 < queue.length) {
            const next = queue[currentIndex + 1];
            setSelectedVideo(next);
            setCurrentIndex(currentIndex + 1);
        } else {
            const trendingItems = trendingVideos?.pages.flatMap(page => page.items) || [];
            if (trendingIndex < trendingItems.length) {
                const nextTrending = trendingItems[trendingIndex];
                setSelectedVideo(nextTrending);
                setTrendingIndex(prev => prev + 1);
            } else if (hasTrendingNextPage && !isFetchingTrendingNextPage) {
                fetchTrendingNextPage();
            }
        }
    };

    const playPrevious = () => {
        const isPlayingFromQueue = queue.some(video => video.videoId === selectedVideo?.id);

        if (isPlayingFromQueue) {
            if (currentIndex > 0) {
                const prev = queue[currentIndex - 1];
                setSelectedVideo(prev);
                setCurrentIndex(currentIndex - 1);
            }
        } else {
            const trendingItems = trendingVideos?.pages.flatMap(page => page.items) || [];

            if (trendingIndex - 1 > -1) {
                const prevTrending = trendingItems[trendingIndex - 1];
                setSelectedVideo(prevTrending);
                setTrendingIndex(prev => prev - 1);
            }
        }
    };


    const clearQueue = () => {
        setQueue([]);
        setSelectedVideo(null);
        setCurrentIndex(-1);
        setTrendingIndex(0);

    };

    return (
        <VideoContext.Provider
            value={{
                selectedVideo,
                setSelectedVideo,
                queue,
                setQueue,
                addToQueue,
                removeFromQueue,
                playFromQueue,
                // playFromSearch,
                playNext,
                playPrevious,
                currentIndex,
                clearQueue,
            }}
        >
            {children}
        </VideoContext.Provider>
    );
};

export const useVideo = (): VideoContextType => {
    const context = useContext(VideoContext);
    if (!context) throw new Error("useVideo must be used within a VideoProvider");
    return context;
};
