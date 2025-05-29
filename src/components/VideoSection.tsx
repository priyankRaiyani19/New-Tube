import VideoCard from './VideoCard';
import ErrorState from './ErrorState';
import LoadingSkeleton from './LoadingSkeleton';
import {useSearchVideos, useTrendingVideos} from '../hooks/useYouTubeApi';
import {useCallback, useEffect, useRef} from 'react';

const VideoSection: React.FC<{ searchQuery: string }> = ({searchQuery}) => {
    const {
        data: trendingVideos,
        isLoading: trendingLoading,
        isError: trendingError,
        error: trendingErrorData,
        fetchNextPage: fetchTrendingNextPage,
        hasNextPage: hasTrendingNextPage,
        isFetchingNextPage: isFetchingTrendingNextPage,
    } = useTrendingVideos();

    const {
        data: searchVideos,
        isLoading: searchLoading,
        isError: searchError,
        error: searchErrorData,
        fetchNextPage: fetchSearchNextPage,
        hasNextPage: hasSearchNextPage,
        isFetchingNextPage: isFetchingSearchNextPage,
    } = useSearchVideos(searchQuery);

    const observerRef = useRef<IntersectionObserver | null>(null);

    const loadMoreRef = useCallback((node: HTMLDivElement | null) => {
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                if (searchQuery && hasSearchNextPage && !isFetchingSearchNextPage) {
                    fetchSearchNextPage();
                } else if (!searchQuery && hasTrendingNextPage && !isFetchingTrendingNextPage) {
                    fetchTrendingNextPage();
                }
            }
        });

        if (node) observerRef.current.observe(node);
    }, [
        searchQuery,
        hasSearchNextPage,
        fetchSearchNextPage,
        isFetchingSearchNextPage,
        hasTrendingNextPage,
        fetchTrendingNextPage,
        isFetchingTrendingNextPage,
    ]);

    useEffect(() => {
        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, []);

    const isLoading = searchQuery ? searchLoading : trendingLoading;
    const isError = searchQuery ? searchError : trendingError;
    const error = searchQuery ? searchErrorData : trendingErrorData;
    const videos = (searchQuery ? searchVideos?.pages : trendingVideos?.pages)?.flatMap((page) => page.items) || [];

    const handleRetry = () => {
        window.location.reload();
    };

    if (isError) {
        return (
            <div className="w-full">
                <ErrorState
                    error={error}
                    message={error?.message || 'An error occurred'}
                    onRetry={handleRetry}
                />
            </div>
        );
    }
 
    return (
        <div className="w-full">
            <h2 className="text-xl font-bold mb-4 text-white">
                {searchQuery ? 'Search Results' : 'Trending Videos'}
            </h2>
            {isLoading ? (
                <div className="flex flex-wrap gap-4 justify-between">
                    {[...Array(6)].map((_, index) => (
                        <LoadingSkeleton key={index}/>
                    ))}
                </div>
            ) : videos.length > 0 ? (
                <div className="flex flex-wrap gap-4 justify-between">
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
            <div ref={loadMoreRef} className="h-10 w-full"/>
        </div>
    );
};

export default VideoSection;
