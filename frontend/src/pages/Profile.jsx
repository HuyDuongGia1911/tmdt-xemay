import React from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Profile() {
    const { user } = useAuth()
    if (!user) return null

    return (
        <div className="bg-white p-6 rounded-xl shadow">
            <h1 className="text-2xl font-bold mb-4">Hồ sơ cá nhân</h1>
            <div className="space-y-1">
                <div><span className="font-medium">ID:</span> {user.id}</div>
                <div><span className="font-medium">Họ tên:</span> {user.name}</div>
                <div><span className="font-medium">Email:</span> {user.email}</div>
                <div><span className="font-medium">Vai trò:</span> {user.role}</div>
            </div>
        </div>
    )
}
