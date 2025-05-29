import {useState} from 'react';
import {QueryClient, QueryClientProvider} from 'react-query';
import {useVideo, VideoProvider} from './context/VideoContext';
import Navbar from './components/Navbar';
import VideoSection from './components/VideoSection';
import {Toaster} from 'react-hot-toast';
import CategorySlider from './components/CategorySlider';
import MusicPlayer from "./components/MusicPlayer.tsx";
// import VideoPlayer from "./components/VideoPlayer.tsx";
import QueueList from './components/QueueList.tsx';
import VideoPlayer from './components/VideoPlayer.tsx';

const queryClient = new QueryClient();

function MainContent() {
    const {queue} = useVideo();

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleCategoryClick = (category: string) => {
        setSearchQuery(category);
    };


    return (
        <div className="min-h-screen bg-background w-full">
            <Navbar onSearch={handleSearch}/>


            <div className="w-full">
            {/* <div className="w-full flex md:flex-row flex-col gap-6"> */}
                {/* <div className="w-full h-full md:mr-6 sm:w-8/12"> */}




                {/* </div> */}

                <div className="p-4 pb-[80px]">
                    <CategorySlider onCategoryClick={handleCategoryClick}/>
                    <VideoSection searchQuery={searchQuery}/>
                </div>
                <div className='min-h-[180px] w-full fixed bottom-0 bg-black bg-opacity-80 backdrop-blur-md z-50 flex items-center justify-between flex-col px-2 my-auto'>
                         {queue.length > 0 && <QueueList/>}
                    <MusicPlayer/>
                    {/*    <VideoPlayer/>*/}

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
