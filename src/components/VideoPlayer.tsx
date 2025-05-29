import React, {useEffect, useRef, useState} from 'react'
import {useVideo} from '../context/VideoContext'
import ReactPlayer from 'react-player'
import * as Slider from '@radix-ui/react-slider'
import {
    FaBackward,
    FaForward,
    FaPause,
    FaPlay,
    FaStepBackward,
    FaStepForward,
    FaVolumeMute,
    FaVolumeUp,
} from 'react-icons/fa'
import cdimag from "../assets/cd.png";


const VideoPlayer: React.FC = () => {
    const {queue,currentIndex ,selectedVideo, playPrevious, playNext} = useVideo()
    const playerRef = useRef<ReactPlayer>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [volume, setVolume] = useState(0.7)
    const [isMuted, setIsMuted] = useState(true)
    const [played, setPlayed] = useState(0)
    const [duration, setDuration] = useState(0)
    const [seeking, setSeeking] = useState(false)
    const [isSpeedBoost, setIsSpeedBoost] = useState(false)
    const isSpaceHeld = useRef(false)

    useEffect(() => {
        if (selectedVideo) {
            setPlayed(0)
            setIsPlaying(true)
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
            }).catch(() => {
            })
        } else {
            document.exitFullscreen().then(() => {
                if (screen?.orientation && screen?.orientation?.unlock) {
                    screen?.orientation.unlock()
                }
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
            <div className="h-full text-white flex items-center justify-center w-full">
                Select a video to play
            </div>
        )
    }


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
    console.log("this is thumnail",selectedVideo?.snippet?.thumbnails)
    return (
        <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-lg w-full flex" id="player-wrapper">
            <div id="player" className="hidden w-full">
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

            <img
                src={selectedVideo?.snippet?.thumbnails?.medium?.url || cdimag}
                alt=""
                className=" bg-black/50  "
            />
            <div className="p-6 space-y-3 bg-black/50 shadow-lg min-w-[100vw]">
                <h2 className="text-2xl font-bold text-white">{selectedVideo?.snippet.title}</h2>
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
                <div className="flex items-center justify-between  ">
                    <div className="flex items-center gap-2 text-white ">
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

                    <div className="flex items-center gap-4 w-full">
                        <button onClick={toggleMute} className="text-white hover:text-primary transition">
                            {isMuted ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}
                        </button>
                        <Slider.Root
                            className="relative flex items-center w-[10vw]    h-3"
                            value={[isMuted ? 0 : volume]}
                            max={1}
                            step={0.01}
                            onValueChange={handleVolumeChange}
                        >
                            <Slider.Track className="relative w-full h-2 bg-white/30 rounded-full overflow-hidden shadow-inner ">
                                <Slider.Range className="absolute h-full bg-primary-dark rounded-full animate-[glow_2s_infinite]" />
                            </Slider.Track>
                        </Slider.Root>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoPlayer;