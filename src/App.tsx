import  { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { VideoProvider } from './context/VideoContext';
import Navbar from './components/Navbar';
import VideoSection from './components/VideoSection.tsx';
import VideoPlayer from './components/VideoPlayer';
import { 
  useTrendingVideos, 
  useSearchVideos 
} from './hooks/useYouTubeApi';

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
    <div className="min-h-screen bg-background">
      <Navbar onSearch={handleSearch} />
      
      <main className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

        <div className="lg:col-span-8 h-full">
          <VideoPlayer />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <VideoSection
            title={searchQuery ? `Search Results` : "Trending Videos"}
            videos={searchQuery ? searchResults?.items : trendingVideos?.items}
            isLoading={searchQuery ? searchLoading : trendingLoading}
            isError={searchQuery ? searchError : trendingError}
            error={searchQuery ? searchErrorData : trendingErrorData}
          />
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <VideoProvider>
        <MainContent />
      </VideoProvider>
    </QueryClientProvider>
  );
}

export default App;