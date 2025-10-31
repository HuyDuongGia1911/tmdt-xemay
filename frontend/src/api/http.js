import axios from 'axios';

const raw = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
// Bảo đảm luôn có /api ở cuối, kể cả khi .env thiếu
const baseURL = raw.endsWith('/api') ? raw : raw.replace(/\/+$/, '') + '/api';

const http = axios.create({ baseURL });

http.interceptors.request.use((config) => {
    const token = localStorage.getItem('tmdt_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

http.interceptors.response.use(
    (res) => res,
    (err) => Promise.reject(err)
);

export default http;
