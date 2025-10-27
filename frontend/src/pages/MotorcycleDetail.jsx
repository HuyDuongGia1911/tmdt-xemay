// src/pages/MotorcycleDetail.jsx
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../lib/axios'

export default function MotorcycleDetail() {
    const { slug } = useParams()
    const [item, setItem] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function load() {
        setLoading(true); setError('')
        try {
            const res = await api.get(`/api/motorcycles/${slug}`)
            // Kỳ vọng backend trả về đầy đủ: motorcycle + specs + inventory + seller + reviews
            setItem(res.data.data || res.data.item || res.data) // linh hoạt
        } catch (e) {
            setError(e?.response?.data?.message || 'Không tải được chi tiết sản phẩm')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [slug])

    if (loading) return <div>Đang tải...</div>
    if (error) return <div className="text-red-600">{error}</div>
    if (!item) return null

    const specs = item.specs || item.spec || {}
    const inventory = item.inventory || {}
    const seller = item.seller || {}

    return (
        <div className="bg-white p-4 rounded-xl shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        {item.image_url
                            ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                        }
                    </div>
                </div>
                <div>
                    <h1 className="text-2xl font-bold">{item.name}</h1>
                    <div className="text-gray-600">{item.brand} • {item.year}</div>
                    <div className="mt-2 text-xl font-semibold">{Number(item.price).toLocaleString('vi-VN')} ₫</div>

                    {item.rating_avg != null && <div className="mt-1">★ {item.rating_avg}</div>}

                    <div className="mt-4">
                        <div className="font-semibold mb-1">Tồn kho</div>
                        <div>Sẵn có: {inventory.available ?? '—'}</div>
                        <div>Đang giữ chỗ: {inventory.reserved ?? '—'}</div>
                    </div>

                    <div className="mt-4">
                        <div className="font-semibold mb-1">Người bán</div>
                        <div>{seller.name || seller.display_name || '—'}</div>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <div className="font-semibold mb-2">Thông số kỹ thuật</div>
                <ul className="list-disc ml-5 space-y-1 text-sm">
                    <li>Động cơ: {specs.engine || '—'}</li>
                    <li>Công suất: {specs.power || '—'}</li>
                    <li>Trọng lượng: {specs.weight || '—'}</li>
                    <li>Dung tích bình xăng: {specs.fuel_capacity || '—'}</li>
                    {/* thêm các thông số khác bạn có */}
                </ul>
            </div>

            {Array.isArray(item.reviews) && (
                <div className="mt-6">
                    <div className="font-semibold mb-2">Đánh giá</div>
                    {item.reviews.length === 0 ? (
                        <div className="text-sm text-gray-600">Chưa có đánh giá.</div>
                    ) : (
                        <div className="space-y-2">
                            {item.reviews.map((rv) => (
                                <div key={rv.id} className="border rounded p-2">
                                    <div className="text-sm font-semibold">{rv.author_name || 'Người dùng'}</div>
                                    <div className="text-sm">★ {rv.rating} — {rv.comment}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
