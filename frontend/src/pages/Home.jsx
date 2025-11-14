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
                const res = await api.get('/api/categories', {
                    params: { page: 1, per_page: 20 }
                })
                const list = res.data?.data ?? res.data
                if (mounted) setCategories(list)
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
        <div className="space-y-10">

            {/* 🎯 Hero Section */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl">
                <div className="p-10">
                    <h1 className="text-4xl font-bold">Xe Máy Shop</h1>
                    <p className="mt-3 text-lg opacity-90">
                        Khám phá ngay các dòng xe nổi bật với giá tốt nhất.
                    </p>
                    <button className="mt-5 px-5 py-3 bg-white text-blue-700 rounded-xl font-semibold shadow hover:shadow-lg transition">
                        Khám phá ngay
                    </button>
                </div>
            </div>

            {/* 🎯 Danh mục */}
            <div className="">
                <h2 className="text-2xl font-bold mb-4">Danh mục nổi bật</h2>

                {loading && <p>Đang tải...</p>}
                {error && <p className="text-red-600">{error}</p>}

                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categories.map(c => (
                        <li
                            key={c.id}
                            className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-lg transition cursor-pointer"
                        >
                            <div className="font-semibold text-lg">{c.name}</div>
                            <div className="text-gray-500 text-sm">{c.slug}</div>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    )
}
