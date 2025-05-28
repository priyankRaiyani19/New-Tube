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
    const {queue,currentIndex ,selectedVideo, playPrevious, playNext} = useVideo()
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

    useEffect(() => {
        if (selectedVideo) {
            setPlayed(0)
            setIsPlaying(true)
            setExpanded(false)
        }
    }, [selectedVideo])

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
    }

    const handleDuration = (duration: number) => setDuration(duration)
    const toggleMute = () => setIsMuted(prev => !prev)

    const handleSkip = (dir: 'forward' | 'backward') => {
        if (!playerRef.current) return
        const time = playerRef.current.getCurrentTime()
        playerRef.current.seekTo(time + (dir === 'forward' ? 10 : -10))
    }

    function previousVideo() {
        playPrevious()
        setIsPlaying(true)
    }

    function nextVideo() {
        playNext()
        setIsPlaying(true)
    }

    const handlePlayPause = () => setIsPlaying(prev => !prev)
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    const handleEnded = () => (currentIndex + 1 < queue.length ? playNext() : handlePause())


    const toggleFullscreen = () => {
        const element = document.getElementById('player-wrapper')
        if (!element) return
        if (!document?.fullscreenElement) {
            element.requestFullscreen().then(() => {
                if (screen?.orientation && screen?.orientation?.lock) {
                    screen?.orientation?.lock('landscape').catch(() => {
                    })
                }
                setIsFullscreen(true)
            }).catch(() => {
            })
        } else {
            document.exitFullscreen().then(() => {
                if (screen?.orientation && screen?.orientation?.unlock) {
                    screen?.orientation.unlock()
                }
                setIsFullscreen(false)
            }).catch(() => {
            })
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

    const viewCount = formatViewCount(parseInt(selectedVideo.statistics?.viewCount ?? '0'))
    const likeCount = formatViewCount(parseInt(selectedVideo.statistics?.likeCount ?? '0'))
    const videoId = typeof selectedVideo.id === 'string' ? selectedVideo.id : selectedVideo.id.videoId

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const ControlButtons = [
        {key: 'previous', icon: <FaStepBackward size={18}/>, onClick: previousVideo},
        {key: 'skip-backward', icon: <FaBackward size={18}/>, onClick: () => handleSkip('backward')},
        {key: 'play-pause', icon: isPlaying ? <FaPause size={18}/> : <FaPlay size={18}/>, onClick: handlePlayPause},
        {key: 'skip-forward', icon: <FaForward size={18}/>, onClick: () => handleSkip('forward')},
        {key: 'next', icon: <FaStepForward size={18}/>, onClick: nextVideo}
    ]
    const url =`https://www.youtube.com/watch?v=${videoId}`

    return (
        <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-lg" id="player-wrapper">
            <div id="player" className="aspect-video">
                <ReactPlayer
                    ref={playerRef}
                    url={url}
                    width="100%"
                    height="100%"
                    playing={isPlaying}
                    volume={volume}
                    muted={isMuted}
                    onProgress={handleProgress}
                    onDuration={handleDuration}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onEnded={handleEnded}
                    playbackRate={isSpeedBoost ? 2 : 1}
                    controls={false}
           pip={true}
                />
            </div>
            <div className="p-6 space-y-6 bg-black/50 shadow-lg">
                <Slider.Root
                    className="relative flex items-center w-full h-6 group"
                    value={[played]}
                    max={1}
                    step={0.001}
                    onValueChange={handleSeekChange}
                    onPointerDown={handleSeekMouseDown}
                    onPointerUp={() => handleSeekMouseUp([played])}
                >
                    <Slider.Track className="relative w-full h-2 bg-white/30 rounded-full overflow-hidden shadow-inner ">
                        <Slider.Range className="absolute h-full bg-primary-dark rounded-full animate-[glow_2s_infinite]" />
                    </Slider.Track>
                   </Slider.Root>




                <div className="flex justify-between text-sm text-primary-dark">
                    <span>{formatTime(played * duration)}</span>
                    <span>{formatTime(duration)}</span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-white ">
                        {ControlButtons.map((button) => (
                            <button
                                key={button.key}
                                onClick={button.onClick}
                                className="p-2 rounded-full hover:bg-primary-dark hover:text-primary transition"
                            >
                                {button.icon}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={toggleMute} className="text-white hover:text-primary transition">
                            {isMuted ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}
                        </button>
                        <Slider.Root
                            className="relative flex items-center w-24 h-3"
                            value={[isMuted ? 0 : volume]}
                            max={1}
                            step={0.01}
                            onValueChange={handleVolumeChange}
                        >
                            <Slider.Track className="relative w-full h-2 bg-white/30 rounded-full overflow-hidden shadow-inner ">
                                <Slider.Range className="absolute h-full bg-primary-dark rounded-full animate-[glow_2s_infinite]" />
                            </Slider.Track>


                        </Slider.Root>

                        <button onClick={toggleFullscreen} className="text-white hover:text-indigo-400 transition">
                            {isFullscreen ? <FaExpand size={18} />  : <FaCompress size={18} />}
                        </button>
                    </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-gray-700">
                    <h2 className="text-2xl font-bold text-white leading-snug">{selectedVideo.snippet.title}</h2>
                    <div className="flex flex-wrap gap-2 text-sm text-primary-dark ">
                        {selectedVideo.snippet.tags?.slice(0, 5).map((tag, idx) => (
                            <span key={idx} className="hover:underline cursor-pointer">#{tag.replace(/\s+/g, '_')}</span>
                        ))}
                    </div>
                    <p className="text-gray-300">
                        {expanded || selectedVideo.snippet.description.length <= 150 ? (
                            <div>
                                {selectedVideo.snippet.description}
                                {selectedVideo.snippet.description.length > 150 && (
                                    <span
                                        className="text-primary-dark cursor-pointer ml-1 hover:underline"
                                        onClick={() => {
                                            setExpanded(false)
                                            const targetElement = document.getElementById("player")
                                            if (targetElement) {
                                                targetElement.scrollIntoView({ behavior: 'smooth' })
                                            }
                                        }}
                                    >
              Show less
            </span>
                                )}
                            </div>
                        ) : (
                            <div>
                                {selectedVideo.snippet.description.slice(0, 150)}...
                                <span
                                    className="text-primary-dark cursor-pointer ml-1 hover:underline"
                                    onClick={() => setExpanded(true)}
                                >
            Show more
          </span>
                            </div>
                        )}
                    </p>
                    <p className="text-primary-dark font-medium">{selectedVideo.snippet.channelTitle}</p>
                </div>

                <div className="flex items-center justify-between text-gray-400 pt-4 border-t border-gray-700">
                    <div className="flex items-center gap-2">
                        <FaEye size={18} className="text-primary-dark" />
                        <span>{viewCount} views</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {isLiked ? (
                            <FaThumbsUp size={18} className="text-primary-dark cursor-pointer" onClick={() => setIsLiked(false)} />
                        ) : (
                            <FaRegThumbsUp size={18} className="text-primary-dark cursor-pointer" onClick={() => setIsLiked(true)} />
                        )}
                        <span>{likeCount} likes</span>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default VideoPlayer;