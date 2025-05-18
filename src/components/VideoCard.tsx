import React from 'react';
import { Video } from '../types/video';
import { useVideo } from '../context/VideoContext';
import { Play } from 'lucide-react';
import { formatViewCount, formatTimeAgo } from '../utils/formatters';

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const { setSelectedVideo } = useVideo();
  
  const handleClick = () => {
    setSelectedVideo(video);
  };

  const thumbnailUrl = video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url;
  
  const viewCount = video.statistics?.viewCount 
    ? formatViewCount(parseInt(video.statistics.viewCount)) 
    : '';
  
  const publishedAt = formatTimeAgo(video.snippet.publishedAt);

  return (
    <div 
      className="group bg-card rounded-lg overflow-hidden hover:bg-secondary-light transition-colors duration-200 cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex gap-4">
        <div className="relative w-40 h-24">
          <img 
            src={thumbnailUrl} 
            alt={video.snippet.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Play size={24} className="text-primary" />
          </div>
        </div>
        <div className="flex-1 p-2 min-w-0">
          <h3 className="text-white font-medium line-clamp-2 text-sm">
            {video.snippet.title}
          </h3>
          <p className="text-gray-400 text-xs mt-1">
            {video.snippet.channelTitle}
          </p>
          <div className="flex items-center text-gray-500 text-xs mt-1">
            {viewCount && (
              <>
                <span>{viewCount} views</span>
                <span className="mx-1">•</span>
              </>
            )}
            <span>{publishedAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;