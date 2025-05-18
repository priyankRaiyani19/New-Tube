import { useQuery } from 'react-query';
import { 
  fetchTrendingVideos, 
  fetchTrendingMusicVideos, 
  searchVideos, 
  getVideoById 
} from '../services/products/api/youtubeApi.ts';

export const useTrendingVideos = () => {
  return useQuery(
    ['trendingVideos'], 
    () => fetchTrendingVideos(),
    {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    }
  );
};
export const useSearchVideos = (query: string) => {
    return useQuery(
        ['searchVideos', query],
        () => searchVideos(query),
        {
            enabled: !!query && query.length > 1,
            staleTime: 1000 * 60 * 1,
        }
    );
};


export const useTrendingMusicVideos = () => {
  return useQuery(
    ['trendingMusicVideos'], 
    () => fetchTrendingMusicVideos(),
    {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    }
  );
};


export const useVideoDetails = (videoId: string | null) => {
  return useQuery(
    ['videoDetails', videoId],
    () => videoId ? getVideoById(videoId) : null,
    {
      enabled: !!videoId,
      staleTime: 1000 * 60 * 5,
    }
  );
};