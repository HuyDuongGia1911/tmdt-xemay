// src/components/MotorcycleCard.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function MotorcycleCard({ item }) {
    // item dự kiến có: id, name, slug, brand, price, thumbnail_url, rating_avg, etc.
    return (
        <div className="bg-white rounded-xl shadow p-3">
            <Link to={`/motorcycles/${item.slug}`}>
                <div className="aspect-video bg-gray-100 rounded-lg mb-2 overflow-hidden">
                    {item.thumbnail_url
                        ? <img src={item.thumbnail_url} alt={item.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                    }
                </div>
                <div className="font-semibold">{item.name}</div>
                <div className="text-sm text-gray-600">{item.brand}</div>
                <div className="mt-1 font-bold">{Number(item.price).toLocaleString('vi-VN')} ₫</div>
                {item.rating_avg != null && (
                    <div className="text-sm mt-1">★ {item.rating_avg.toFixed ? item.rating_avg.toFixed(1) : item.rating_avg}</div>
                )}
            </Link>
        </div>
    )
}
