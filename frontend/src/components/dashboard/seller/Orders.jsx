import React, { useEffect, useState } from 'react';
import Shell from '../Shell';
import { getSellerOrders } from "../../../api/dashboard";

export default function SellerOrders() {
    const [status, setStatus] = useState('');
    const [q, setQ] = useState('');
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);   // giống Products: chọn 10/25/50/100
    const [resp, setResp] = useState(null);
    const [error, setError] = useState(null);

    async function load() {
        setError(null);
        try {
            const res = await getSellerOrders({
                status: status || undefined,
                q: q || undefined,
                page,
                per_page: perPage,                    // gửi per_page giống Products
            });

            // 🔧 CHUẨN HOÁ PHÂN TRANG (giống Products)
            const raw = res.data;
            const normalized = raw?.current_page
                ? {
                    data: raw.data || [],
                    meta: {
                        current_page: Number(raw.current_page),
                        last_page: Number(raw.last_page),
                        per_page: Number(raw.per_page ?? perPage),
                        total: Number(raw.total ?? 0),
                    },
                }
                : raw?.meta?.current_page
                    ? {
                        data: raw.data || [],
                        meta: {
                            current_page: Number(raw.meta.current_page),
                            last_page: Number(raw.meta.last_page),
                            per_page: Number(raw.meta.per_page ?? perPage),
                            total: Number(raw.meta.total ?? 0),
                        },
                    }
                    : { data: raw?.data || [], meta: { current_page: 1, last_page: 1, per_page: perPage, total: 0 } };

            setResp(normalized);
        } catch (e) {
            setError(e?.response?.data?.message || e.message);
        }
    }

    useEffect(() => { load(); }, [status, q, page, perPage]);

    // Biến tắt cho pager (giống Products)
    const cur = resp?.meta?.current_page ?? 1;
    const last = resp?.meta?.last_page ?? 1;

    return (
        <Shell>
            <h1 className="text-xl font-bold mb-4">Seller Orders</h1>

            <div className="flex gap-2 mb-4">
                <select
                    className="border px-2 py-1 rounded"
                    value={status}
                    onChange={(e) => { setPage(1); setStatus(e.target.value); }}
                >
                    <option value="">(tất cả trạng thái)</option>
                    <option value="pending">pending</option>
                    <option value="confirmed">confirmed</option>
                    <option value="shipped">shipped</option>
                    <option value="completed">completed</option>
                    <option value="cancelled">cancelled</option>
                </select>

                <input
                    className="border px-2 py-1 rounded"
                    value={q}
                    placeholder="Tìm code/địa chỉ"
                    onChange={(e) => { setPage(1); setQ(e.target.value); }}
                />

                {/* chọn số dòng / trang giống Products */}
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
                            <th className="text-left p-2">Code</th>
                            <th className="text-left p-2">Khách</th>
                            <th className="text-left p-2">Status</th>
                            <th className="text-left p-2">Thanh toán</th>
                            <th className="text-left p-2">Ngày</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resp?.data?.length ? (
                            resp.data.map((o) => (
                                <tr key={o.id} className="border-t">
                                    <td className="p-2">{o.code}</td>
                                    <td className="p-2">{o.user?.name} ({o.user?.email})</td>
                                    <td className="p-2">{o.status}</td>
                                    <td className="p-2">{o.payment?.status} — {o.payment?.amount}</td>
                                    <td className="p-2">{new Date(o.created_at).toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            // ✅ giống Products: hiện rõ “Không có dữ liệu.”
                            <tr>
                                <td className="p-3 text-gray-500" colSpan={5}>Không có dữ liệu.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/*  pager giống Products */}
            <div className="flex gap-2 mt-3">
                <button
                    disabled={cur <= 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="px-3 py-1 border rounded"
                >
                    Trước
                </button>
                <div>Trang {cur} / {last}</div>
                <button
                    disabled={cur >= last}
                    onClick={() => setPage(p => p + 1)}
                    className="px-3 py-1 border rounded"
                >
                    Sau
                </button>
            </div>
        </Shell>
    );
}
