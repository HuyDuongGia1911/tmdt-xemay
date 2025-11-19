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

    const [myRating, setMyRating] = useState(5);
    const [myReview, setMyReview] = useState("");
    const [submitLoading, setSubmitLoading] = useState(false);


    const [activeImageIndex, setActiveImageIndex] = useState(0);

    async function load() {
        try {
            setLoading(true);
            setError("");
            const res = await api.get(`/api/motorcycles/${slug}`);
            const data = res.data?.data || res.data;

            setItem(data || null);
            setActiveImageIndex(0);
        } catch (e) {
            setError(e?.response?.data?.message || "Không tải được dữ liệu");
        } finally {
            setLoading(false);
        }
    }
    async function submitReview() {
        if (!myReview.trim()) return alert("Vui lòng nhập nội dung đánh giá!");

        try {
            setSubmitLoading(true);

            await api.post(`/api/motorcycles/${item.id}/reviews`, {
                rating: myRating,
                content: myReview,
            });

            alert("Cảm ơn bạn đã đánh giá!");

            setMyReview("");
            setMyRating(5);

            load(); // reload dữ liệu
        } catch (e) {
            alert(e?.response?.data?.message || "Không thể gửi đánh giá");
        } finally {
            setSubmitLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, [slug]);

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-6 bg-gray-200 rounded w-32" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="aspect-square bg-gray-200 rounded-2xl" />
                        <div className="space-y-4">
                            <div className="h-8 bg-gray-200 rounded w-2/3" />
                            <div className="h-10 bg-gray-200 rounded w-1/3" />
                            <div className="h-24 bg-gray-200 rounded" />
                            <div className="h-24 bg-gray-200 rounded" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error)
        return (
            <div className="max-w-4xl mx-auto p-6 text-red-600">
                {error}
            </div>
        );

    if (!item) return null;

    // ======== Chuẩn hoá data ========
    const spec = item.spec || {};
    const inventory = item.inventory || {};
    const seller = item.seller || {};
    const reviews = Array.isArray(item.reviews) ? item.reviews : [];

    const available =
        Number(inventory.stock ?? 0) - Number(inventory.reserved ?? 0);
    const reserved = Number(
        Number.isNaN(Number(inventory.reserved)) ? 0 : inventory.reserved
    );
    const outOfStock = !Number.isFinite(available) || available <= 0;

    const NO_IMAGE = "/no-image.png";

    // lấy thumbnail trước
    const thumbnail = item.thumbnail_url || NO_IMAGE;

    // lấy images từ DB (nếu có)
    const dbImages = Array.isArray(item.images) ? item.images.map(img => img.url) : [];

    // gộp tất cả lại: thumbnail + images
    let fullImages = [thumbnail, ...dbImages];

    // loại bỏ trùng nhau
    fullImages = [...new Set(fullImages)];

    // convert về dạng gallery FE cần
    const images = fullImages.map((url, idx) => ({
        id: idx,
        url,
    }));

    const mainImage = images[activeImageIndex]?.url || NO_IMAGE;

    const rating = Number(item.average_rating || item.rating || 0);
    const totalReviews = reviews.length;

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

    const renderStars = (value) => {
        const safe = Math.max(0, Math.min(5, Number(value) || 0));
        return (
            <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                    <span
                        key={idx}
                        className={
                            idx < safe ? "text-yellow-400 text-lg" : "text-gray-300 text-lg"
                        }
                    >
                        ★
                    </span>
                ))}
                <span className="text-sm text-gray-600 ml-1">
                    {safe.toFixed(1)} / 5
                </span>
            </div>
        );
    };

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8">
            {/* BREADCRUMB */}
            <div className="text-sm text-gray-500 flex items-center gap-1">
                <button
                    onClick={() => navigate(-1)}
                    className="text-blue-600 hover:underline"
                >
                    ← Quay lại
                </button>
                <span>/</span>
                <span>Chi tiết xe</span>
            </div>

            {/* CARD CHÍNH */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 space-y-8">
                {/* TOP: Ảnh + Thông tin chính */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* LEFT: GALLERY */}
                    <div>
                        <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-100">
                            {mainImage ? (
                                <img
                                    src={mainImage}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-gray-400 text-sm">
                                    Không có ảnh
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                                {images.map((img, idx) => (
                                    <button
                                        key={img.id || idx}
                                        onClick={() => setActiveImageIndex(idx)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-xl border ${idx === activeImageIndex
                                            ? "border-blue-500"
                                            : "border-gray-200"
                                            } overflow-hidden`}
                                    >
                                        <img
                                            src={img.url}
                                            alt={`${item.name} - ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: INFO */}
                    <div className="space-y-4">
                        {/* Tên + trạng thái */}
                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-2xl sm:text-3xl font-bold">
                                    {item.name}
                                </h1>
                                {outOfStock ? (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                                        Hết hàng
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                                        Còn hàng
                                    </span>
                                )}
                            </div>
                            <div className="text-gray-600">
                                {item.brand && (
                                    <span className="font-semibold mr-1">
                                        {item.brand}
                                    </span>
                                )}
                                {item.year && <span>• Năm {item.year}</span>}
                                {item.condition && (
                                    <span className="ml-1 text-sm text-gray-500">
                                        • {item.condition === "new" ? "Xe mới" : "Xe đã dùng"}
                                    </span>
                                )}
                            </div>

                            {/* Rating */}
                            {totalReviews > 0 && (
                                <div className="flex items-center gap-3 mt-1">
                                    {renderStars(rating)}
                                    <span className="text-sm text-gray-500">
                                        ({totalReviews} đánh giá)
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Giá */}
                        <div className="flex items-end gap-3">
                            <div className="text-3xl sm:text-4xl font-extrabold text-red-600">
                                {Number(item.price).toLocaleString("vi-VN")} ₫
                            </div>
                            {item.original_price && (
                                <div className="text-sm text-gray-400 line-through">
                                    {Number(item.original_price).toLocaleString("vi-VN")} ₫
                                </div>
                            )}
                        </div>

                        {/* THÔNG TIN NHANH */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                <div className="text-gray-500">Tình trạng</div>
                                <div className="font-semibold">
                                    {item.condition === "new"
                                        ? "Xe mới"
                                        : item.condition === "used"
                                            ? "Xe đã dùng"
                                            : "—"}
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                <div className="text-gray-500">Màu sắc</div>
                                <div className="font-semibold">
                                    {spec.color || item.color || "—"}
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                <div className="text-gray-500">Động cơ</div>
                                <div className="font-semibold">
                                    {spec.engine ||
                                        (spec.engine_cc
                                            ? `${spec.engine_cc} cc`
                                            : "—")}
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                <div className="text-gray-500">Công suất</div>
                                <div className="font-semibold">
                                    {spec.power ||
                                        (spec.power_hp
                                            ? `${spec.power_hp} hp`
                                            : "—")}
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                <div className="text-gray-500">Tồn kho</div>
                                <div className="font-semibold">
                                    {Number.isNaN(available) ? "—" : `${available} xe`}
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                <div className="text-gray-500">Đang giữ chỗ</div>
                                <div className="font-semibold">
                                    {Number.isNaN(reserved) ? "—" : `${reserved} xe`}
                                </div>
                            </div>
                        </div>

                        {/* NÚT HÀNH ĐỘNG */}
                        {outOfStock ? (
                            <div className="space-y-2">
                                <button
                                    disabled
                                    className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold bg-gray-200 text-gray-500 cursor-not-allowed"
                                >
                                    Hết hàng
                                </button>
                                <p className="text-sm text-gray-600">
                                    Xe hiện đã hết hàng. Vui lòng liên hệ người bán để biết thêm
                                    thông tin.
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={handleBuyNow}
                                    className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow hover:bg-blue-700 transition"
                                >
                                    Đặt mua ngay
                                </button>

                                <button
                                    onClick={handleAddToCart}
                                    className="w-full sm:w-auto px-6 py-3 bg-gray-100 rounded-xl font-semibold hover:bg-gray-200 transition"
                                >
                                    Thêm vào giỏ
                                </button>
                            </div>
                        )}

                        {/* THÔNG TIN NGƯỜI BÁN */}
                        <div className="mt-4 border-t pt-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                    {(seller.shop_name || seller.name || "S")[0]}
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm text-gray-500">
                                        Người bán
                                    </div>
                                    <div className="font-semibold">
                                        {seller.shop_name ||
                                            seller.name ||
                                            seller.display_name ||
                                            "Người bán ẩn danh"}
                                    </div>
                                    {seller.address && (
                                        <div className="text-sm text-gray-600">
                                            Địa chỉ: {seller.address}
                                        </div>
                                    )}
                                    {seller.phone && (
                                        <div className="text-sm text-gray-600">
                                            SĐT: {seller.phone}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MÔ TẢ */}
                <div className="border-t pt-6">
                    <h2 className="text-xl font-bold mb-3">Mô tả chi tiết</h2>
                    <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                        {item.description
                            ? item.description
                            : "Người bán chưa cung cấp mô tả chi tiết cho xe này."}
                    </div>
                </div>

                {/* THÔNG SỐ KỸ THUẬT */}
                <div className="border-t pt-6">
                    <h2 className="text-xl font-bold mb-3">Thông số kỹ thuật</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Động cơ</span>
                                <span className="font-semibold">
                                    {spec.engine ||
                                        (spec.engine_cc
                                            ? `${spec.engine_cc} cc`
                                            : "—")}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Công suất</span>
                                <span className="font-semibold">
                                    {spec.power ||
                                        (spec.power_hp
                                            ? `${spec.power_hp} hp`
                                            : "—")}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Momen xoắn</span>
                                <span className="font-semibold">
                                    {spec.torque_nm
                                        ? `${spec.torque_nm} Nm`
                                        : "—"}
                                </span>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Trọng lượng</span>
                                <span className="font-semibold">
                                    {spec.weight ||
                                        (spec.weight_kg
                                            ? `${spec.weight_kg} kg`
                                            : "—")}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Năm sản xuất</span>
                                <span className="font-semibold">
                                    {spec.year || item.year || "—"}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">Dung tích bình xăng</span>
                                <span className="font-semibold">
                                    {spec.fuel_capacity ? `${spec.fuel_capacity} L` : "—"}
                                </span>
                            </div>

                        </div>
                    </div>
                </div>

                {/* ĐÁNH GIÁ */}
                <div className="border-t pt-6">
                    <h2 className="text-xl font-bold mb-3">Đánh giá</h2>

                    {reviews.length > 0 ? (
                        <div className="space-y-4">
                            {reviews.map((rv) => (
                                <div
                                    key={rv.id}
                                    className="border border-gray-100 rounded-xl p-4 bg-white shadow-sm flex gap-3"
                                >
                                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm font-semibold">
                                        {(rv.author_name || rv.user_name || "U")[0]}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div className="font-semibold text-sm">
                                                {rv.author_name ||
                                                    rv.user_name ||
                                                    "Người dùng"}
                                            </div>
                                            <div className="flex items-center gap-1 text-yellow-400 text-sm">
                                                {Array.from({ length: 5 }).map((_, idx) => (
                                                    <span
                                                        key={idx}
                                                        className={
                                                            idx < (rv.rating || 0)
                                                                ? "text-yellow-400"
                                                                : "text-gray-300"
                                                        }
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                                <span className="text-gray-600 ml-1">
                                                    {rv.rating}/5
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-700 mt-1">
                                            {rv.comment || rv.content || "Không có nội dung."}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 text-sm">
                            Chưa có đánh giá cho xe này.
                        </p>
                    )}
                </div>
                <div className="mt-6 border-t pt-6">
                    <h3 className="text-lg font-semibold mb-2">Gửi đánh giá của bạn</h3>

                    <div className="flex items-center gap-2 mb-3">
                        {Array.from({ length: 5 }).map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setMyRating(idx + 1)}
                                className={idx < myRating ? "text-yellow-400 text-xl" : "text-gray-300 text-xl"}
                            >
                                ★
                            </button>
                        ))}
                    </div>

                    <textarea
                        value={myReview}
                        onChange={(e) => setMyReview(e.target.value)}
                        rows={3}
                        className="w-full border rounded-lg p-3 text-sm"
                        placeholder="Nhập nội dung đánh giá..."
                    />

                    <button
                        onClick={submitReview}
                        disabled={submitLoading}
                        className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        {submitLoading ? "Đang gửi..." : "Gửi đánh giá"}
                    </button>
                </div>

            </div>
        </div>
    );
}
