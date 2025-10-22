import { useEffect, useState } from 'react'
import api from '../lib/axios'

export default function Home() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        let mounted = true
        async function load() {
            try {
                setLoading(true)
                setError('')
                const res = await api.get('/api/categories', { params: { page: 1, per_page: 10 } })
                const list = res.data?.data ?? res.data
                if (mounted) setCategories(Array.isArray(list) ? list : [])
            } catch (e) {
                setError(e?.response?.data?.message || e.message)
            } finally {
                if (mounted) setLoading(false)
            }
        }
        load()
        return () => { mounted = false }
    }, [])

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Danh mục</h1>
            {loading && <p>Đang tải...</p>}
            {error && <p className="text-red-600">Lỗi: {error}</p>}
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map(c => (
                    <li key={c.id} className="bg-white border rounded-xl p-4">
                        <div className="font-semibold">{c.name || c.title || `Category #${c.id}`}</div>
                        {c.slug && <div className="text-gray-500 text-sm">{c.slug}</div>}
                    </li>
                ))}
            </ul>
        </div>
    )
}
