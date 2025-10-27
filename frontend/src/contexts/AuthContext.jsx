// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../lib/axios'
import { STORAGE_TOKEN_KEY } from '../config/constants'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(() => localStorage.getItem(STORAGE_TOKEN_KEY) || '')
    const [loading, setLoading] = useState(true) // chờ khôi phục phiên

    // Khôi phục phiên khi F5: nếu đã có token -> gọi /me
    useEffect(() => {
        async function restore() {
            if (!token) {
                setLoading(false)
                return
            }
            try {
                const res = await api.get('/api/me')
                setUser(res.data.user)
            } catch (e) {
                // token có vấn đề -> xóa
                localStorage.removeItem(STORAGE_TOKEN_KEY)
                setToken('')
                setUser(null)
            } finally {
                setLoading(false)
            }
        }
        restore()
    }, [token])

    // Đăng ký
    async function register(payload) {
        // payload: { name, email, password, password_confirmation, role? }
        const res = await api.post('/api/register', payload)
        // Sau đăng ký, bạn có thể tự động chuyển sang /login
        return res.data
    }

    // Đăng nhập
    async function login({ email, password }) {
        const res = await api.post('/api/login', { email, password })
        const t = res.data.token
        localStorage.setItem(STORAGE_TOKEN_KEY, t)
        setToken(t)
        setUser(res.data.user)
        return res.data
    }

    // Lấy lại thông tin user (khi cần)
    async function fetchMe() {
        const res = await api.get('/api/me')
        setUser(res.data.user)
        return res.data.user
    }

    // Đăng xuất
    async function logout() {
        try {
            await api.post('/api/logout')
        } catch (_) {
            // ignore lỗi mạng
        }
        localStorage.removeItem(STORAGE_TOKEN_KEY)
        setToken('')
        setUser(null)
        navigate('/login')
    }

    const value = { user, token, loading, login, register, logout, fetchMe }
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    return useContext(AuthContext)
}
