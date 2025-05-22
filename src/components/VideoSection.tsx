import VideoCard from './VideoCard';
import ErrorState from './ErrorState';
import LoadingSkeleton from './LoadingSkeleton';
import {VideoGridProps} from "../types/video.ts";
import React from "react";


const VideoSection: React.FC<VideoGridProps> = ({
                                                    title,
                                                    videos,
                                                    isLoading,
                                                    isError,
                                                    error,
                                                }: VideoGridProps) => {
    const handleRetry = () => {
        window.location.reload();
    }
    if(isError) {
        return (
            <div className="w-full">
                <ErrorState
                    message={error?.message || 'An error occurred'}
                    onRetry={handleRetry}
                />
            </div>
        );
    }
    return (
        <div className={`w-full`}>
            <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>

            { 
                isLoading ? (
                        <div className="space-y-4 w-full">
                            {[...Array(4)].map((_, index) => (
                                <LoadingSkeleton key={index}/>
                            ))}
                        </div>
                    ) :
                    videos ? (
                        <div className="space-y-4">
                            {videos.map((video) => (
                                <VideoCard
                                    key={typeof video.id === 'string' ? video.id : video.id.videoId}
                                    video={video}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-white text-center text-xl py-10">No videos found</p>
                    )}
        </div>
    );
};

export default VideoSection;