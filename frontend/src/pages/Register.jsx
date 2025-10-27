import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../lib/axios'

export default function Register() {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'buyer', // Mặc định buyer; backend sẽ chặn admin
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    function onChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function onSubmit(e) {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await api.post('/api/register', form)
            // Đăng ký xong -> chuyển sang trang đăng nhập
            navigate('/login')
        } catch (err) {
            setError(err?.response?.data?.message || 'Đăng ký thất bại')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
            <h1 className="text-2xl font-bold mb-4">Đăng ký</h1>
            {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
            <form onSubmit={onSubmit} className="space-y-3">
                <div>
                    <label className="block text-sm">Họ tên</label>
                    <input
                        type="text"
                        name="name"
                        className="w-full border rounded p-2"
                        value={form.name}
                        onChange={onChange}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm">Email</label>
                    <input
                        type="email"
                        name="email"
                        className="w-full border rounded p-2"
                        value={form.email}
                        onChange={onChange}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm">Mật khẩu</label>
                    <input
                        type="password"
                        name="password"
                        className="w-full border rounded p-2"
                        value={form.password}
                        onChange={onChange}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm">Nhập lại mật khẩu</label>
                    <input
                        type="password"
                        name="password_confirmation"
                        className="w-full border rounded p-2"
                        value={form.password_confirmation}
                        onChange={onChange}
                        required
                    />
                </div>

                {/* (Tùy chọn) Cho phép chọn role buyer/seller trong demo */}
                <div>
                    <label className="block text-sm">Vai trò</label>
                    <select
                        name="role"
                        className="w-full border rounded p-2"
                        value={form.role}
                        onChange={onChange}
                    >
                        <option value="buyer">Buyer</option>
                        <option value="seller">Seller</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 rounded-lg bg-gray-900 text-white hover:opacity-90 disabled:opacity-60"
                >
                    {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                </button>
            </form>

            <p className="text-sm mt-3">
                Đã có tài khoản? <Link className="text-blue-600" to="/login">Đăng nhập</Link>
            </p>
        </div>
    )
}
