import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function RoleRoute({ roles = [], children }) {
    const { user, loading } = useAuth()

    if (loading) return <div className="p-4">Đang kiểm tra quyền truy cập...</div>
    if (!user) return <Navigate to="/login" replace />

    // Nếu không truyền roles, coi như chỉ cần đăng nhập
    if (!roles.length) return children

    if (roles.includes(user.role)) return children
    return <div className="p-4 text-red-600">403 — Bạn không có quyền truy cập trang này.</div>
}
