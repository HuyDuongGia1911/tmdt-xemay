import React from 'react'
import { Link } from 'react-router-dom'

export default function MotorcycleCard({ item }) {

    const isNew =
        item.created_at &&
        (Date.now() - new Date(item.created_at).getTime()) <= 7 * 24 * 60 * 60 * 1000

    return (
        <div className="bg-white rounded-xl shadow p-4 border border-gray-200 hover:shadow-lg transition flex flex-col">
            <Link to={`/motorcycles/${item.slug}`} className="flex flex-col h-full">

                {/* Ảnh */}
                <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden mb-3">
                    {item.thumbnail_url ? (
                        <img src={item.thumbnail_url}
                            alt={item.name}
                            className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Image
                        </div>
                    )}

                    {isNew && (
                        <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
                            NEW
                        </div>
                    )}
                </div>

                {/* Tên xe */}
                <div className="font-semibold text-lg truncate">{item.name}</div>

                {/* Hãng */}
                <div className="text-sm text-gray-500 mb-2">{item.brand}</div>

                {/* Description — hiển thị 2 dòng gọn */}
                {item.description && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {item.description}
                    </p>
                )}

                {/* Giá */}
                <div className="font-bold text-xl text-gray-900 mb-3 mt-auto">
                    {Number(item.price).toLocaleString('vi-VN')} ₫
                </div>

                {/* Add to cart */}
                <button className="w-full py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition">
                    ADD TO CART
                </button>

            </Link>
        </div>
    )
}
