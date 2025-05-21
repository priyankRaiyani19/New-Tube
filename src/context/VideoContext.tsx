import {createContext, ReactNode, useContext, useState} from 'react';
import {Video, VideoContextType} from '../types/video';


const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider = ({children}: { children: ReactNode }) => {
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [queue, setQueue] = useState<Video[]>([]);
    const [savedVideos, setSavedVideos] = useState<Video[]>([]);

    const getVideoId = (video: Video) => {
        if (typeof video.id === 'string') return video.id;
        if ('videoId' in video.id) return video.id.videoId;
        return '';
    };

    const addToQueue = (video: Video) => {
        const videoId = getVideoId(video);
        setQueue((prev) => {
            if (prev.some((v) => getVideoId(v) === videoId)) {
                return prev;
            }
            return [...prev, video];
        });
    };

    const removeFromQueue = (videoId: string) => {
        setQueue((prev) => prev.filter((v) => getVideoId(v) !== videoId));
    };

    const saveForLater = (video: Video) => {
        const videoId = getVideoId(video);
        setSavedVideos((prev) => {
            if (prev.some((v) => getVideoId(v) === videoId)) {
                return prev;
            }
            return [...prev, video];
        });
    };

    return (
        <VideoContext.Provider
            value={{
                selectedVideo,
                setSelectedVideo,
                queue,
                addToQueue,
                removeFromQueue,
                saveForLater,
                savedVideos,
            }}
        >
            {children}
        </VideoContext.Provider>
    );
};

export const useVideo = (): VideoContextType => {
    const context = useContext(VideoContext);
    if (!context) {
        throw new Error('useVideo must be used within a VideoProvider');
    }
    return context;
};
