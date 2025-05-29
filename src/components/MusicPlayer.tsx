import { useEffect, useRef, useState, useCallback } from "react"
import YouTube, { YouTubePlayer, YouTubeEvent } from "react-youtube"
import * as Slider from "@radix-ui/react-slider"
import {
  FaBackward,
  FaForward,
  FaPause,
  FaPlay,
  FaStepBackward,
  FaStepForward,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa"
import { useVideo } from "../context/VideoContext"
import cdimag from "../assets/cd.png"

const MusicPlayer = () => {
  const { selectedVideo, playNext, playPrevious } = useVideo()
  const playerRef = useRef<YouTubePlayer | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(70)
  const [isMuted, setIsMuted] = useState(true)
  const [played, setPlayed] = useState(0)
  const [duration, setDuration] = useState(0)
  const [seeking, setSeeking] = useState(false)

  useEffect(() => {
    if (isPlaying && playerRef.current) {
      intervalRef.current = setInterval(async () => {
        if (!seeking && playerRef.current) {
          const currentTime = await playerRef.current.getCurrentTime()
          const totalDuration = await playerRef.current.getDuration()
          setPlayed(currentTime / totalDuration)
          setDuration(totalDuration)
        }
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, seeking])

  useEffect(() => {
    if (playerRef.current && selectedVideo) {
      playerRef.current.loadVideoById(selectedVideo.id)
      setIsPlaying(true)
    }
  }, [selectedVideo])

  const handleReady = (event: YouTubeEvent) => {
    playerRef.current = event.target
    playerRef.current.setVolume(volume)
    playerRef.current.getDuration().then(setDuration)
  }

  const handlePlayPause = useCallback(() => {
    if (!playerRef.current) return
    const method = isPlaying ? "pauseVideo" : "playVideo"
    playerRef.current[method]()
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  const handleSkip = useCallback(async (dir: "forward" | "backward") => {
    if (!playerRef.current) return
    const currentTime = await playerRef.current.getCurrentTime()
    const offset = dir === "forward" ? 10 : -10
    playerRef.current.seekTo(currentTime + offset, true)
  }, [])

  const handleSeekChange = useCallback((value: number[]) => {
    setPlayed(value[0])
  }, [])

  const handleSeekMouseDown = useCallback(() => setSeeking(true), [])

  const handleSeekMouseUp = useCallback((value: number[]) => {
    setSeeking(false)
    if (playerRef.current && duration) {
      playerRef.current.seekTo(value[0] * duration, true)
    }
  }, [duration])

  const handleVolumeChange = useCallback((value: number[]) => {
    const newVolume = value[0] * 100
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
    playerRef.current?.setVolume(newVolume)
  }, [])

  const toggleMute = useCallback(() => {
    const newMuted = !isMuted
    setIsMuted(newMuted)
    if (newMuted) playerRef.current?.mute()
    else playerRef.current?.unMute()
  }, [isMuted])

  const handleEnd = useCallback(() => playNext(), [playNext])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.code) {
      case "Space":
        e.preventDefault()
        handlePlayPause()
        break
      case "ArrowLeft":
        handleSkip("backward")
        break
      case "ArrowRight":
        handleSkip("forward")
        break
      case "ArrowUp":
        setVolume(v => {
          const newVol = Math.min(100, v + 10)
          playerRef.current?.setVolume(newVol)
          setIsMuted(newVol === 0)
          return newVol
        })
        break
      case "ArrowDown":
        setVolume(v => {
          const newVol = Math.max(0, v - 10)
          playerRef.current?.setVolume(newVol)
          setIsMuted(newVol === 0)
          return newVol
        })
        break
      case "KeyM":
        toggleMute()
        break
      case "KeyN":
        playNext()
        break
      case "KeyP":
        playPrevious()
        break
    }
  }, [handlePlayPause, handleSkip, toggleMute, playNext, playPrevious])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  const youtubeOpts = {
    width: "100%",
    height: "0",
    playerVars: { autoplay: 0, controls: 0 },
  }

  return (
      <div className="flex gap-4 w-full bg-zinc-900 text-white p-3 rounded-xl space-y-6 mx-auto shadow-lg">
        <img
            src={selectedVideo?.snippet?.thumbnails?.medium?.url || cdimag}
            alt=""
            className="bg-black/50 max-h-40"
        />
        <div className="flex flex-col w-full gap-4">
          <h2 className="text-2xl font-bold text-white">{selectedVideo?.snippet.title}</h2>

          {selectedVideo && (
              <YouTube
                  videoId={selectedVideo.id}
                  opts={youtubeOpts}
                  onReady={handleReady}
                  onEnd={handleEnd}
              />
          )}

          <Slider.Root
              className="relative flex items-center w-full h-6 group"
              value={[played]}
              max={1}
              step={0.001}
              onValueChange={handleSeekChange}
              onPointerDown={handleSeekMouseDown}
              onPointerUp={() => handleSeekMouseUp([played])}
          >
            <Slider.Track className="relative w-full h-2 bg-white/30 rounded-full overflow-hidden shadow-inner">
              <Slider.Range className="absolute h-full bg-primary-dark rounded-full" />
            </Slider.Track>
          </Slider.Root>

          <div className="flex justify-between text-sm text-primary-dark">
            <span>{played && duration ? formatTime(played * duration) : "00:00"}</span>

            <div className="flex items-center gap-4 text-white">
              <button onClick={playPrevious} className="p-2 rounded-full hover:bg-primary-dark hover:text-primary transition"><FaStepBackward size={18} /></button>
              <button onClick={() => handleSkip("backward")} className="p-2 rounded-full hover:bg-primary-dark hover:text-primary transition"><FaBackward size={18} /></button>
              <button onClick={handlePlayPause} className="p-2 rounded-full hover:bg-primary-dark hover:text-primary transition">
                {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
              </button>
              <button onClick={() => handleSkip("forward")} className="p-2 rounded-full hover:bg-primary-dark hover:text-primary transition"><FaForward size={18} /></button>
              <button onClick={playNext} className="p-2 rounded-full hover:bg-primary-dark hover:text-primary transition"><FaStepForward size={18} /></button>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={toggleMute} className="text-white hover:text-primary transition">
                {isMuted ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}
              </button>
              <Slider.Root
                  className="relative flex items-center w-24 h-3"
                  value={[isMuted ? 0 : volume / 100]}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
              >
                <Slider.Track className="relative w-full h-2 bg-white/30 rounded-full overflow-hidden shadow-inner">
                  <Slider.Range className="absolute h-full bg-primary-dark rounded-full animate-[glow_2s_infinite]" />
                </Slider.Track>
              </Slider.Root>
            </div>

            <span>{duration ? formatTime(duration) : "00:00"}</span>
          </div>
        </div>
      </div>
  )
}

export default MusicPlayer
