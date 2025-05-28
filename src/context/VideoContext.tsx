import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {Video, VideoContextType} from "../types/video.ts";

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [queue, setQueue] = useState<Video[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(-1);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const storedQueue = localStorage.getItem("video-queue");
        const storedSelectedVideo = localStorage.getItem("selected-video");
        const storedIndex = localStorage.getItem("current-index");

        if (storedQueue) {
            try {
                const parsedQueue = JSON.parse(storedQueue);
                setQueue(parsedQueue);
            } catch (error) {
                console.error("Error parsing stored queue:", error);
            }
        }

        if (storedSelectedVideo) {
            try {
                const parsedVideo = JSON.parse(storedSelectedVideo);
                setSelectedVideo(parsedVideo);
            } catch (error) {
                console.error("Error parsing stored selected video:", error);
            }
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

        setQueue((prevQueue) => {
            const updatedQueue = prevQueue.filter((v) => getVideoId(v) !== videoId);
            return updatedQueue;
        });

        setCurrentIndex((prevIndex) => {
            const newQueue = queue.filter((v) => getVideoId(v) !== videoId);

            if (newQueue.length === 0) {
                setSelectedVideo(null);
                return -1;
            }

            if (prevIndex >= newQueue.length) {
                setSelectedVideo(null);
                return -1;
            }

            return prevIndex;
        });
    };

    const playFromQueue = (video: Video, index: number) => {
        if (index >= 0 && index < queue.length) {
            setSelectedVideo(video);
            setCurrentIndex(index);
        }
    };

    const playNext = () => {
        if (currentIndex + 1 < queue.length) {
            const next = queue[currentIndex + 1];
            setSelectedVideo(next);
            setCurrentIndex(currentIndex + 1);
        }
    };

    const playPrevious = () => {
        if (currentIndex - 1 >= 0) {
            const prev = queue[currentIndex - 1];
            setSelectedVideo(prev);
            setCurrentIndex(currentIndex - 1);
        }
    };

    const clearQueue = () => {
        setQueue([]);
        setSelectedVideo(null);
        setCurrentIndex(-1);
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