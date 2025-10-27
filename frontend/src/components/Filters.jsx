// src/components/Filters.jsx
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function Filters() {
    const [searchParams, setSearchParams] = useSearchParams()

    // State khởi tạo từ URL (giúp reload không mất filter)
    const [filters, setFilters] = useState({
        brand: searchParams.get('brand') || '',
        price_min: searchParams.get('price_min') || '',
        price_max: searchParams.get('price_max') || '',
        year_min: searchParams.get('year_min') || '',
        year_max: searchParams.get('year_max') || '',
        condition: searchParams.get('condition') || '',
        color: searchParams.get('color') || '',
        type: searchParams.get('type') || '',
        has_inventory: searchParams.get('has_inventory') || '',
        rating_min: searchParams.get('rating_min') || '',
        q: searchParams.get('q') || '',
    })

    function onChange(e) {
        const { name, value } = e.target
        setFilters((s) => ({ ...s, [name]: value }))
    }

    function applyFilters() {
        // Khi áp dụng filter, reset page về 1 để tránh trang lẻ
        const next = new URLSearchParams()
        Object.entries(filters).forEach(([k, v]) => {
            if (v !== '' && v != null) next.set(k, v)
        })
        next.set('page', '1')
        setSearchParams(next)
    }

    function clearFilters() {
        setFilters({
            brand: '',
            price_min: '',
            price_max: '',
            year_min: '',
            year_max: '',
            condition: '',
            color: '',
            type: '',
            has_inventory: '',
            rating_min: '',
            q: '',
        })
        setSearchParams({ page: '1' })
    }

    return (
        <div className="bg-white p-4 rounded-xl shadow mb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <input name="q" value={filters.q} onChange={onChange} className="border rounded p-2" placeholder="Tìm theo tên, mô tả..." />
                <input name="brand" value={filters.brand} onChange={onChange} className="border rounded p-2" placeholder="Hãng (vd: Honda)" />
                <input name="color" value={filters.color} onChange={onChange} className="border rounded p-2" placeholder="Màu (vd: đỏ)" />
                <input name="type" value={filters.type} onChange={onChange} className="border rounded p-2" placeholder="Dòng xe (vd: tay ga)" />

                <input type="number" name="price_min" value={filters.price_min} onChange={onChange} className="border rounded p-2" placeholder="Giá từ" />
                <input type="number" name="price_max" value={filters.price_max} onChange={onChange} className="border rounded p-2" placeholder="Giá đến" />
                <input type="number" name="year_min" value={filters.year_min} onChange={onChange} className="border rounded p-2" placeholder="Năm từ" />
                <input type="number" name="year_max" value={filters.year_max} onChange={onChange} className="border rounded p-2" placeholder="Năm đến" />

                <select name="condition" value={filters.condition} onChange={onChange} className="border rounded p-2">
                    <option value="">Tình trạng (tất cả)</option>
                    <option value="new">Mới</option>
                    <option value="used">Cũ</option>
                </select>

                <select name="has_inventory" value={filters.has_inventory} onChange={onChange} className="border rounded p-2">
                    <option value="">Kho (tất cả)</option>
                    <option value="1">Còn hàng</option>
                    <option value="0">Hết hàng</option>
                </select>

                <select name="rating_min" value={filters.rating_min} onChange={onChange} className="border rounded p-2">
                    <option value="">Đánh giá tối thiểu</option>
                    <option value="1">1★</option>
                    <option value="2">2★</option>
                    <option value="3">3★</option>
                    <option value="4">4★</option>
                    <option value="5">5★</option>
                </select>
            </div>

            <div className="mt-3 flex gap-2">
                <button onClick={applyFilters} className="px-4 py-2 rounded-lg bg-gray-900 text-white">Áp dụng</button>
                <button onClick={clearFilters} className="px-4 py-2 rounded-lg bg-gray-200">Xóa lọc</button>
            </div>
        </div>
    )
}
