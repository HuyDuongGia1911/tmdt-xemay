import React, { useEffect, useState } from "react";
import {
    getMotorcycleImages,
    uploadMotorcycleImage,
    deleteMotorcycleImage,
    setMotorcycleThumbnail,
    uploadMotorcycleImageByUrl
} from "../../../api/dashboard";

export default function SellerMotorcycleImagesModal({ motorcycle, open, onClose }) {
    const [data, setData] = useState(null); // { motorcycle_id, thumbnail_url, images: [] }
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [urlInput, setUrlInput] = useState("");
    const [uploadingUrl, setUploadingUrl] = useState(false);
    useEffect(() => {
        if (!open || !motorcycle) return;

        async function load() {
            setLoading(true);
            setError("");
            try {
                const res = await getMotorcycleImages(motorcycle.id);
                setData(res.data);
            } catch (e) {
                setError(e?.response?.data?.message || e.message);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [open, motorcycle]);

    if (!open || !motorcycle) return null;

    const images = data?.images || [];
    const thumbnailUrl = data?.thumbnail_url;

    async function handleUpload(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError("");
        try {
            await uploadMotorcycleImage(motorcycle.id, file);
            const res = await getMotorcycleImages(motorcycle.id);
            setData(res.data);
        } catch (e) {
            setError(e?.response?.data?.message || e.message);
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    }

    async function handleDelete(imageId) {
        if (!window.confirm("Xoá ảnh này?")) return;

        setError("");
        try {
            await deleteMotorcycleImage(motorcycle.id, imageId);
            const res = await getMotorcycleImages(motorcycle.id);
            setData(res.data);
        } catch (e) {
            setError(e?.response?.data?.message || e.message);
        }
    }

    async function handleSetThumbnail(imageId) {
        setError("");
        try {
            await setMotorcycleThumbnail(motorcycle.id, imageId);
            const res = await getMotorcycleImages(motorcycle.id);
            setData(res.data);
        } catch (e) {
            setError(e?.response?.data?.message || e.message);
        }
    }
    async function handleUploadUrl() {
        if (!urlInput) return;

        setUploadingUrl(true);
        setError("");

        try {
            await uploadMotorcycleImageByUrl(motorcycle.id, urlInput);
            const res = await getMotorcycleImages(motorcycle.id);
            setData(res.data);
            setUrlInput("");
            setShowUrlInput(false);
        } catch (e) {
            setError(e?.response?.data?.message || e.message);
        } finally {
            setUploadingUrl(false);
        }
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-4 py-3 border-b flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold">
                            Quản lý hình ảnh — {motorcycle.name}
                        </h2>
                        <p className="text-xs text-gray-500">
                            Thêm, xoá, đặt ảnh đại diện cho sản phẩm này.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 text-xl leading-none"
                    >
                        ×
                    </button>
                </div>

                {/* Body */}
                <div className="px-4 py-3 overflow-y-auto flex-1">
                    {error && (
                        <div className="mb-3 text-sm text-red-600">
                            Lỗi: {error}
                        </div>
                    )}

                    <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                            <div className="text-sm font-medium mb-1">Ảnh đại diện hiện tại</div>
                            {showUrlInput && (
                                <div className="mt-3 p-3 border rounded-lg bg-gray-50">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            className="flex-1 border px-3 py-2 rounded"
                                            placeholder="Dán URL ảnh..."
                                            value={urlInput}
                                            onChange={(e) => setUrlInput(e.target.value)}
                                        />
                                        <button
                                            onClick={handleUploadUrl}
                                            disabled={uploadingUrl || !urlInput}
                                            className="px-3 py-2 bg-black text-white rounded hover:opacity-90 disabled:opacity-50"
                                        >
                                            {uploadingUrl ? "Đang thêm..." : "Thêm"}
                                        </button>
                                        <button
                                            onClick={() => { setShowUrlInput(false); setUrlInput(""); }}
                                            className="px-3 py-2 border rounded hover:bg-gray-100"
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center gap-3">
                                <img
                                    src={thumbnailUrl}
                                    alt="Thumbnail"
                                    className="w-20 h-20 rounded-md object-cover border"
                                />
                                <span className="text-xs text-gray-500">
                                    Nếu không chọn thumbnail, hệ thống sẽ dùng ảnh fallback /no-image.png.
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {/* Upload file */}
                            <label className="px-3 py-2 rounded-lg border bg-gray-50 hover:bg-gray-100 cursor-pointer text-sm">
                                Tải ảnh lên
                                <input type="file" className="hidden" accept="image/*"
                                    disabled={uploading}
                                    onChange={handleUpload}
                                />
                            </label>

                            {/* Upload bằng link */}
                            <button
                                onClick={() => setShowUrlInput(true)}
                                className="px-3 py-2 rounded-lg border bg-gray-50 hover:bg-gray-100 text-sm"
                            >
                                Dùng link
                            </button>
                        </div>
                    </div>

                    <div className="border-t pt-3">
                        <div className="text-sm font-medium mb-2">
                            Tất cả ảnh ({images.length})
                        </div>
                        {loading ? (
                            <div className="text-sm text-gray-500">
                                Đang tải danh sách ảnh...
                            </div>
                        ) : !images.length ? (
                            <div className="text-sm text-gray-500">
                                Chưa có ảnh nào cho sản phẩm này.
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {images.map((img) => {
                                    const isThumb = thumbnailUrl === img.url;
                                    return (
                                        <div
                                            key={img.id}
                                            className="border rounded-lg p-2 flex flex-col gap-2"
                                        >
                                            <img
                                                src={img.url}
                                                alt=""
                                                className="w-full h-28 object-cover rounded-md"
                                            />
                                            <div className="flex flex-col gap-1">
                                                {isThumb && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                                                        Thumbnail
                                                    </span>
                                                )}
                                                <div className="flex gap-2 mt-1">
                                                    {!isThumb && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSetThumbnail(img.id)}
                                                            className="flex-1 px-2 py-1 rounded-md border text-xs hover:bg-gray-50"
                                                        >
                                                            Đặt làm thumbnail
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(img.id)}
                                                        className="flex-1 px-2 py-1 rounded-md border text-xs text-red-600 hover:bg-red-50"
                                                    >
                                                        Xoá
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}
