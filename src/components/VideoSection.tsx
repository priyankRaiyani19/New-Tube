import React from 'react';
import {Video} from '../types/video';
import VideoCard from './VideoCard';
import ErrorState from './ErrorState';
import LoadingSkeleton from './LoadingSkeleton';

interface VideoGridProps {
    title: string;
    videos: Video[] | undefined;
    isLoading: boolean;
    isError: boolean;
    error: unknown;
}

const VideoSection: React.FC<VideoGridProps> = ({
                                                    title,
                                                    videos,
                                                    isLoading,
                                                    isError,
                                                    error,
                                                }) => {
    return (
        <div>
            <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>

            {isError ? (
                    <ErrorState
                        message={`Failed to load videos`}
                        error={error}
                    />
                ) :
                isLoading ? (
                        <div className="space-y-4">
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
                        <p className="text-gray-400 text-center py-10">No videos found</p>
                    )}
        </div>
    );
};

export default VideoSection;