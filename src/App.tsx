import {useCallback, useEffect, useRef, useState} from 'react';
import {QueryClient, QueryClientProvider} from 'react-query';
import {useVideo, VideoProvider} from './context/VideoContext';
import Navbar from './components/Navbar';
import VideoSection from './components/VideoSection';
import VideoPlayer from './components/VideoPlayer';
import {useSearchVideos, useTrendingVideos} from './hooks/useYouTubeApi';
import {Toaster} from 'react-hot-toast';
import QueueList from './components/QueueList';
import CategorySlider from './components/CategorySlider';

const queryClient = new QueryClient();

function MainContent() {
    const {selectedVideo, queue} = useVideo();

    const [searchQuery, setSearchQuery] = useState('');

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

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleCategoryClick = (category: string) => {
        setSearchQuery(category);
    };

    const observerRef = useRef<IntersectionObserver | null>(null);

    const loadMoreRef = useCallback(
        (node: HTMLDivElement | null) => {
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
        },
        [
            searchQuery,
            hasSearchNextPage,
            fetchSearchNextPage,
            isFetchingSearchNextPage,
            hasTrendingNextPage,
            fetchTrendingNextPage,
            isFetchingTrendingNextPage,
        ]
    );

    useEffect(() => {
        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, []);

    const trendingVideoItems = trendingVideos?.pages.flatMap((page) => page.items) || [];
    const searchVideoItems = searchVideos?.pages.flatMap((page) => page.items) || [];

    return (
        <div className="min-h-screen bg-background w-full p-4">
            <Navbar onSearch={handleSearch}/>


            <div className="w-full flex md:flex-row flex-col gap-6">
                <div className="w-full h-full md:mr-6 sm:w-8/12">
                    <div className={`${!selectedVideo ? 'md:block hidden' : 'block'}`}>
                        <VideoPlayer/>
                    </div>
                    {queue.length > 0 && <QueueList/>}
                </div>

                <div className="space-y-6 sm:w-4/12">
                    <CategorySlider onCategoryClick={handleCategoryClick}/>
                    <VideoSection                    
                        title={searchQuery ? `Search Results` : 'Trending Videos'}
                        videos={searchQuery ? searchVideoItems : trendingVideoItems}
                        isLoading={searchQuery ? searchLoading : trendingLoading}
                        isError={searchQuery ? searchError : trendingError}
                        error={searchQuery ? searchErrorData : trendingErrorData}
                    />

                    <div ref={loadMoreRef} className="h-10 w-full"/>
                </div>
            </div>
        </div>
    );
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <VideoProvider>
                <MainContent/>
                <Toaster position="top-right" reverseOrder={false}/>
            </VideoProvider>
        </QueryClientProvider>
    );
}

export default App;
