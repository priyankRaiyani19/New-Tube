import {VideoApiProps, YouTubeSearchResponse} from '../../../types/video.ts';
import {axiosInstance} from "./Client.ts";


export const fetchTrendingVideos = async ({
                                              pageParam = '',
                                              videoCategoryId,
                                          }: VideoApiProps): Promise<YouTubeSearchResponse> => {
    const params: Record<string, string | number> = {
        chart: 'mostPopular',
        maxResults: 12,
        pageToken: pageParam,
    }

    if (videoCategoryId) {
        params.videoCategoryId = videoCategoryId
    }

    const response = await axiosInstance.get('/videos', {params})
    return response.data
}
export const searchVideos = async (
    query: string,
    pageToken: string = ''
): Promise<YouTubeSearchResponse> => {
    try {
        const response = await axiosInstance.get('/search', {
            params: {
                q: query,
                part: 'snippet',
                type: 'video',
                maxResults: 10,
                pageToken,
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
            const itemsWithStats = detailsResponse.data.items.map((item: any) => ({
                ...item,
                id: item.id,
                snippet: item.snippet,
                statistics: item.statistics,
            }));

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
export const fetchVideoCategories = async () => {
    const response = await axiosInstance.get('/videoCategories', {
        params: {
            part: 'snippet',
            regionCode: 'IN',
        },
    });
    return response.data.items.map((item: any) => item.snippet.title);
};


