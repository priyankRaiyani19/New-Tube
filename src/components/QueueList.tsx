import {X} from 'lucide-react';
import {useVideo} from '../context/VideoContext';

const getVideoId = (video: any) => {
    if (typeof video.id === 'string') return video.id;
    if ('videoId' in video.id) return video.id.videoId;
    return '';
};

const QueueList = () => {
    const {queue, setSelectedVideo, removeFromQueue} = useVideo();

    return (
        <div className="p-4 sm:p-6 max-w-full">
            <h2 className="text-white text-xl sm:text-2xl font-extrabold mb-5 sm:mb-6 tracking-wide select-none">
                Up Next
            </h2>
            {queue.length === 0 ? (
                <p className="text-zinc-500 text-sm italic text-center mt-20 select-none">
                    No videos in queue.
                </p>
            ) : (
                <ul className="space-y-4 sm:space-y-5 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent max-h-[400px]">
                    {queue.map((video) => {
                        const videoId = getVideoId(video);
                        return (
                            <li
                                key={videoId}
                                onClick={() => setSelectedVideo(video)}
                                className="flex items-center gap-3 sm:gap-5  rounded-2xl p-3 sm:p-4 cursor-pointer group"
                            >
                                <img
                                    src={video.snippet.thumbnails.default.url}
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
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFromQueue(videoId);
                                    }}
                                    className="text-zinc-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-900/30 "
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
