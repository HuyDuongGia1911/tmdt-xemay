import React, { useEffect, useState } from 'react';
import Shell from '../Shell';
import { getSellerMotorcycles, patchSellerMotorcycle } from '../../../api/dashboard';

export default function Products() {
    const [q, setQ] = useState('');
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);
    const [resp, setResp] = useState(null);
    const [savingId, setSavingId] = useState(null);
    const [error, setError] = useState(null);
    const [perPage, setPerPage] = useState(25);

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
                    data: raw.data || [], meta: {
                        current_page: Number(raw.current_page),
                        last_page: Number(raw.last_page),
                        per_page: Number(raw.per_page ?? 10),
                        total: Number(raw.total ?? 0),
                    }
                }
                : raw?.meta?.current_page
                    ? {
                        data: raw.data || [], meta: {
                            current_page: Number(raw.meta.current_page),
                            last_page: Number(raw.meta.last_page),
                            per_page: Number(raw.meta.per_page ?? 10),
                            total: Number(raw.meta.total ?? 0),
                        }
                    }
                    : { data: raw?.data || [], meta: { current_page: 1, last_page: 1, per_page: 10, total: 0 } };
            setResp(normalized);
        } catch (e) {
            setError(e?.response?.data?.message || e.message);
        }
    }

    useEffect(() => { load(); }, [q, status, page, perPage]);

    // local change helpers (không mutate trực tiếp mảng gốc)
    function updateLocal(id, fields) {
        setResp(prev => {
            if (!prev) return prev;
            const next = { ...prev, data: prev.data.map(item => item.id === id ? { ...item, ...fields } : item) };
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
            // reload để đồng bộ (hoặc giữ nguyên local state)
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
            <h1 className="text-xl font-bold mb-4">Seller Products</h1>

            <div className="flex gap-2 mb-4">

                <input
                    className="border px-2 py-1 rounded"
                    placeholder="Tìm tên/slug"
                    value={q}
                    onChange={(e) => { setPage(1); setQ(e.target.value); }}
                />
                <select className="border px-2 py-1 rounded" value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }}>
                    <option value="">(tất cả)</option>
                    <option value="active">active</option>
                    <option value="draft">draft</option>
                </select>
                <select
                    className="border px-2 py-1 rounded"
                    value={perPage}
                    onChange={(e) => { setPage(1); setPerPage(Number(e.target.value)); }}
                >
                    <option value={10}>10 / trang</option>
                    <option value={25}>25 / trang</option>
                    <option value={50}>50 / trang</option>
                    <option value={100}>100 / trang</option>
                </select>
            </div>

            {error && <div className="mb-3 text-red-600">Lỗi: {error}</div>}

            <div className="bg-white rounded-xl shadow overflow-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left p-2">Tên</th>
                            <th className="text-left p-2">Slug</th>
                            <th className="text-left p-2">Giá</th>
                            <th className="text-left p-2">Tồn kho</th>
                            <th className="text-left p-2">Trạng thái</th>
                            <th className="text-left p-2">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resp?.data?.map((item) => (
                            <tr key={item.id} className="border-t">
                                <td className="p-2">{item.name}</td>
                                <td className="p-2">{item.slug}</td>
                                <td className="p-2">
                                    <input
                                        type="number"
                                        className="border px-2 py-1 rounded w-32"
                                        value={item.price ?? 0}
                                        onChange={(e) => updateLocal(item.id, { price: Number(e.target.value || 0) })}
                                    />
                                </td>
                                <td className="p-2">
                                    <input
                                        type="number"
                                        className="border px-2 py-1 rounded w-20"
                                        value={item.inventory?.stock ?? 0}
                                        onChange={(e) => updateLocal(item.id, { inventory: { ...(item.inventory || {}), stock: Number(e.target.value || 0) } })}
                                    />
                                </td>
                                <td className="p-2">
                                    <select
                                        className="border px-2 py-1 rounded"
                                        value={item.status}
                                        onChange={(e) => updateLocal(item.id, { status: e.target.value })}
                                    >
                                        <option value="active">active</option>
                                        <option value="draft">draft</option>
                                    </select>
                                </td>
                                <td className="p-2">
                                    <button
                                        disabled={savingId === item.id}
                                        className="px-3 py-1 rounded bg-black text-white hover:opacity-90 disabled:opacity-60"
                                        onClick={() => saveRow(item)}
                                    >
                                        {savingId === item.id ? 'Đang lưu...' : 'Lưu'}
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {!resp?.data?.length && (
                            <tr><td className="p-3 text-gray-500" colSpan={6}>Không có dữ liệu.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>


            <div className="flex gap-2 mt-3">
                <button
                    className="px-3 py-1 border rounded"
                    disabled={page <= 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                >Trước</button>
                <div>Trang {cur} / {last}</div>
                <button
                    className="px-3 py-1 border rounded"
                    disabled={cur >= last}
                    onClick={() => setPage(p => p + 1)}
                >Sau</button>
            </div>

        </Shell>
    );
}
