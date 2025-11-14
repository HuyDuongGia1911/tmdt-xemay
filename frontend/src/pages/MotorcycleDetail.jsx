// src/pages/MotorcycleDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/axios";
import { addCartItem } from "../api/cart";

export default function MotorcycleDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function load() {
        try {
            setLoading(true);
            setError("");
            const res = await api.get(`/api/motorcycles/${slug}`);
            setItem(res.data?.data || res.data);
        } catch (e) {
            setError(e?.response?.data?.message || "Không tải được dữ liệu");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, [slug]);

    if (loading) return <div className="p-6">Đang tải...</div>;
    if (error) return <div className="p-6 text-red-600">{error}</div>;
    if (!item) return null;

    const specs = item.specs || {};
    const inventory = item.inventory || {};
    const seller = item.seller || {};

    const available = Number(inventory.available ?? inventory.stock ?? 0);
    const outOfStock = available <= 0;

    async function handleAddToCart() {
        try {
            await addCartItem({
                motorcycle_id: item.id,
                qty: 1,
            });
            alert("Đã thêm vào giỏ hàng!");
        } catch (e) {
            alert(e?.response?.data?.message || "Không thể thêm vào giỏ");
        }
    }

    async function handleBuyNow() {
        try {
            await addCartItem({
                motorcycle_id: item.id,
                qty: 1,
            });
            navigate("/cart");
        } catch (e) {
            alert(e?.response?.data?.message || "Không thể đặt mua ngay");
        }
    }

    return (
        <div className="w-full bg-white rounded-xl shadow p-6 space-y-10">
            {/* ======================= TOP SECTION ======================= */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* LEFT: IMAGE */}
                <div>
                    <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden shadow">
                        {item.image_url ? (
                            <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                Không có ảnh
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: INFO */}
                <div className="space-y-4">
                    {/* Tên + Brand + Năm + Badge trạng thái */}
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-3xl font-bold">{item.name}</h1>
                            {outOfStock ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-xs font-semibold">
                                    Hết hàng
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                                    Còn hàng
                                </span>
                            )}
                        </div>
                        <div className="text-gray-600 text-lg">
                            {item.brand} • {item.year}
                        </div>
                    </div>

                    {/* GIÁ */}
                    <div className="text-4xl font-extrabold text-red-600">
                        {Number(item.price).toLocaleString("vi-VN")} ₫
                    </div>

                    {/* Kho */}
                    <div className="bg-gray-50 p-4 rounded-xl border">
                        <div className="font-semibold mb-1">Tình trạng kho</div>
                        <div className="text-gray-700">
                            Sẵn có: <b>{Number.isNaN(available) ? "—" : available}</b>
                        </div>
                        <div className="text-gray-700">
                            Đang giữ chỗ: <b>{inventory.reserved ?? "—"}</b>
                        </div>
                    </div>

                    {/* Người bán */}
                    <div className="bg-gray-50 p-4 rounded-xl border">
                        <div className="font-semibold mb-1">Thông tin người bán</div>
                        <div className="text-gray-800 font-medium">
                            {seller.name || seller.display_name || "Người bán ẩn danh"}
                        </div>
                    </div>

                    {/* NÚT HÀNH ĐỘNG */}
                    {outOfStock ? (
                        <div className="space-y-2">
                            <button
                                disabled
                                className="px-6 py-3 rounded-xl font-semibold bg-gray-200 text-gray-500 cursor-not-allowed"
                            >
                                Hết hàng
                            </button>
                            <p className="text-sm text-gray-600">
                                Xe hiện đã hết hàng. Vui lòng liên hệ người bán để biết thêm thông tin.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={handleBuyNow}
                                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow hover:bg-blue-700 transition"
                            >
                                Đặt mua ngay
                            </button>

                            <button
                                onClick={handleAddToCart}
                                className="px-6 py-3 bg-gray-200 rounded-xl font-semibold hover:bg-gray-300 transition"
                            >
                                Thêm vào giỏ
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ======================= SPECS ======================= */}
            <div>
                <h2 className="text-2xl font-bold mb-3">Thông số kỹ thuật</h2>

                <div className="border rounded-xl p-6 bg-gray-50">
                    <table className="w-full text-sm">
                        <tbody className="divide-y">
                            <tr>
                                <td className="py-2 text-gray-600">Động cơ</td>
                                <td className="py-2 font-medium">{specs.engine || "—"}</td>
                            </tr>
                            <tr>
                                <td className="py-2 text-gray-600">Công suất</td>
                                <td className="py-2 font-medium">{specs.power || "—"}</td>
                            </tr>
                            <tr>
                                <td className="py-2 text-gray-600">Trọng lượng</td>
                                <td className="py-2 font-medium">{specs.weight || "—"}</td>
                            </tr>
                            <tr>
                                <td className="py-2 text-gray-600">Dung tích bình xăng</td>
                                <td className="py-2 font-medium">{specs.fuel_capacity || "—"}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ======================= REVIEWS ======================= */}
            <div>
                <h2 className="text-2xl font-bold mb-3">Đánh giá</h2>

                {Array.isArray(item.reviews) && item.reviews.length > 0 ? (
                    <div className="space-y-4">
                        {item.reviews.map((rv) => (
                            <div
                                key={rv.id}
                                className="border rounded-xl p-4 bg-white shadow-sm"
                            >
                                <div className="font-semibold">
                                    {rv.author_name || "Người dùng"}
                                </div>
                                <div className="text-yellow-500 text-sm">★ {rv.rating}</div>
                                <div className="text-gray-700 text-sm mt-1">
                                    {rv.comment}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">Chưa có đánh giá.</p>
                )}
            </div>
        </div>
    );
}
