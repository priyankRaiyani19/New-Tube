import React from 'react'
import { Video } from '../types/video'
import { useVideo } from '../context/VideoContext'
import { Play, Plus, Minus } from 'lucide-react'
import { formatTimeAgo, formatViewCount } from '../utils/formatters'
import toast from 'react-hot-toast'

const VideoCard = ({ video }: { video: Video }) => {
    const { setSelectedVideo, addToQueue, removeFromQueue, queue, selectedVideo } = useVideo()

    const handleClick = () => {
        setSelectedVideo(video)
        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0
    }

    const getVideoId = (video: Video) => {
        if (typeof video.id === 'string') return video.id
        if ('videoId' in video.id) return video.id.videoId
        return ''
    }

    const videoId = getVideoId(video)
    const selectedVideoId = selectedVideo ? getVideoId(selectedVideo) : null

    const isAlreadyQueued = queue.some((v) => {
        if (typeof v.id === 'string') return v.id === videoId
        if ('videoId' in v.id) return v.id.videoId === videoId
        return false
    })

    const isCurrentlyPlaying = selectedVideoId === videoId

    const handleAddToQueue = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (isCurrentlyPlaying) {
            toast.error('Cannot add currently playing video to queue')
            return
        }
        if (!selectedVideo) {
            setSelectedVideo(video)
            toast.success('Now playing')
            document.body.scrollTop = 0
            document.documentElement.scrollTop = 0
        } else {
            addToQueue(video)
            toast.success('Added to queue')
        }
    }

    const handleRemoveFromQueue = (e: React.MouseEvent) => {
        e.stopPropagation()
        removeFromQueue(video)
        toast.error('Removed from queue')
    }

    const thumbnailUrl = video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url
    const viewCount = formatViewCount(parseInt(video.statistics.viewCount))
    const publishedAt = formatTimeAgo(video.snippet.publishedAt)

    return (
        <div
            className="group rounded-3xl border border-white/10 bg-primary-dark/20 p-4 transition-all hover:shadow-2xl hover:scale-[1.015] duration-300 cursor-pointer"
            onClick={handleClick}
        >
            <div className="flex flex-col sm:flex-row gap-5">
                <div className="relative w-full sm:w-52 h-56 sm:h-28 rounded-2xl">
                    <img
                        src={thumbnailUrl}
                        loading="lazy"
                        alt={video.snippet.title}
                        className="w-full h-full object-cover transition-all group-hover:scale-105 group-hover:brightness-50 rounded-2xl"
                    />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                        <Play size={32} />
                    </div>
                </div>

                <div className="flex flex-col justify-between w-full">
                    <div className="flex justify-between items-start">
                        <h3 className="text-white font-semibold text-base sm:text-lg line-clamp-2">
                            {video.snippet.title}
                        </h3>
                        <div className="flex items-center gap-2">
                            {isCurrentlyPlaying ? (
                                <div className="text-green-400 p-2 rounded-full bg-green-400/10">
                                    <Play size={20} fill="currentColor" />
                                </div>
                            ) : isAlreadyQueued ? (
                                <button
                                    onClick={handleRemoveFromQueue}
                                    className="text-red-400 p-2 rounded-full hover:bg-red-400/10 transition"
                                    title="Remove from queue"
                                >
                                    <Minus size={20} />
                                </button>
                            ) : (
                                <button
                                    onClick={handleAddToQueue}
                                    className="text-blue-400 p-2 rounded-full hover:bg-blue-400/10 transition"
                                    title={!selectedVideo ? 'Play now' : 'Add to queue'}
                                >
                                    <Plus size={20} />
                                </button>
                            )}
                        </div>
                    </div>

                    <p className="text-primary-light text-sm mt-1">{video.snippet.channelTitle}</p>

                    <div className="flex items-center justify-between text-primary-dark text-xs mt-2">
                        {viewCount && <span>{viewCount} views</span>}
                        <span>{publishedAt}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoCard
