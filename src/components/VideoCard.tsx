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
            className="group relative  h-[180px] rounded-3xl border border-white/10 bg-gradient-to-br from-[#1f1f1f]/60 to-[#0f0f0f]/60 backdrop-blur-lg p-5 shadow-md hover:shadow-xl hover:scale-[1.025] transition-all duration-300 cursor-pointer"
            onClick={handleClick}
        >
            <div className="flex flex-col sm:flex-row gap-5 h-full">
                <div className="relative w-full sm:w-52 h-56 sm:h-32 rounded-2xl overflow-hidden shadow-md">
                    <img
                        src={thumbnailUrl}
                        alt={video.snippet.title}
                        loading="lazy"
                        className="w-full h-full object-cover rounded-2xl transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                        <Play size={28} className="text-white drop-shadow-md" />
                    </div>
                </div>

                <div className="flex flex-col justify-between w-full">
                    <div className="flex justify-between items-start">
                        <h3 className="text-white font-semibold text-[15px] sm:text-[17px] leading-snug line-clamp-2">
                            {video.snippet.title}
                        </h3>
                        <div className="flex items-center gap-2">
                            {isCurrentlyPlaying ? (
                                <div className="bg-green-500/10 text-green-400 p-[6px] rounded-full shadow-sm shadow-green-500/30">
                                    <Play size={18} fill="currentColor" />
                                </div>
                            ) : isAlreadyQueued ? (
                                <button
                                    onClick={handleRemoveFromQueue}
                                    className="bg-red-500/10 text-red-400 p-[6px] rounded-full hover:bg-red-500/20 transition"
                                    title="Remove from queue"
                                >
                                    <Minus size={18} />
                                </button>
                            ) : (
                                <button
                                    onClick={handleAddToQueue}
                                    className="bg-blue-500/10 text-blue-400 p-[6px] rounded-full hover:bg-blue-500/20 transition"
                                    title={!selectedVideo ? 'Play now' : 'Add to queue'}
                                >
                                    <Plus size={18} />
                                </button>
                            )}
                        </div>
                    </div>

                    <p className="text-sm text-zinc-300 mt-1">{video.snippet.channelTitle}</p>

                    <div className="flex items-center justify-between text-xs text-zinc-500 mt-2">
                        {viewCount && <span>{viewCount} views</span>}
                        <span>{publishedAt}</span>
                    </div>
                </div>
            </div>

            <div className="absolute inset-0 rounded-3xl border border-white/5 group-hover:border-pink-500/20 pointer-events-none transition-all duration-300" />
        </div>

    )
}

export default VideoCard
