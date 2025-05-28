import {useRef} from "react";
import {useDrag, useDrop} from "react-dnd";
import {GripVertical, X} from "lucide-react";
import {Video} from "../types/video.ts";

const QueueItem = ({
                       video,
                       videoId,
                       index,
                       isSelected,
                       onClick,
                       onRemove,
                       moveItem
                   }: {
    video: Video
    videoId: string
    index: number
    isSelected: boolean
    onClick: (video: Video, id: string) => void
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
                isSelected ? 'bg-primary/10 border border-primary-dark' : 'bg-white/10 hover:bg-zinc-700'
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




export default QueueItem;