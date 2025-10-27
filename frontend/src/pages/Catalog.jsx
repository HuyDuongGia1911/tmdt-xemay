// src/pages/Catalog.jsx
import React, { useEffect, useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import api from '../lib/axios'
import Filters from '../components/Filters'
import MotorcycleCard from '../components/MotorcycleCard'

export default function Catalog() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [data, setData] = useState({ items: [], meta: null })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [cacheState, setCacheState] = useState('') // đọc X-Cache

    // Đảm bảo có page mặc định
    const page = searchParams.get('page') || '1'
    useEffect(() => {
        if (!searchParams.get('page')) {
            const next = new URLSearchParams(searchParams)
            next.set('page', '1')
            setSearchParams(next, { replace: true })
        }
    }, [])

    // Chuyển searchParams thành object query
    const queryObj = useMemo(() => {
        const obj = {}
        for (const [k, v] of searchParams.entries()) {
            if (v !== '' && v != null) obj[k] = v
        }
        return obj
    }, [searchParams.toString()]) // eslint-disable-line

    async function fetchList() {
        setLoading(true); setError(''); setCacheState('')
        try {
            const res = await api.get('/api/motorcycles', { params: queryObj })
            // Backend trả về dạng { data: [...], meta: {...} }? hoặc { items, meta }?
            // Ở đây ta hỗ trợ linh hoạt:
            const body = res.data
            const items = body.data || body.items || []
            const meta = body.meta || null
            setData({ items, meta })

            // Đọc header cache (nếu backend set X-Cache)
            const xcache = res.headers?.['x-cache'] || res.headers?.['X-Cache'] || ''
            setCacheState(xcache)
        } catch (e) {
            setError(e?.response?.data?.message || 'Lỗi tải danh sách')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchList()
    }, [searchParams.toString()]) // gọi lại khi filter/page đổi

    function gotoPage(p) {
        const next = new URLSearchParams(searchParams)
        next.set('page', String(p))
        setSearchParams(next)
    }

    const meta = data.meta || {}
    const current = Number(meta.current_page || page || 1)
    const totalPages = Number(meta.last_page || meta.total_pages || 1)

    return (
        <div>
            <h1 className="text-2xl font-bold mb-3">Danh sách xe</h1>
            <Filters />
            {/* {cacheState && (
                <div className="text-sm mb-2">
                    Cache: <span className={/HIT/i.test(cacheState) ? 'text-green-600' : 'text-orange-600'}>{cacheState}</span>
                </div>
            )} */}

            {loading && <div>Đang tải...</div>}
            {error && <div className="text-red-600">{error}</div>}

            {!loading && !error && (
                <>
                    {data.items.length === 0 ? (
                        <div className="bg-white p-6 rounded-xl shadow">Không có kết quả.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {data.items.map((it) => <MotorcycleCard key={it.id} item={it} />)}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-4 flex gap-2 items-center">
                            <button disabled={current <= 1} onClick={() => gotoPage(current - 1)} className="px-3 py-2 rounded bg-gray-200 disabled:opacity-50">
                                Trước
                            </button>
                            <div>Trang {current} / {totalPages}</div>
                            <button disabled={current >= totalPages} onClick={() => gotoPage(current + 1)} className="px-3 py-2 rounded bg-gray-200 disabled:opacity-50">
                                Sau
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
