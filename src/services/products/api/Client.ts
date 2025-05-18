import axios from "axios";

const API_KEY = 'AIzaSyAYczYJhbB6_pkwy7va2Dm6S3BcGcZrAMo';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    params: {
        key: API_KEY,
        part: 'snippet,statistics',
        maxResults: 12,
    },
});