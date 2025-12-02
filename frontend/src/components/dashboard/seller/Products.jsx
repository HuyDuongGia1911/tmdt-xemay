import React, { useEffect, useState } from 'react';
import Shell from '../Shell';
import { getSellerMotorcycles, patchSellerMotorcycle, deleteSellerMotorcycle } from '../../../api/dashboard';
import { useNavigate } from 'react-router-dom';
import SellerMotorcycleImagesModal from "./SellerMotorcycleImagesModal";
import { Link } from 'react-router-dom';
export default function Products() {
    const [q, setQ] = useState('');
    const navigate = useNavigate();
    const [status, setStatus] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const [page, setPage] = useState(1);
    const [resp, setResp] = useState(null);
    const [savingId, setSavingId] = useState(null);
    const [error, setError] = useState(null);
    const [perPage, setPerPage] = useState(25);
    const [imageMotorcycle, setImageMotorcycle] = useState(null);
    async function load() {
        setError(null);
        try {
            const res = await getSellerMotorcycles({
                q: q || undefined,
                status: status || undefined,
                page,
                per_page: perPage,
            });
            const raw = res.data;
            const normalized = raw?.current_page
                ? {
                    data: raw.data || [],
                    meta: {
                        current_page: Number(raw.current_page),
                        last_page: Number(raw.last_page),
                        per_page: Number(raw.per_page ?? 10),
                        total: Number(raw.total ?? 0),
                    },
                }
                : raw?.meta?.current_page
                    ? {
                        data: raw.data || [],
                        meta: {
                            current_page: Number(raw.meta.current_page),
                            last_page: Number(raw.meta.last_page),
                            per_page: Number(raw.meta.per_page ?? 10),
                            total: Number(raw.meta.total ?? 0),
                        },
                    }
                    : { data: raw?.data || [], meta: { current_page: 1, last_page: 1, per_page: 10, total: 0 } };
            setResp(normalized);
        } catch (e) {
            setError(e?.response?.data?.message || e.message);
        }
    }
    async function handleDelete(item) {
        if (!window.confirm(`Bạn chắc chắn muốn xóa sản phẩm "${item.name}"?`)) {
            return;
        }

        setDeletingId(item.id);
        setError(null);
        try {
            await deleteSellerMotorcycle(item.id);
            await load();
        } catch (e) {
            setError(e?.response?.data?.message || e.message);
        } finally {
            setDeletingId(null);
        }
    }
    useEffect(() => { load(); }, [q, status, page, perPage]);

    function updateLocal(id, fields) {
        setResp(prev => {
            if (!prev) return prev;
            const next = {
                ...prev,
                data: prev.data.map(item =>
                    item.id === id ? { ...item, ...fields } : item
                ),
            };
            return next;
        });
    }

    async function saveRow(row) {
        setSavingId(row.id);
        setError(null);
        try {
            await patchSellerMotorcycle(row.id, {
                price: row.price,
                status: row.status,
                stock: row.inventory?.stock ?? 0,
            });
            await load();
        } catch (e) {
            setError(e?.response?.data?.message || e.message);
        } finally {
            setSavingId(null);
        }
    }

    const cur = resp?.meta?.current_page ?? 1;
    const last = resp?.meta?.last_page ?? 1;

    return (
        <Shell>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                <div>
                    <h1 className="text-2xl font-semibold">Sản phẩm của shop</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Quản lý giá, tồn kho và trạng thái hiển thị của từng xe máy.
                    </p>
                </div>

                <div className="mt-2 md:mt-0 flex justify-start md:justify-end">
                    <Link
                        to="/dashboard/seller/products/new"
                        className="inline-flex items-center px-4 py-2 rounded-lg bg-black text-white text-sm hover:opacity-90"
                    >
                        + Thêm sản phẩm
                    </Link>
                </div>
            </div>

            {/* Filter bar */}
            <div className="bg-white rounded-xl shadow-sm border px-4 py-3 mb-4 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Tìm kiếm:</span>
                    <input
                        className="border px-3 py-2 rounded-lg text-sm min-w-[220px]"
                        placeholder="Tên / slug sản phẩm..."
                        value={q}
                        onChange={(e) => { setPage(1); setQ(e.target.value); }}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Trạng thái:</span>
                    <select
                        className="border px-3 py-2 rounded-lg text-sm"
                        value={status}
                        onChange={(e) => { setPage(1); setStatus(e.target.value); }}
                    >
                        <option value="">(Tất cả)</option>
                        <option value="active">active</option>
                        <option value="draft">draft</option>
                    </select>
                </div>

                <div className="ml-auto flex items-center gap-2">
                    <span className="text-sm text-gray-600">Số dòng / trang:</span>
                    <select
                        className="border px-3 py-2 rounded-lg text-sm"
                        value={perPage}
                        onChange={(e) => { setPage(1); setPerPage(Number(e.target.value)); }}
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="mb-3 text-sm text-red-600">
                    Lỗi: {error}
                </div>
            )}

            {/* Bảng sản phẩm */}
            <div className="bg-white rounded-xl shadow-sm border overflow-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr className="text-left text-gray-600">
                            <th className="p-3 font-medium">Tên xe</th>
                            <th className="p-3 font-medium">Slug</th>
                            <th className="p-3 font-medium text-right">Giá</th>
                            <th className="p-3 font-medium text-center">Tồn kho</th>
                            <th className="p-3 font-medium text-center">Trạng thái</th>
                            <th className="p-3 font-medium text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resp?.data?.map((item) => (
                            <tr key={item.id} className="border-t last:border-b hover:bg-gray-50">
                                <td className="p-3">
                                    <div className="font-medium">{item.name}</div>
                                </td>
                                <td className="p-3 text-xs text-gray-500">
                                    {item.slug}
                                </td>
                                <td className="p-3 text-right">
                                    <input
                                        type="number"
                                        className="border px-2 py-1 rounded w-32 text-right text-sm"
                                        value={item.price ?? 0}
                                        onChange={(e) =>
                                            updateLocal(item.id, {
                                                price: Number(e.target.value || 0),
                                            })
                                        }
                                    />
                                </td>
                                <td className="p-3 text-center">
                                    <input
                                        type="number"
                                        className="border px-2 py-1 rounded w-20 text-center text-sm"
                                        value={item.inventory?.stock ?? 0}
                                        onChange={(e) =>
                                            updateLocal(item.id, {
                                                inventory: {
                                                    ...(item.inventory || {}),
                                                    stock: Number(e.target.value || 0),
                                                },
                                            })
                                        }
                                    />
                                </td>
                                <td className="p-3 text-center">
                                    <select
                                        className="border px-2 py-1 rounded text-sm"
                                        value={item.status}
                                        onChange={(e) =>
                                            updateLocal(item.id, { status: e.target.value })
                                        }
                                    >
                                        <option value="active">active</option>
                                        <option value="draft">draft</option>
                                    </select>
                                </td>
                                <td className="p-3 text-right">
                                    <div className="flex gap-2 justify-end">
                                        <button
                                            type="button"
                                            className="px-3 py-1 rounded-lg border text-xs hover:bg-gray-50"
                                            onClick={() => setImageMotorcycle(item)}
                                        >
                                            Ảnh
                                        </button>

                                        <button
                                            type="button"
                                            className="px-3 py-1 rounded-lg border text-xs hover:bg-gray-50"
                                            onClick={() => navigate(`/dashboard/seller/products/${item.id}/edit`)}
                                        >
                                            Sửa
                                        </button>

                                        <button
                                            disabled={savingId === item.id}
                                            className="px-3 py-1 rounded-lg bg-black text-white text-xs hover:opacity-90 disabled:opacity-60"
                                            onClick={() => saveRow(item)}
                                        >
                                            {savingId === item.id ? 'Đang lưu...' : 'Lưu'}
                                        </button>

                                        <button
                                            type="button"
                                            disabled={deletingId === item.id}
                                            className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs hover:bg-red-700 disabled:opacity-60"
                                            onClick={() => handleDelete(item)}
                                        >
                                            {deletingId === item.id ? 'Đang xóa...' : 'Xóa'}
                                        </button>
                                    </div>
                                </td>

                            </tr>
                        ))}

                        {!resp?.data?.length && (
                            <tr>
                                <td className="p-4 text-gray-500 text-sm text-center" colSpan={6}>
                                    Không có dữ liệu.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pager */}
            <div className="flex items-center justify-between gap-3 mt-4 text-sm">
                <div className="text-gray-500">
                    Trang {cur} / {last}
                </div>
                <div className="flex gap-2">
                    <button
                        className="px-3 py-1 border rounded-lg disabled:opacity-50"
                        disabled={page <= 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                    >
                        Trước
                    </button>
                    <button
                        className="px-3 py-1 border rounded-lg disabled:opacity-50"
                        disabled={cur >= last}
                        onClick={() => setPage(p => p + 1)}
                    >
                        Sau
                    </button>
                </div>
            </div>
            {imageMotorcycle && (
                <SellerMotorcycleImagesModal
                    motorcycle={imageMotorcycle}
                    open={!!imageMotorcycle}
                    onClose={() => setImageMotorcycle(null)}
                />
            )}
        </Shell>
    );
}
