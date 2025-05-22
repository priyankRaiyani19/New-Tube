import React, {createContext, ReactNode, useContext, useState} from "react";
import {Video, VideoContextType} from "../types/video.ts";

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider: React.FC<{ children: ReactNode }> = ({
                                                                     children,
                                                                 }) => {
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [queue, setQueue] = useState<Video[]>([]);
    // const [savedVideos, setSavedVideos] = useState<Video[]>([])
    const [currentIndex, setCurrentIndex] = useState<number>(-1);

    const getVideoId = (video: Video) => video.id

    const addToQueue = (video: Video) => {
        setQueue((prevQueue) => {
            if (prevQueue.find((v) => getVideoId(v) === getVideoId(video))) {
                return prevQueue;
            }
            return [...prevQueue, video];
        });
    };

    const removeFromQueue = (videoId: string) => {
        setQueue((prevQueue) =>
            prevQueue.filter((video) => videoId === getVideoId(video))
        );
        if (queue.length === 1 && currentIndex === 0) {
            setSelectedVideo(null);
            setCurrentIndex(-1);
        }
    };

    // const saveForLater = (video: Video) => {
    //     setSavedVideos(prevSaved => {
    //         const id = typeof video.id === 'string' ? video.id : video.id.videoId
    //         if (prevSaved.some(v => (typeof v.id === 'string' ? v.id : v.id.videoId) === id)) {
    //             return prevSaved
    //         }
    //         return [...prevSaved, video]
    //     })
    // }

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
                addToQueue,
                removeFromQueue,
                // saveForLater,
                // savedVideos,
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
