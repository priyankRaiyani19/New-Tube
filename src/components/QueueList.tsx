import {  PlayCircle, Clock, Trash2 } from 'lucide-react'
import { useVideo } from '../context/VideoContext'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import toast from 'react-hot-toast'
import QueueItem from "./QueueItem.tsx";
import {Video} from "../types/video.ts";

const getVideoId = (video: Video) => {
    if (typeof video.id === 'string') return video.id
    if ('videoId' in video.id) return video.id.videoId
    return ''
}

const QueueList = () => {
    const { queue, setQueue, selectedVideo, setSelectedVideo, removeFromQueue } = useVideo()

    const selectedVideoId = selectedVideo ? getVideoId(selectedVideo) : ''

    const moveItem = (from: number, to: number) => {
        const updated = [...queue]
        const [moved] = updated.splice(from, 1);
        updated.splice(to, 0, moved)
        setQueue(updated)
    }

    const handleClick = (video: Video) => {
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
        <div className="px-6 py-4 w-[100vw] overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full ">
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
                    <ul className=" overflow-y-auto flex gap-2 overflow-x-auto no-scrollbar">
                        {queue.map((video: Video, index: number) => (
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


export default QueueList
