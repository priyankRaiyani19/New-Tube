import { X, GripVertical, PlayCircle, Clock } from 'lucide-react'
import { useVideo } from '../context/VideoContext'
import toast from 'react-hot-toast'
import { useRef } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const getVideoId = (video: any) => {
    if (typeof video.id === 'string') return video.id
    if ('videoId' in video.id) return video.id.videoId
    return ''
}

const QueueList = () => {
    const { queue, setQueue, selectedVideo, setSelectedVideo, removeFromQueue } = useVideo()

    const selectedVideoId = selectedVideo ? getVideoId(selectedVideo) : ''

    const moveItem = (fromIndex: number, toIndex: number) => {
        const updatedQueue = [...queue]
        const [moved] = updatedQueue.splice(fromIndex, 1)
        updatedQueue.splice(toIndex, 0, moved)
        setQueue(updatedQueue)
    }

    const handleElementClick = (video: any, videoId: string) => {
        setSelectedVideo(video)
        toast.success('Now playing')
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleRemoveClick = (e: React.MouseEvent, videoId: string) => {
        e.stopPropagation()
        removeFromQueue(videoId)
        toast.error('Removed from queue')
    }

    return (
        <div className="relative p-4 sm:p-6 max-w-full">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 rounded-3xl pointer-events-none" />

            <header className="relative mb-6 sm:mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 backdrop-blur-sm">
                        <Clock className="w-5 h-5 text-purple-400" />
                    </div>
                    <h2 className="text-transparent text-xl sm:text-2xl font-extrabold tracking-wide select-none bg-gradient-to-r from-white via-purple-100 to-blue-100 bg-clip-text">
                        Up Next
                    </h2>
                </div>
                <p className="text-zinc-400 text-sm font-medium ml-12 max-w-xs truncate">
                    {queue.length} video{queue.length !== 1 ? 's' : ''} in queue
                </p>
            </header>

            {queue.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 sm:py-20">
                    <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-white/10 backdrop-blur-sm flex items-center justify-center">
                        <PlayCircle className="w-10 h-10 text-zinc-500" />
                    </div>
                    <p className="text-zinc-500 text-lg font-semibold mb-2 select-none text-center">
                        Your queue is empty
                    </p>
                    <p className="text-zinc-600 text-sm select-none text-center max-w-xs">
                        Add videos to start building your playlist
                    </p>
                </div>
            ) : (
                <DndProvider backend={HTML5Backend}>
                    <ul className="relative space-y-3 sm:space-y-4 overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/20">
                        {queue.map((video: any, index: number) => (
                            <QueueItem
                                key={getVideoId(video)}
                                index={index}
                                video={video}
                                videoId={getVideoId(video)}
                                isSelected={getVideoId(video) === selectedVideoId}
                                onClick={handleElementClick}
                                onRemove={handleRemoveClick}
                                moveItem={moveItem}
                            />
                        ))}
                    </ul>
                </DndProvider>
            )}
        </div>
    )
}

const QueueItem = ({
                       video,
                       videoId,
                       index,
                       isSelected,
                       onClick,
                       onRemove,
                       moveItem
                   }: {
    video: any
    videoId: string
    index: number
    isSelected: boolean
    onClick: (video: any, id: string) => void
    onRemove: (e: React.MouseEvent, id: string) => void
    moveItem: (fromIndex: number, toIndex: number) => void
}) => {
    const ref = useRef<HTMLLIElement>(null)

    const [, drop] = useDrop({
        accept: 'QUEUE_ITEM',
        hover(item: { index: number }) {
            if (!ref.current) return
            const dragIndex = item.index
            const hoverIndex = index
            if (dragIndex === hoverIndex) return
            moveItem(dragIndex, hoverIndex)
            item.index = hoverIndex
        }
    })

    const [{ isDragging }, drag] = useDrag({
        type: 'QUEUE_ITEM',
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    })

    drag(drop(ref))

    return (
        <li
            ref={ref}
            onClick={() => onClick(video, videoId)}
            className={`group relative flex items-center gap-3 rounded-2xl p-3 cursor-move transition-all duration-300 backdrop-blur-sm border ${
                isSelected
                    ? 'bg-gradient-to-r from-purple-500/20 via-purple-500/10 to-blue-500/20 border-purple-400/30 shadow-lg shadow-purple-500/10'
                    : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.08] hover:border-white/20 hover:scale-[1.02]'
            }`}
            style={{
                opacity: isDragging ? 0.5 : 1,
                transform: isDragging ? 'rotate(1deg) scale(1.02)' : 'rotate(0deg) scale(1)'
            }}
        >
            <div className="flex-shrink-0 opacity-0 group-hover:opacity-60 transition cursor-grab active:cursor-grabbing">
                <GripVertical className="w-4 h-4 text-zinc-500" />
            </div>

            <div className="relative flex-shrink-0 w-20 h-12 sm:w-28 sm:h-16 rounded-xl overflow-hidden">
                <img
                    src={video.snippet.thumbnails?.default?.url || ''}
                    alt={video.snippet.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                <PlayCircle className="absolute top-1/2 left-1/2 w-6 h-6 text-white/90 opacity-0 group-hover:opacity-100 transition transform -translate-x-1/2 -translate-y-1/2 drop-shadow-lg" />
            </div>

            <div className="flex-1 min-w-0 space-y-1 text-white">
                <p className="text-sm sm:text-base font-semibold line-clamp-2 group-hover:text-purple-100 transition-colors">
                    {video.snippet.title}
                </p>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400 truncate">
                    <span className="select-text truncate">{video.snippet.channelTitle}</span>
                    <span>•</span>
                    <span className="font-medium text-zinc-500">#{index + 1}</span>
                </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition duration-300">
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onClick(video, videoId)
                    }}
                    className="p-2 rounded-xl bg-green-500/20 hover:bg-green-500/30 text-green-400 hover:text-green-300 transition transform hover:scale-110 backdrop-blur-sm border border-green-500/20"
                    aria-label="Play now"
                >
                    <PlayCircle className="w-4 h-4" />
                </button>
                <button
                    onClick={(e) => onRemove(e, videoId)}
                    className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition transform hover:scale-110 backdrop-blur-sm border border-red-500/20"
                    aria-label="Remove video from queue"
                >
                    <X size={16} />
                </button>
            </div>
        </li>
    )
}

export default QueueList
