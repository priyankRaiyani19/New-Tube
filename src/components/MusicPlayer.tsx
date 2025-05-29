import React, { useEffect, useRef, useState, useCallback } from "react";
import YouTube, { YouTubePlayer, YouTubeEvent } from "react-youtube";
import * as Slider from "@radix-ui/react-slider";
import {
  FaBackward,
  FaForward,
  FaPause,
  FaPlay,
  FaStepBackward,
  FaStepForward,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";
import { useVideo } from "../context/VideoContext";
import  cdimag from "../assets/cd.png"

const MusicPlayer = () => {
  const { selectedVideo, playNext, playPrevious } = useVideo();
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  console.log("this is selected vi",selectedVideo)
  useEffect(() => {
    if (isPlaying && playerRef.current) {
      intervalRef.current = setInterval(async () => {
        const currentTime = await playerRef.current!.getCurrentTime();
        const totalDuration = await playerRef.current!.getDuration();
        if (!seeking) {
          setPlayed(currentTime / totalDuration);
          setDuration(totalDuration);
        }
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, seeking]);

  useEffect(() => {
    if (playerRef.current && selectedVideo) {
      playerRef.current.loadVideoById(selectedVideo.id);
      setIsPlaying(true);
    }
  }, [selectedVideo]);

  const handleReady = (event: YouTubeEvent) => {
    playerRef.current = event.target;
    playerRef.current.setVolume(volume);
    setDuration(playerRef.current.getDuration());
  };

  const handlePlayPause = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  const handleSkip = async (dir: "forward" | "backward") => {
    if (!playerRef.current) return;
    const currentTime = await playerRef.current.getCurrentTime();
    const newTime = currentTime + (dir === "forward" ? 10 : -10);
    playerRef.current.seekTo(newTime, true);
  };

  const handleSeekChange = (value: number[]) => setPlayed(value[0]);

  const handleSeekMouseDown = () => setSeeking(true);

  const handleSeekMouseUp = (value: number[]) => {
    setSeeking(false);
    if (playerRef.current && duration) {
      const seekTime = value[0] * duration;
      playerRef.current.seekTo(seekTime, true);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] * 100;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    playerRef.current?.setVolume(newVolume);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEnd = () => {
    playNext();
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.code) {
      case "Space":
        e.preventDefault();
        handlePlayPause();
        break;
      case "ArrowLeft":
        handleSkip("backward");
        break;
      case "ArrowRight":
        handleSkip("forward");
        break;
      case "ArrowUp":
        setVolume((v) => {
          const newVol = Math.min(100, v + 10);
          playerRef.current?.setVolume(newVol);
          setIsMuted(newVol === 0);
          return newVol;
        });
        break;
      case "ArrowDown":
        setVolume((v) => {
          const newVol = Math.max(0, v - 10);
          playerRef.current?.setVolume(newVol);
          setIsMuted(newVol === 0);
          return newVol;
        });
        break;
      case "KeyM":
        const newMuted = !isMuted;
        setIsMuted(newMuted);
        if (newMuted) {
          playerRef.current?.mute();
        } else {
          playerRef.current?.unMute();
        }
        break;
      case "KeyN":
        playNext();
        break;
      case "KeyP":
        playPrevious();
        break;
    }
  }, [isMuted, playNext, playPrevious]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const youtubeOpts = {
    width: "100%",
    height: "0",
    playerVars: {
      autoplay: 0,
      controls: 0,
    },
  };

  const ControlButtons = [
    { key: "previous", icon: <FaStepBackward size={18} />, onClick: playPrevious },
    { key: "skip-backward", icon: <FaBackward size={18} />, onClick: () => handleSkip("backward") },
    { key: "play-pause", icon: isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />, onClick: handlePlayPause },
    { key: "skip-forward", icon: <FaForward size={18} />, onClick: () => handleSkip("forward") },
    { key: "next", icon: <FaStepForward size={18} />, onClick: playNext },
  ];

  return (
      <div className="flex gap-4 w-full  bg-zinc-900 text-white p-3 rounded-xl space-y-6  mx-auto shadow-lg">
        <img
            src={selectedVideo?.snippet?.thumbnails?.medium?.url || cdimag}
            alt=""
            className=" bg-black/50 max-h-40 "
        />
       <div className={`flex flex-col w-full gap-4`} >
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
           <span>{played && duration ? formatTime(played * duration) : '00:00'}</span>

           <div className="flex items-center gap-4 text-white">
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

           <div className="flex items-center gap-2">
             <button
                 className="text-white hover:text-primary transition"
                 onClick={() => {
                   const newMuted = !isMuted;
                   setIsMuted(newMuted);
                   if (newMuted) {
                     playerRef.current?.mute();
                   } else {
                     playerRef.current?.unMute();
                   }
                 }}
             >
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

           <span>{duration ? formatTime(duration) : '00:00'}</span>
         </div>
       </div>
      </div>
  );
};

export default MusicPlayer;
