import React, { useState, useRef, useEffect } from 'react';
import { useVideo } from '../context/VideoContext';
import ReactPlayer from 'react-player';
import * as Slider from '@radix-ui/react-slider';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward
} from 'lucide-react';
import { formatDuration } from '../utils/formatters';
import Button from './ui/Button';

const VideoPlayer: React.FC = () => {
  const { selectedVideo } = useVideo();
  const playerRef = useRef<ReactPlayer>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setIsMuted(value[0] === 0);
  };

  const handleSeekChange = (value: number[]) => {
    setPlayed(value[0]);
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekMouseUp = (value: number[]) => {
    setSeeking(false);
    if (playerRef.current) {
      playerRef.current.seekTo(value[0]);
    }
  };

  const handleProgress = (state: { played: number }) => {
    if (!seeking) {
      setPlayed(state.played);
    }
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleSkip = (direction: 'forward' | 'backward') => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      const skipAmount = direction === 'forward' ? 10 : -10;
      playerRef.current.seekTo(currentTime + skipAmount);
    }
  };

  const toggleFullscreen = () => {
    const element = document.getElementById('player-wrapper');
    if (element) {
      if (!document.fullscreenElement) {
        element.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'ArrowLeft':
          handleSkip('backward');
          break;
        case 'ArrowRight':
          handleSkip('forward');
          break;
        case 'KeyM':
          toggleMute();
          break;
        case 'KeyF':
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!selectedVideo) {
    return (
      <div className="aspect-video bg-card rounded-lg flex items-center justify-center">
        <p className="text-gray-400">Select a video to play</p>
      </div>
    );
  }

  const videoId = typeof selectedVideo.id === 'string' ? selectedVideo.id : selectedVideo.id.videoId;

  return (
    <div id="player-wrapper" className="bg-card rounded-lg overflow-hidden">
      <div className="aspect-video relative">
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
          className="absolute top-0 left-0"
        />
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-2">

          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            value={[played]}
            max={1}
            step={0.001}
            onValueChange={handleSeekChange}
            onPointerDown={handleSeekMouseDown}
            onPointerUp={() => handleSeekMouseUp([played])}
          >
            <Slider.Track className="bg-gray-700 relative grow rounded-full h-[3px]">
              <Slider.Range className="absolute bg-primary rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb
              className="block w-4 h-4 bg-primary rounded-full hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary-light"
              aria-label="Volume"
            />
          </Slider.Root>

          <div className="flex justify-between text-xs text-gray-400">
            <span>{formatDuration(played * duration)}</span>
            <span>{formatDuration(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => handleSkip('backward')}
              className="p-2"
            >
              <SkipBack size={20} />
            </Button>

            <Button
              variant="ghost"
              onClick={handlePlayPause}
              className="p-2"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </Button>

            <Button
              variant="ghost"
              onClick={() => handleSkip('forward')}
              className="p-2"
            >
              <SkipForward size={20} />
            </Button>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={toggleMute}
                className="p-2"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </Button>

              <Slider.Root
                className="relative flex items-center select-none touch-none w-24 h-5"
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
              >
                <Slider.Track className="bg-gray-700 relative grow rounded-full h-[3px]">
                  <Slider.Range className="absolute bg-primary rounded-full h-full" />
                </Slider.Track>
                <Slider.Thumb
                  className="block w-3 h-3 bg-primary rounded-full hover:bg-primary-light focus:outline-none"
                  aria-label="Volume"
                />
              </Slider.Root>
            </div>
          </div>

          <Button
            variant="ghost"
            onClick={toggleFullscreen}
            className="p-2"
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </Button>
        </div>

        {/* Video Info */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-white">
            {selectedVideo.snippet.title}
          </h2>
          <p className="text-gray-400">
            {selectedVideo.snippet.channelTitle}
          </p>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;