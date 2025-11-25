import React, { useEffect, useState } from 'react';
import Shell from '../Shell';
import { getSellerOrders } from "../../../api/dashboard";

function statusBadgeClass(status) {
    switch (status) {
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'confirmed':
            return 'bg-blue-100 text-blue-800';
        case 'shipped':
            return 'bg-indigo-100 text-indigo-800';
        case 'completed':
            return 'bg-green-100 text-green-800';
        case 'cancelled':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-700';
    }
}

export default function Orders() {
    const [status, setStatus] = useState('');
    const [q, setQ] = useState('');
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [resp, setResp] = useState(null);
    const [error, setError] = useState(null);

    async function load() {
        setError(null);
        try {
            const res = await getSellerOrders({
                status: status || undefined,
                q: q || undefined,
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
                    : {
                        data: raw?.data || [],
                        meta: { current_page: 1, last_page: 1, per_page: perPage, total: 0 },
                    };

            setResp(normalized);
        } catch (e) {
            setError(e?.response?.data?.message || e.message);
        }
    }

    useEffect(() => { load(); }, [status, q, page, perPage]);

    const cur = resp?.meta?.current_page ?? 1;
    const last = resp?.meta?.last_page ?? 1;

    return (
        <Shell>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                <div>
                    <h1 className="text-2xl font-semibold">Đơn hàng của bạn</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Xem và theo dõi tất cả các đơn hàng có chứa sản phẩm của shop.
                    </p>
                </div>
            </div>

            {/* Filter bar kiểu Seller Center */}
            <div className="bg-white rounded-xl shadow-sm border px-4 py-3 mb-4 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Trạng thái:</span>
                    <select
                        className="border px-3 py-2 rounded-lg text-sm"
                        value={status}
                        onChange={(e) => { setPage(1); setStatus(e.target.value); }}
                    >
                        <option value="">(Tất cả trạng thái)</option>
                        <option value="pending">pending</option>
                        <option value="confirmed">confirmed</option>
                        <option value="shipped">shipped</option>
                        <option value="completed">completed</option>
                        <option value="cancelled">cancelled</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Tìm kiếm:</span>
                    <input
                        className="border px-3 py-2 rounded-lg text-sm min-w-[220px]"
                        value={q}
                        placeholder="Mã đơn / địa chỉ..."
                        onChange={(e) => { setPage(1); setQ(e.target.value); }}
                    />
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

            {/* Table đơn hàng */}
            <div className="bg-white rounded-xl shadow-sm border overflow-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr className="text-left text-gray-600">
                            <th className="p-3 font-medium">Mã đơn</th>
                            <th className="p-3 font-medium">Khách hàng</th>
                            <th className="p-3 font-medium">Trạng thái đơn</th>
                            <th className="p-3 font-medium">Thanh toán</th>
                            <th className="p-3 font-medium">Ngày tạo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resp?.data?.length ? (
                            resp.data.map((o) => (
                                <tr key={o.id} className="border-t last:border-b hover:bg-gray-50">
                                    <td className="p-3 font-mono text-xs">
                                        {o.code}
                                    </td>
                                    <td className="p-3">
                                        <div className="font-medium">{o.user?.name}</div>
                                        <div className="text-xs text-gray-500">{o.user?.email}</div>
                                    </td>
                                    <td className="p-3">
                                        <span
                                            className={
                                                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize " +
                                                statusBadgeClass(o.status)
                                            }
                                        >
                                            {o.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-xs">
                                        {o.payment ? (
                                            <>
                                                <div className="font-medium">
                                                    {o.payment?.status || '—'}
                                                </div>
                                                <div className="text-gray-500">
                                                    {o.payment?.amount
                                                        ? `${o.payment.amount.toLocaleString('vi-VN')} đ`
                                                        : ''}
                                                </div>
                                            </>
                                        ) : (
                                            <span className="text-gray-400">
                                                Chưa tạo thanh toán
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-3 text-xs text-gray-600">
                                        {o.created_at
                                            ? new Date(o.created_at).toLocaleString()
                                            : '—'}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="p-4 text-gray-500 text-sm text-center" colSpan={5}>
                                    Không có dữ liệu.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pager giống Products */}
            <div className="flex items-center justify-between gap-3 mt-4 text-sm">
                <div className="text-gray-500">
                    Trang {cur} / {last}
                </div>
                <div className="flex gap-2">
                    <button
                        disabled={cur <= 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className="px-3 py-1 border rounded-lg disabled:opacity-50"
                    >
                        Trước
                    </button>
                    <button
                        disabled={cur >= last}
                        onClick={() => setPage(p => p + 1)}
                        className="px-3 py-1 border rounded-lg disabled:opacity-50"
                    >
                        Sau
                    </button>
                </div>
            </div>
        </Shell>
    );
}
