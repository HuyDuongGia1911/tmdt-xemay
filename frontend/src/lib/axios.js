import axios from 'axios'
import { STORAGE_TOKEN_KEY } from '../config/constants'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem(STORAGE_TOKEN_KEY)
    if (token) config.headers.Authorization = `Bearer ${token}`
    if (!config.headers['Content-Type']) config.headers['Content-Type'] = 'application/json'
    return config
})

api.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error?.response?.status === 401) {
            // Sẽ xử lý ở Phần 11 (logout/redirect)
        }
        return Promise.reject(error)
    }
)

export default api
