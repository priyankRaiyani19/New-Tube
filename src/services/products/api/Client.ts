import axios from "axios";

// 1

const API_KEY = 'AIzaSyAHWqMYjoeWtPO6TDnjHagPJ2nbe_x7KiI';

// 2
// const API_KEY = 'AIzaSyD3pPfTZ5-TDBc42AQGF52LwZJm2vChins';

const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    params: {
        key: API_KEY,
        part: 'snippet,statistics',
        maxResults: 15,
    },
});