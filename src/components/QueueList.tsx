import { X, GripVertical, PlayCircle, Clock, Trash2 } from 'lucide-react'
import { useVideo } from '../context/VideoContext'
import { useRef } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import toast from 'react-hot-toast'

const getVideoId = (video: any) => {
    if (typeof video.id === 'string') return video.id
    if ('videoId' in video.id) return video.id.videoId
    return ''
}

const QueueList = () => {
    const { queue, setQueue, selectedVideo, setSelectedVideo, removeFromQueue } = useVideo()

    const selectedVideoId = selectedVideo ? getVideoId(selectedVideo) : ''

    const moveItem = (from: number, to: number) => {
        const updated = [...queue]
        const [moved] = updated.splice(from, 1)
        updated.splice(to, 0, moved)
        setQueue(updated)
    }

    const handleClick = (video: any, videoId: string) => {
        setSelectedVideo(video)
        toast.success('Now playing')
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleRemove = (e: React.MouseEvent, videoId: string) => {
        e.stopPropagation()
        removeFromQueue(videoId)
        toast.error('Removed from queue')
    }

    const handleClearQueue = () => {
        setQueue([])
        toast.error('Queue cleared')
    }

    return (
        <div className="p-4 max-w-full">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-purple-500/10 border border-white/10">
                    <Clock className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Up Next</h2>
                <p className="text-sm text-zinc-400 ml-auto">{queue.length} video{queue.length !== 1 ? 's' : ''}</p>
                {queue.length > 0 && (
                    <button
                        onClick={handleClearQueue}
                        className="ml-3 text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                    >
                        <Trash2 className="w-4 h-4" />
                        Clear
                    </button>
                )}
            </div>

            {queue.length === 0 ? (
                <div className="text-center py-20 text-zinc-500">
                    <PlayCircle className="mx-auto w-12 h-12 mb-4" />
                    <p className="text-lg font-medium">Your queue is empty</p>
                    <p className="text-sm">Add videos to start building your playlist</p>
                </div>
            ) : (
                <DndProvider backend={HTML5Backend}>
                    <ul className="space-y-3 overflow-y-auto max-h-[70vh]">
                        {queue.map((video: any, index: number) => (
                            <QueueItem
                                key={getVideoId(video)}
                                index={index}
                                video={video}
                                videoId={getVideoId(video)}
                                isSelected={getVideoId(video) === selectedVideoId}
                                onClick={handleClick}
                                onRemove={handleRemove}
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
    moveItem: (from: number, to: number) => void
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
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
                isSelected ? 'bg-primary/10 border border-primary-dark' : 'bg-zinc-800 hover:bg-zinc-700'
            }`}
            style={{
                opacity: isDragging ? 0.5 : 1
            }}
        >
            <GripVertical className="w-5 h-5 text-primary flex-shrink-0 cursor-move" />
            <div className="w-20 h-12 rounded-md overflow-hidden flex-shrink-0">
                <img src={video.snippet.thumbnails?.default?.url || ''} alt={video.snippet.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate">{video.snippet.title}</p>
                <p className="text-zinc-400 text-xs truncate">{video.snippet.channelTitle} • #{index + 1}</p>
            </div>
            <button onClick={(e) => onRemove(e, videoId)} className="text-red-400 hover:text-red-300">
                <X />
            </button>
        </li>
    )
}

export default QueueList
