import React, {useEffect, useRef, useState} from 'react';
import {Video} from '../types/video';
import {useVideo} from '../context/VideoContext';
import {MoreVertical, Play} from 'lucide-react';
import {formatTimeAgo, formatViewCount} from '../utils/formatters';
import {PiQueueBold} from 'react-icons/pi';
import toast from 'react-hot-toast';

interface VideoCardProps {
    video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({video}) => {
    const {setSelectedVideo, addToQueue, saveForLater, queue} = useVideo();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleClick = () => {
        setSelectedVideo(video);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };

    const getVideoId = (video: Video) => {
        if (typeof video.id === 'string') return video.id;
        if ('videoId' in video.id) return video.id.videoId;
        return '';
    };

    const videoId = getVideoId(video);

    const isAlreadyQueued = queue.some((v) => {
        if (typeof v.id === 'string') return v.id === videoId;
        if ('videoId' in v.id) return v.id.videoId === videoId;
        return false;
    });

    const handleAddToQueue = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAlreadyQueued) {
            addToQueue(video);
            toast.success('Added to queue');
        }
        setMenuOpen(false);
    };

    const handleSaveForLater = (e: React.MouseEvent) => {
        e.stopPropagation();
        saveForLater(video);
        setMenuOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const thumbnailUrl = video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url;
    const viewCount = formatViewCount(parseInt(video.statistics.viewCount))

    const publishedAt = formatTimeAgo(video.snippet.publishedAt);

    return (
        <div
            className="group bg-primary-light/10 hover:bg-primary-light/15 rounded-xl hover:shadow-xl hover:scale-[1.01] transition-transform duration-200 cursor-pointer p-3 relative"
            onClick={handleClick}
        >
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="relative w-full sm:w-40 h-48 sm:h-24 rounded-lg overflow-hidden shadow-md">
                    <img
                        src={thumbnailUrl}
                        alt={video.snippet.title}
                        className="w-full h-full bg-gradient-to-t from-black/100 to-black/50 object-cover opacity-80 group-hover:opacity-100"
                    />
                    <div
                        className="absolute inset-0 bg-black/0 group-hover:bg-black/50 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                        <Play size={26} className="text-white"/>
                    </div>
                </div>

                <div className="flex-1 relative pr-8">
                    <h3 className="text-white font-semibold text-sm sm:text-base line-clamp-2">
                        {video.snippet.title}
                    </h3>
                    <p className="text-zinc-400 text-xs sm:text-sm mt-1">
                        {video.snippet.channelTitle}
                    </p>
                    <div className="flex items-center justify-between text-zinc-500 text-xs mt-2">
                        {viewCount && <div>{viewCount} views</div>}
                        <span>{publishedAt}</span>
                    </div>
                </div>

                <div
                    className="absolute top-3 right-3 z-20"
                    ref={menuRef}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="p-1 text-white rounded-md transition-colors"
                    >
                        <MoreVertical size={24} className="opacity-100"/>
                    </button>
                    {menuOpen && (
                        <div
                            className="absolute right-0 mt-2 bg-gray-600/10 backdrop-blur-lg border border-white/10 rounded-md shadow-xl w-44 z-50 text-sm overflow-hidden">
                            <button
                                onClick={handleAddToQueue}
                                className={`flex gap-1 w-full text-left px-4 py-2 text-white hover:bg-white/20 transition-colors `}
                                disabled={isAlreadyQueued}
                            >
                                <PiQueueBold size={18} className="mr-2" color="#fff"/>
                                {isAlreadyQueued ? 'Remove From Queue' : 'Add to Queue'}
                            </button>
                            <button
                                onClick={handleSaveForLater}
                                className="w-full text-left px-4 py-2 text-white hover:bg-white/20 transition-colors"
                            >
                                Save for Later
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoCard;
