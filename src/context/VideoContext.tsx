import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Video } from '../types/video';

interface VideoContextType {
  selectedVideo: Video | null;
  setSelectedVideo: (video: Video | null) => void;
  isPlayerOpen: boolean;
  setIsPlayerOpen: (open: boolean) => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const value = {
    selectedVideo,
    setSelectedVideo,
    isPlayerOpen,
    setIsPlayerOpen,
  };

  return <VideoContext.Provider value={value}>{children}</VideoContext.Provider>;
};

export const useVideo = (): VideoContextType => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};