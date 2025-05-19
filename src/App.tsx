import {useState} from 'react';
import {QueryClient, QueryClientProvider} from 'react-query';
import {VideoProvider} from './context/VideoContext';
import Navbar from './components/Navbar';
import VideoSection from './components/VideoSection.tsx';
import VideoPlayer from './components/VideoPlayer';
import {useSearchVideos, useTrendingVideos} from './hooks/useYouTubeApi';

const queryClient = new QueryClient();

function MainContent() {
    const [searchQuery, setSearchQuery] = useState('');

    const {
        data: trendingVideos,
        isLoading: trendingLoading,
        isError: trendingError,
        error: trendingErrorData
    } = useTrendingVideos();

    const {
        data: searchResults,
        isLoading: searchLoading,
        isError: searchError,
        error: searchErrorData
    } = useSearchVideos(searchQuery);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    return (
        <div className="min-h-screen bg-background w-full">
            <Navbar onSearch={handleSearch}/>

            <div className="w-full mx-auto px-4 py-6 flex md:flex-row flex-col  gap-6">

                <div className="w-full h-full">
                    <VideoPlayer/>
                </div>

                <div className=" space-y-6">
                    <VideoSection
                        title={searchQuery ? `Search Results` : "Trending Videos"}
                        videos={searchQuery ? searchResults?.items : trendingVideos?.items}
                        isLoading={searchQuery ? searchLoading : trendingLoading}
                        isError={searchQuery ? searchError : trendingError}
                        error={searchQuery ? searchErrorData : trendingErrorData}
                    />
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
            </VideoProvider>
        </QueryClientProvider>
    );
}

export default App;