import {useInfiniteQuery, useQuery} from 'react-query';
import {fetchTrendingVideos, fetchVideoCategories, searchVideos,} from '../services/products/api/youtubeApi.ts';

export const useTrendingVideos = (videoCategoryId?: string) => {
    return useInfiniteQuery({
        queryKey: ['trendingVideos', videoCategoryId],
        queryFn: ({pageParam}) => fetchTrendingVideos({pageParam, videoCategoryId}),
        getNextPageParam: (lastPage) => lastPage.nextPageToken,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });
};
export const useSearchVideos = (query: string) => {
    return useInfiniteQuery(
        ['searchVideos', query],
        ({pageParam = ''}) => searchVideos(query, pageParam),
        {
            enabled: !!query && query.length > 1,
            getNextPageParam: (lastPage) => lastPage.nextPageToken || undefined,
            staleTime: 1000 * 60 * 1,
        }
    );
};

export const useVideoCategories = () => {
    return useQuery(['videoCategories'], fetchVideoCategories, {
        staleTime: 1000 * 60 * 60,
    });
};
