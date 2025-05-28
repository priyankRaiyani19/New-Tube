import React, {createContext, ReactNode, useContext, useState} from "react";
import {Video, VideoContextType} from "../types/video.ts";

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [queue, setQueue] = useState<Video[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(-1);

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
            const updatedQueue = prevQueue.filter((v) => getVideoId(v) !== videoId)

            if (updatedQueue.length === 0 || currentIndex >= updatedQueue.length) {
                setSelectedVideo(null)
                setCurrentIndex(-1)
            }

            return updatedQueue
        })
    }

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
