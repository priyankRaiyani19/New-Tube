import React, {useEffect, useRef, useState} from 'react';
import {useVideo} from '../context/VideoContext';
import ReactPlayer from 'react-player';
import * as Slider from '@radix-ui/react-slider';
import {Maximize, Minimize, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX} from 'lucide-react';
import {formatDuration, formatViewCount} from '../utils/formatters';
import Button from './ui/Button';
import {IoEyeSharp} from "react-icons/io5";
import {BiLike, BiSolidLike} from "react-icons/bi";

const VideoPlayer: React.FC = () => {
    const {selectedVideo} = useVideo();
    const playerRef = useRef<ReactPlayer>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.7);
    const [isMuted, setIsMuted] = useState(false);
    const [played, setPlayed] = useState(0);
    const [duration, setDuration] = useState(0);
    const [seeking, setSeeking] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isSpeedBoost, setIsSpeedBoost] = useState(false);
    const isSpaceHeld = useRef(false);

    const handlePlayPause = () => {
        setIsPlaying(prev => !prev);
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
        setIsMuted(prev => !prev);
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
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                if (!isSpaceHeld.current) {
                    isSpaceHeld.current = true;
                    if (playerRef.current) {
                        const playbackRate = playerRef.current.getInternalPlayer()?.playbackRate;
                        if (playbackRate !== 2) {
                            playerRef.current.getInternalPlayer().playbackRate = 2;
                            setIsSpeedBoost(true);
                        }
                    }
                }
            }

            switch (e.code) {
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

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                isSpaceHeld.current
                    ? (isSpaceHeld.current = false)
                    : (
                        playerRef.current && (playerRef.current.getInternalPlayer().playbackRate = 1),
                            setIsSpeedBoost(false),
                            e.preventDefault(),
                            handlePlayPause()
                    );
            }
        }


        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);


    if (!selectedVideo) {
        return (
            <div className="aspect-video bg-card rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Select a video to play</p>
            </div>
        );
    }

    const viewCount = selectedVideo.statistics?.viewCount ? formatViewCount(parseInt(selectedVideo.statistics.viewCount)) : '';
    const likeCount = selectedVideo.statistics?.likeCount ? formatViewCount(parseInt(selectedVideo.statistics.likeCount)) : '';
    const videoId = typeof selectedVideo.id === 'string' ? selectedVideo.id : selectedVideo.id.videoId;

    return (
        <div id="player-wrapper" className="bg-card rounded-lg overflow-hidden ">
            <div className="aspect-video max-w-full md:max-w-[65vw]">
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
                    className="top-0 left-0"
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
                            <Slider.Range className="absolute bg-primary rounded-full h-full"/>
                        </Slider.Track>
                        <Slider.Thumb
                            className="block w-4 h-4 bg-primary rounded-full hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary-light"
                            aria-label="Seek"
                        />
                    </Slider.Root>

                    <div className="flex justify-between text-xs text-gray-400">
                        <span>{formatDuration(played * duration)}</span>
                        <span>{formatDuration(duration)}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" onClick={() => handleSkip('backward')} className="p-2">
                            <SkipBack size={20}/>
                        </Button>

                        <Button variant="ghost" onClick={handlePlayPause} className="p-2">
                            {isPlaying ? <Pause size={20}/> : <Play size={20}/>}
                        </Button>

                        <Button variant="ghost" onClick={() => handleSkip('forward')} className="p-2">
                            <SkipForward size={20}/>
                        </Button>

                        <div className="flex items-center space-x-2">
                            <Button variant="ghost" onClick={toggleMute} className="p-2">
                                {isMuted ? <VolumeX size={20}/> : <Volume2 size={20}/>}
                            </Button>

                            <Slider.Root
                                className="relative flex items-center select-none touch-none w-24 h-5"
                                value={[isMuted ? 0 : volume]}
                                max={1}
                                step={0.01}
                                onValueChange={handleVolumeChange}
                            >
                                <Slider.Track className="bg-gray-700 relative grow rounded-full h-[3px]">
                                    <Slider.Range className="absolute bg-primary rounded-full h-full"/>
                                </Slider.Track>
                                <Slider.Thumb
                                    className="block w-3 h-3 bg-primary rounded-full hover:bg-primary-light focus:outline-none"
                                    aria-label="Volume"
                                />
                            </Slider.Root>
                        </div>
                    </div>

                    <Button variant="ghost" onClick={toggleFullscreen} className="p-2">
                        {isFullscreen ? <Minimize size={20}/> : <Maximize size={20}/>}
                    </Button>
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">{selectedVideo.snippet.title}</h2>
                    <div className="flex gap-2 text-primary-light max-h-4">
                        {selectedVideo?.snippet?.tags?.slice(0, 6).map((tag, index) => (
                            <div key={index}>#{tag.replace(/\s+/g, '_')}</div>
                        ))}
                    </div>
                    <p className="text-white">{selectedVideo.snippet.description}</p>
                    <p className="text-primary/80 text-lg">{selectedVideo.snippet.channelTitle}</p>
                </div>

                <div className="text-gray-400 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <IoEyeSharp size={24} className="text-primary"/>
                        <p>{viewCount} Views</p>
                    </div>

                    <div className="flex items-center gap-2">
                        {!isLiked ? (
                            <BiLike size={24} className="text-primary" onClick={() => setIsLiked(true)}/>
                        ) : (
                            <BiSolidLike size={24} className="text-primary" onClick={() => setIsLiked(false)}/>
                        )}
                        <p>{likeCount} likes</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VideoPlayer;
