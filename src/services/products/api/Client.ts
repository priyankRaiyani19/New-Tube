import axios from "axios";

const API_KEY = 'AIzaSyAHWqMYjoeWtPO6TDnjHagPJ2nbe_x7KiI';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    params: {
        key: API_KEY,
        part: 'snippet,statistics',
        maxResults: 15,
    },
});