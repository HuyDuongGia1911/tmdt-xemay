import React, { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../lib/axios'
import Filters from '../components/Filters'
import Sidebar from '../components/Sidebar'
import MotorcycleCard from '../components/MotorcycleCard'

export default function Catalog() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [data, setData] = useState({ items: [], meta: null })
    const [categories, setCategories] = useState([])
    const [brands, setBrands] = useState([])

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Lấy tab và sort
    const tab = searchParams.get('tab') || 'all'
    const sort = searchParams.get('sort') || 'featured'

    // Collection & Brand Filter
    const category_id = searchParams.get('category_id')
    const brand_id = searchParams.get('brand_id')

    const page = searchParams.get('page') || '1'

    useEffect(() => {
        loadFilterNames()
    }, [])

    async function loadFilterNames() {
        const c = await api.get("/api/categories")
        const b = await api.get("/api/brands")
        setCategories(c.data?.data || c.data)
        setBrands(b.data?.data || b.data)
    }

    const queryObj = useMemo(() => {
        const obj = {}
        for (const [k, v] of searchParams.entries()) {
            if (v !== '' && v != null) obj[k] = v
        }
        return obj
    }, [searchParams.toString()])

    async function fetchList() {
        setLoading(true)
        setError('')
        try {
            const res = await api.get('/api/motorcycles', { params: queryObj })
            const body = res.data
            const items = body.data || body.items || []
            const meta = body.meta || null
            setData({ items, meta })
        } catch (e) {
            setError(e?.response?.data?.message || 'Lỗi tải danh sách')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchList()
    }, [searchParams.toString()])

    function gotoPage(p) {
        const next = new URLSearchParams(searchParams)
        next.set('page', String(p))
        setSearchParams(next)
    }

    function setTab(value) {
        const next = new URLSearchParams(searchParams)

        next.set('tab', value)

        if (value === 'all') next.set('sort', 'featured')
        if (value === 'new') next.set('sort', 'newest')
        if (value === 'popular') next.set('sort', 'best_selling')

        next.set('page', '1')
        setSearchParams(next)
    }

    function setSort(value) {
        const next = new URLSearchParams(searchParams)
        next.set('sort', value)
        next.set('page', '1')
        setSearchParams(next)
    }

    // ====================== HIỂN THỊ TRẠNG THÁI LỌC ======================
    const currentCategoryName =
        category_id ? (categories.find(c => c.id == category_id)?.name || "") : "Tất cả"

    const currentBrandName =
        brand_id ? (brands.find(b => b.id == brand_id)?.name || "") : "Tất cả"

    const currentSortName = {
        featured: "Nổi bật",
        best_selling: "Bán chạy nhất",
        newest: "Mới nhất",
        oldest: "Cũ nhất",
        price_asc: "Giá ↑",
        price_desc: "Giá ↓",
        name_asc: "Tên A-Z",
        name_desc: "Tên Z-A",
    }[sort] || "Nổi bật"

    const meta = data.meta || {}
    const current = Number(meta.current_page || page || 1)
    const totalPages = Number(meta.last_page || meta.total_pages || 1)

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">

            <Sidebar />

            <div>
                <h1 className="text-3xl font-bold mb-2">Danh sách sản phẩm</h1>

                <div className="text-sm text-gray-600 mb-3">
                    <b>Bộ lọc hiện tại:</b> {currentCategoryName} / {currentBrandName} / {currentSortName}
                </div>



                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 p-3 bg-white rounded-xl shadow border border-gray-200">

                    <div className="flex gap-2">
                        <button
                            onClick={() => setTab('all')}
                            className={`px-4 py-1 rounded-full border ${tab === 'all'
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'bg-white text-gray-800'
                                }`}
                        >
                            Tất cả
                        </button>

                        <button
                            onClick={() => setTab('new')}
                            className={`px-4 py-1 rounded-full border ${tab === 'new'
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'bg-white text-gray-800'
                                }`}
                        >
                            Mới nhất
                        </button>

                        <button
                            onClick={() => setTab('popular')}
                            className={`px-4 py-1 rounded-full border ${tab === 'popular'
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'bg-white text-gray-800'
                                }`}
                        >
                            Phổ biến
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Sắp xếp</span>

                        <select
                            className="border p-2 rounded-lg text-sm"
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                        >
                            <option value="featured">Nổi bật</option>
                            <option value="best_selling">Bán chạy nhất</option>
                            <option value="name_asc">Tên: A → Z</option>
                            <option value="name_desc">Tên: Z → A</option>
                            <option value="price_asc">Giá: Thấp → Cao</option>
                            <option value="price_desc">Giá: Cao → Thấp</option>
                            <option value="oldest">Cũ nhất</option>
                            <option value="newest">Mới nhất</option>
                        </select>
                    </div>
                </div>

                {loading && <div>Đang tải...</div>}
                {error && <div className="text-red-600">{error}</div>}

                {!loading && !error && (
                    <>
                        {data.items.length === 0 ? (
                            <div className="bg-white p-6 rounded-xl shadow">Không có kết quả.</div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {data.items.map((it) => <MotorcycleCard key={it.id} item={it} />)}
                            </div>
                        )}

                        {totalPages > 1 && (
                            <div className="mt-6 flex gap-2 items-center">
                                <button
                                    disabled={current <= 1}
                                    onClick={() => gotoPage(current - 1)}
                                    className="px-3 py-2 rounded bg-gray-200 disabled:opacity-50"
                                >
                                    Trước
                                </button>
                                <div>Trang {current} / {totalPages}</div>
                                <button
                                    disabled={current >= totalPages}
                                    onClick={() => gotoPage(current + 1)}

                                    className="px-3 py-2 rounded bg-gray-200 disabled:opacity-50"
                                >
                                    Sau
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
