import React, {useEffect, useRef, useState} from 'react'
import {useVideo} from '../context/VideoContext'
import ReactPlayer from 'react-player'
import * as Slider from '@radix-ui/react-slider'
import {
    FaBackward,
    FaCompress,
    FaExpand,
    FaEye,
    FaForward,
    FaPause,
    FaPlay,
    FaRegThumbsUp,
    FaStepBackward,
    FaStepForward,
    FaThumbsUp,
    FaVolumeMute,
    FaVolumeUp,
} from 'react-icons/fa'
import {formatViewCount} from '../utils/formatters.ts'


const VideoPlayer: React.FC = () => {
    const {selectedVideo, playPrevious, playNext, removeFromQueue} = useVideo()

    const playerRef = useRef<ReactPlayer>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [volume, setVolume] = useState(0.7)
    const [isMuted, setIsMuted] = useState(false)
    const [played, setPlayed] = useState(0)
    const [duration, setDuration] = useState(0)
    const [seeking, setSeeking] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [isLiked, setIsLiked] = useState(false)
    const [isSpeedBoost, setIsSpeedBoost] = useState(false)
    const isSpaceHeld = useRef(false)
    const [expanded, setExpanded] = useState(false)
    const hasRemovedFromQueue = useRef(false)

    const handlePlayPause = () => setIsPlaying((prev) => !prev)

    const handleVolumeChange = (value: number[]) => {
        setVolume(value[0])
        setIsMuted(value[0] === 0)
    }

    const handleSeekChange = (value: number[]) => setPlayed(value[0])

    const handleSeekMouseDown = () => setSeeking(true)

    const handleSeekMouseUp = (value: number[]) => {
        setSeeking(false)
        if (playerRef.current) playerRef.current.seekTo(value[0])
    }

    const handleProgress = (state: { played: number }) => {
        if (!seeking) setPlayed(state.played)
        if (state.played > 0 && !hasRemovedFromQueue.current && selectedVideo) {
            const id =
                typeof selectedVideo.id === 'string'
                    ? selectedVideo.id
                    : selectedVideo.id.videoId
            removeFromQueue(id)
            hasRemovedFromQueue.current = true
        }
    }

    const handleDuration = (duration: number) => setDuration(duration)

    const toggleMute = () => setIsMuted((prev) => !prev)

    const handleSkip = (dir: 'forward' | 'backward') => {
        if (!playerRef.current) return
        const time = playerRef.current.getCurrentTime()
        playerRef.current.seekTo(time + (dir === 'forward' ? 10 : -10))
    }

    const toggleFullscreen = () => {
        const element = document.getElementById('player-wrapper')
        if (!element) return
        if (!document.fullscreenElement) {
            element.requestFullscreen()
            setIsFullscreen(true)
        } else {
            document.exitFullscreen()
            setIsFullscreen(false)
        }
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' && !isSpaceHeld.current) {
                isSpaceHeld.current = true
                if (playerRef.current?.getInternalPlayer()?.playbackRate !== 2) {
                    playerRef.current!.getInternalPlayer().playbackRate = 2
                    setIsSpeedBoost(true)
                }
            }

            switch (e.code) {
                case 'ArrowLeft':
                    handleSkip('backward')
                    break
                case 'ArrowRight':
                    handleSkip('forward')
                    break
                case 'KeyM':
                    toggleMute()
                    break
                case 'KeyF':
                    toggleFullscreen()
                    break
            }
        }

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                if (isSpaceHeld.current) {
                    isSpaceHeld.current = false
                    playerRef.current!.getInternalPlayer().playbackRate = 1
                    setIsSpeedBoost(false)
                } else {
                    e.preventDefault()
                    handlePlayPause()
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [])

    if (!selectedVideo) {
        return (
            <div className="aspect-video bg-zinc-900 rounded-xl flex items-center justify-center text-white/40">
                Select a video to play
            </div>
        )
    }

    const viewCount = formatViewCount(
        parseInt(selectedVideo.statistics?.viewCount ?? '0')
    )

    const likeCount = formatViewCount(parseInt(selectedVideo.statistics.likeCount));
    const videoId =
        typeof selectedVideo.id === 'string'
            ? selectedVideo.id
            : selectedVideo.id.videoId

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    function previousVideo() {
        playPrevious()
        setIsPlaying(true)
        hasRemovedFromQueue.current = true
    }

    function nextVideo() {
        playNext()
        setIsPlaying(true)
        hasRemovedFromQueue.current = true
    }

    return (
        <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-lg" id="player-wrapper">
            <div className="aspect-video">
                <ReactPlayer
                    ref={playerRef}
                    url={`https://www.youtube.com/watch?v=${videoId}`}
                    width="100%"
                    height="100%"
                    playing={isPlaying}
                    volume={volume}
                    muted={isMuted}
                    onProgress={handleProgress}
                    onDuration={handleDuration}
                    playbackRate={isSpeedBoost ? 2 : 1}
                />
            </div>

            <div className="p-4 space-y-2">
                <Slider.Root
                    className="relative flex items-center w-full h-3"
                    value={[played]}
                    max={1}
                    step={0.001}
                    onValueChange={handleSeekChange}
                    onPointerDown={handleSeekMouseDown}
                    onPointerUp={(event) => {
                        const target = event.target as HTMLElement
                        // The onPointerUp handler from Radix actually does NOT pass the value by default.
                        // So we must use the current played state:
                        handleSeekMouseUp([played])
                    }}
                >
                    <Slider.Track className="bg-gray-600 rounded-full h-[4px] w-full relative">
                        <Slider.Range className="absolute h-full bg-primary-dark rounded-full"/>
                    </Slider.Track>
                    <Slider.Thumb className="block w-4 h-4 bg-primary-light rounded-full"/>
                </Slider.Root>

                <div className="flex justify-between text-sm text-gray-400">
                    <span>{formatTime(played * duration)}</span>
                    <span>{formatTime(duration)}</span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-white">
                        <button onClick={previousVideo} className="hover:text-indigo-400 transition">
                            <FaStepBackward size={18}/>
                        </button>
                        <button onClick={() => handleSkip('backward')} className="hover:text-indigo-400 transition">
                            <FaBackward size={18}/>
                        </button>
                        <button onClick={handlePlayPause} className="text-white transition p-2 rounded-full">
                            {isPlaying ? <FaPause size={18}/> : <FaPlay size={18}/>}
                        </button>
                        <button onClick={() => handleSkip('forward')} className="hover:text-indigo-400 transition">
                            <FaForward size={18}/>
                        </button>
                        <button onClick={nextVideo} className="hover:text-indigo-400 transition">
                            <FaStepForward size={18}/>
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={toggleMute} className="text-white hover:text-indigo-400 transition">
                            {isMuted ? <FaVolumeMute size={18}/> : <FaVolumeUp size={18}/>}
                        </button>
                        <Slider.Root
                            className="relative flex items-center w-24 h-3"
                            value={[isMuted ? 0 : volume]}
                            max={1}
                            step={0.01}
                            onValueChange={handleVolumeChange}
                        >
                            <Slider.Track className="bg-gray-600 relative grow rounded-full h-[4px]">
                                <Slider.Range className="absolute bg-indigo-500 rounded-full h-full"/>
                            </Slider.Track>
                            <Slider.Thumb className="block w-3 h-3 bg-indigo-500 rounded-full"/>
                        </Slider.Root>

                        <button onClick={toggleFullscreen} className="text-white hover:text-indigo-400 transition">
                            {isFullscreen ? <FaCompress size={18}/> : <FaExpand size={18}/>}
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-white">{selectedVideo.snippet.title}</h2>
                    <div className="flex flex-wrap gap-2 text-sm text-indigo-400">
                        {selectedVideo.snippet.tags?.slice(0, 5).map((tag, idx) => (
                            <span key={idx}>#{tag.replace(/\s+/g, '_')}</span>
                        ))}
                    </div>
                    <p className="text-gray-300">
                        {expanded || selectedVideo.snippet.description.length <= 150 ? (
                            <div>
                                {selectedVideo.snippet.description}
                                {selectedVideo.snippet.description.length > 150 && (
                                    <span className="text-blue-400 cursor-pointer ml-1"
                                          onClick={() => setExpanded(false)}>
                    Show less
                  </span>
                                )}
                            </div>
                        ) : (
                            <div>
                                {selectedVideo.snippet.description.slice(0, 150)}...
                                <span className="text-blue-400 cursor-pointer ml-1" onClick={() => setExpanded(true)}>
                  Show more
                </span>
                            </div>
                        )}
                    </p>
                    <p className="text-indigo-400">{selectedVideo.snippet.channelTitle}</p>
                </div>

                <div className="flex items-center justify-between text-gray-400">
                    <div className="flex items-center gap-2">
                        <FaEye size={18} className="text-indigo-500"/>
                        <span>{viewCount} views</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {isLiked ? (
                            <FaThumbsUp size={18} className="text-indigo-500" onClick={() => setIsLiked(false)}/>
                        ) : (
                            <FaRegThumbsUp size={18} className="text-indigo-500" onClick={() => setIsLiked(true)}/>
                        )}
                        <span>{likeCount} likes</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoPlayer
