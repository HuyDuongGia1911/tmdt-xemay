import React, { useEffect, useState } from "react";
import Shell from "../../Shell";
import {
    getBrands,
    createBrand,
    updateBrand,
    deleteBrand,
    uploadBrandLogo,
    setBrandLogoUrl
} from "../../../../api/brand";

export default function AdminBrandList() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);

    const [form, setForm] = useState({
        name: "",
        slug: "",
    });

    const [showLogoModal, setShowLogoModal] = useState(false);
    const [logoBrand, setLogoBrand] = useState(null);
    const [logoUrlInput, setLogoUrlInput] = useState("");

    async function loadBrands() {
        setLoading(true);
        try {
            const res = await getBrands();
            setBrands(res.data || []);
        } catch (e) {
            setError(e?.response?.data?.message || e.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadBrands();
    }, []);

    function openCreate() {
        setEditing(null);
        setForm({ name: "", slug: "" });
        setShowForm(true);
    }

    function openEdit(b) {
        setEditing(b);
        setForm({ name: b.name, slug: b.slug });
        setShowForm(true);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            if (editing) {
                await updateBrand(editing.id, form);
            } else {
                await createBrand(form);
            }
            setShowForm(false);
            loadBrands();
        } catch (e) {
            alert(e?.response?.data?.message || "Lỗi xảy ra");
        }
    }

    async function handleDelete(b) {
        if (!window.confirm(`Xóa thương hiệu: ${b.name}?`)) return;

        try {
            await deleteBrand(b.id);
            loadBrands();
        } catch (e) {
            alert(e?.response?.data?.message || "Không thể xóa");
        }
    }

    function openLogoModal(brand) {
        setLogoBrand(brand);
        setLogoUrlInput("");
        setShowLogoModal(true);
    }

    async function handleUploadFile(e) {
        if (!e.target.files[0]) return;

        try {
            await uploadBrandLogo(logoBrand.id, e.target.files[0]);
            setShowLogoModal(false);
            loadBrands();
        } catch (e) {
            alert(e?.response?.data?.message || "Upload thất bại");
        }
    }

    async function handleSetUrl() {
        try {
            await setBrandLogoUrl(logoBrand.id, logoUrlInput);
            setShowLogoModal(false);
            loadBrands();
        } catch (e) {
            alert(e?.response?.data?.message || "Không thể cập nhật");
        }
    }

    return (
        <Shell>
            <div className="max-w-3xl">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Quản lý thương hiệu (Brand)</h1>
                    <button
                        onClick={openCreate}
                        className="px-4 py-2 bg-black text-white rounded-lg"
                    >
                        + Thêm brand
                    </button>
                </div>

                {loading && <div>Đang tải...</div>}
                {error && <div className="text-red-600">{error}</div>}

                <div className="bg-white border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 text-left">Logo</th>
                                <th className="p-3 text-left">Tên</th>
                                <th className="p-3 text-left">Slug</th>
                                <th className="p-3 text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {brands.map(b => (
                                <tr key={b.id} className="border-t">
                                    <td className="p-3">
                                        {b.logo_url ? (
                                            <img src={b.logo_url} className="w-12 h-12 object-contain" />
                                        ) : (
                                            <span className="text-xs text-gray-400">Không có</span>
                                        )}
                                    </td>
                                    <td className="p-3">{b.name}</td>
                                    <td className="p-3 text-xs text-gray-500">{b.slug}</td>
                                    <td className="p-3 text-right">
                                        <button
                                            onClick={() => openLogoModal(b)}
                                            className="px-3 py-1 border rounded-lg text-xs mr-2"
                                        >
                                            Logo
                                        </button>
                                        <button
                                            onClick={() => openEdit(b)}
                                            className="px-3 py-1 border rounded-lg text-xs mr-2"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(b)}
                                            className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {!brands.length && !loading && (
                                <tr>
                                    <td colSpan="4" className="p-4 text-center text-gray-500">
                                        Chưa có thương hiệu nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* FORM MODAL */}
            {showForm && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-lg font-semibold mb-3">
                            {editing ? "Sửa thương hiệu" : "Thêm thương hiệu"}
                        </h2>

                        <form className="space-y-3" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm">Tên</label>
                                <input
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm">Slug</label>
                                <input
                                    value={form.slug}
                                    onChange={e => setForm({ ...form, slug: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 border rounded"
                                    onClick={() => setShowForm(false)}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-black text-white rounded"
                                >
                                    Lưu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* LOGO MODAL */}
            {showLogoModal && logoBrand && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-lg font-semibold mb-3">
                            Cập nhật logo — {logoBrand.name}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm mb-1">Upload file</label>
                                <input type="file" accept="image/*" onChange={handleUploadFile} />
                            </div>

                            <div className="border-t pt-4">
                                <label className="block text-sm mb-1">Dùng URL</label>
                                <input
                                    type="text"
                                    value={logoUrlInput}
                                    onChange={e => setLogoUrlInput(e.target.value)}
                                    className="border rounded w-full px-3 py-2 text-sm"
                                    placeholder="https://example.com/logo.png"
                                />

                                <button
                                    onClick={handleSetUrl}
                                    className="mt-2 px-4 py-2 bg-black text-white rounded text-sm"
                                >
                                    Cập nhật URL
                                </button>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    className="px-4 py-2 border rounded"
                                    onClick={() => setShowLogoModal(false)}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Shell>
    );
}
