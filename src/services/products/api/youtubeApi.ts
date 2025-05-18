
import { YouTubeSearchResponse } from '../../../types/video.ts';
import {axiosInstance} from "./Client.ts";


export const fetchTrendingVideos = async (videoCategoryId?: string): Promise<YouTubeSearchResponse> => {
  try {
    const params: Record<string, string | number> = {
      chart: 'mostPopular',
    };

    if (videoCategoryId) {
      params.videoCategoryId = videoCategoryId;
    }

    const response = await axiosInstance.get('/videos', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching trending videos:', error);
    throw error;
  }
};

export const searchVideos = async (query: string): Promise<YouTubeSearchResponse> => {
  try {
    const response = await axiosInstance.get('/search', {
      params: {
        q: query,
        part: 'snippet',
        type: 'video',
      },
    });

    if (response.data.items.length > 0) {
      const videoIds = response.data.items.map(
        (item: any) => typeof item.id === 'string' ? item.id : item.id.videoId
      ).join(',');

      const detailsResponse = await axiosInstance.get('/videos', {
        params: {
          id: videoIds,
          part: 'snippet,statistics',
        },
      });

      const itemsWithStats = detailsResponse.data.items.map((item: any) => {
        const searchItem = response.data.items.find((si: any) => 
          (typeof si.id === 'string' ? si.id : si.id.videoId) === item.id
        );
        return {
          ...item,
          id: item.id,
          snippet: item.snippet,
          statistics: item.statistics,
        };
      });

      return {
        ...response.data,
        items: itemsWithStats,
      };
    }

    return response.data;
  } catch (error) {
    console.error('Error searching videos:', error);
    throw error;
  }
};

export const fetchTrendingMusicVideos = async (): Promise<YouTubeSearchResponse> => {
  return fetchTrendingVideos('10');
};

export const getVideoById = async (videoId: string) => {
  try {
    const response = await axiosInstance.get('/videos', {
      params: {
        id: videoId,
        part: 'snippet,statistics',
      },
    });
    return response.data.items[0];
  } catch (error) {
    console.error('Error fetching video details:', error);
    throw error;
  }
};

export default {
  fetchTrendingVideos,
  fetchTrendingMusicVideos,
  searchVideos,
  getVideoById,
};