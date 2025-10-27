import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: '' })
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
            await login(form)
            navigate('/profile')
        } catch (err) {
            setError(err?.response?.data?.message || 'Đăng nhập thất bại')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
            <h1 className="text-2xl font-bold mb-4">Đăng nhập</h1>
            {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
            <form onSubmit={onSubmit} className="space-y-3">
                <div>
                    <label className="block text-sm">Email</label>
                    <input
                        type="email"
                        name="email"
                        className="w-full border rounded p-2"
                        placeholder="you@example.com"
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
                        placeholder="••••••"
                        value={form.password}
                        onChange={onChange}
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 rounded-lg bg-gray-900 text-white hover:opacity-90 disabled:opacity-60"
                >
                    {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
            </form>

            <p className="text-sm mt-3">
                Chưa có tài khoản? <Link className="text-blue-600" to="/register">Đăng ký</Link>
            </p>
        </div>
    )
}
