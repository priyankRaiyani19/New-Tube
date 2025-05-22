import {useState} from 'react';
import {QueryClient, QueryClientProvider} from 'react-query';
import {useVideo, VideoProvider} from './context/VideoContext';
import Navbar from './components/Navbar';
import VideoSection from './components/VideoSection';
import VideoPlayer from './components/VideoPlayer';
import {Toaster} from 'react-hot-toast';
import QueueList from './components/QueueList';
import CategorySlider from './components/CategorySlider';

const queryClient = new QueryClient();

function MainContent() {
    const {selectedVideo, queue} = useVideo();

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleCategoryClick = (category: string) => {
        setSearchQuery(category);
    };


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
                    <VideoSection searchQuery={searchQuery}/>

                 
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
