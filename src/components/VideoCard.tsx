import React, {useEffect, useRef, useState} from 'react'
import {Video} from '../types/video'
import {useVideo} from '../context/VideoContext'
import {MoreVertical, Play} from 'lucide-react'
import {formatTimeAgo, formatViewCount} from '../utils/formatters'
import {PiQueueBold} from 'react-icons/pi'
import toast from 'react-hot-toast'

const VideoCard = ({video}: { video: Video }) => {
    const {setSelectedVideo, addToQueue, queue} = useVideo()
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

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

    const isAlreadyQueued = queue.some((v) => {
        if (typeof v.id === 'string') return v.id === videoId
        if ('videoId' in v.id) return v.id.videoId === videoId
        return false
    })

    const handleAddToQueue = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!isAlreadyQueued) {
            addToQueue(video)
            toast.success('Added to queue')
        }
        setMenuOpen(false)
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const thumbnailUrl = video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url
    const viewCount = formatViewCount(parseInt(video.statistics.viewCount))
    const publishedAt = formatTimeAgo(video.snippet.publishedAt)

    return (
        <div
            className="group relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg shadow-xl p-4 transition-all hover:shadow-2xl hover:scale-[1.015] duration-300 cursor-pointer"
            onClick={handleClick}
        >
            <div className="flex flex-col sm:flex-row gap-5">
                <div className="relative w-full sm:w-48 h-56 sm:h-28 rounded-2xl overflow-hidden">
                    <img
                        src={thumbnailUrl}
                        alt={video.snippet.title}
                        className="w-full h-full object-cover transition-all group-hover:scale-105 group-hover:brightness-110 rounded-2xl"
                    />
                    <div
                        className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <Play size={32} className="text-white drop-shadow-xl"/>
                    </div>
                </div>

                <div className="flex flex-col justify-between w-full">
                    <div className="flex justify-between items-start">
                        <h3 className="text-white font-semibold text-base sm:text-lg line-clamp-2 leading-tight">
                            {video.snippet.title}
                        </h3>
                        <div className="relative" ref={menuRef} onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="text-white p-2 rounded-full hover:bg-white/10 transition"
                            >
                                <MoreVertical size={20}/>
                            </button>
                            {menuOpen && (
                                <div
                                    className="absolute right-0 mt-2 z-50 w-52 rounded-xl bg-zinc-800/80 border border-white/10 backdrop-blur-lg shadow-2xl overflow-hidden animate-fade-in">
                                    <button
                                        onClick={handleAddToQueue}
                                        className={`flex items-center gap-3 px-4 py-3 w-full hover:bg-white/10 text-sm text-white transition ${
                                            isAlreadyQueued ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                        disabled={isAlreadyQueued}
                                    >
                                        <PiQueueBold size={20}/>
                                        {isAlreadyQueued ? 'Remove From Queue' : 'Add to Queue'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="text-zinc-400 text-sm mt-1">{video.snippet.channelTitle}</p>

                    <div className="flex items-center justify-between text-zinc-500 text-xs mt-2">
                        {viewCount && <span>{viewCount} views</span>}
                        <span>{publishedAt}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoCard
