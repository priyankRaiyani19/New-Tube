import {X} from 'lucide-react';
import {useVideo} from '../context/VideoContext';
import toast from 'react-hot-toast';

const getVideoId = (video: any) => {
    if (typeof video.id === 'string') return video.id;
    if ('videoId' in video.id) return video.id.videoId;
    return '';
};

const QueueList = () => {
    const {queue, selectedVideo, setSelectedVideo, removeFromQueue} = useVideo();

    const selectedVideoId = selectedVideo ? getVideoId(selectedVideo) : '';

    const mappedQueue = queue.map((video: any) => ({
        video,
        videoId: getVideoId(video),
    }));

    const handleElementClick = (video: any, videoId: string) => {
        setSelectedVideo(video);
        removeFromQueue(videoId);
        toast.success('Removed from queue');
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };

    const handleRemoveClick = (e: React.MouseEvent, videoId: string) => {
        e.stopPropagation();
        removeFromQueue(videoId);
        toast.error('Removed from queue');
    };

    return (
        <div className="p-4 sm:p-6 max-w-full ">
            <h2 className="text-white text-xl sm:text-2xl font-extrabold mb-5 sm:mb-6 tracking-wide select-none">
                Up Next
            </h2>
            {queue.length === 0 ? (
                <p className="text-zinc-500 text-sm italic text-center mt-20 select-none">
                    No videos in queue.
                </p>
            ) : (
                <ul className="space-y-4 sm:space-y-5 overflow-y-auto  sm:max-h-full max-h-[400px]  ">
                    {mappedQueue.map(({video, videoId}) => {
                        const isSelected = videoId === selectedVideoId;
                        return (
                            <li
                                key={videoId}
                                onClick={() => handleElementClick(video, videoId)}
                                className={`flex items-center gap-3 sm:gap-5 rounded-2xl p-3 sm:p-4 cursor-pointer group transition-all duration-300 ${
                                    isSelected ? 'bg-white/10 ' : 'hover:bg-white/5'
                                }`}
                            >
                                <img
                                    src={video.snippet.thumbnails?.default?.url || ''}
                                    alt={video.snippet.title}
                                    className="w-16 h-10 sm:w-24 sm:h-14 object-cover rounded-lg ring-1 ring-white/20 group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="flex-1 text-white min-w-0">
                                    <p className="text-sm sm:text-md font-semibold leading-tight line-clamp-2">
                                        {video.snippet.title}
                                    </p>
                                    <p className="text-xs text-zinc-400 mt-0.5 select-text truncate">
                                        {video.snippet.channelTitle}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => handleRemoveClick(e, videoId)}
                                    className="text-primary hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-900/30"
                                    aria-label="Remove video from queue"
                                >
                                    <X size={18}/>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default QueueList;
