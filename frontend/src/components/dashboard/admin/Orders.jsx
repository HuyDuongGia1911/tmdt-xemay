import React, { useEffect, useState } from 'react';
import Shell from '../Shell';
import { getAdminOrders } from '../../../api/dashboard';

export default function AdminOrders() {
    const [status, setStatus] = useState('');
    const [sellerId, setSellerId] = useState('');
    const [q, setQ] = useState('');
    const [page, setPage] = useState(1);
    const [resp, setResp] = useState(null);
    const [error, setError] = useState(null);

    async function load() {
        setError(null);
        try {
            const res = await getAdminOrders({
                status: status || undefined,
                seller_id: sellerId || undefined,
                q: q || undefined,
                page
            });
            setResp(res.data);
        } catch (e) {
            setError(e?.response?.data?.message || e.message);
        }
    }

    useEffect(() => { load(); }, [status, sellerId, q, page]);

    return (
        <Shell>
            <h1 className="text-xl font-bold mb-4">Admin Orders</h1>

            <div className="flex flex-wrap gap-2 mb-4">
                <select className="border px-2 py-1 rounded" value={status} onChange={e => { setPage(1); setStatus(e.target.value); }}>
                    <option value="">(tất cả trạng thái)</option>
                    <option value="pending">pending</option>
                    <option value="confirmed">confirmed</option>
                    <option value="shipped">shipped</option>
                    <option value="completed">completed</option>
                    <option value="cancelled">cancelled</option>
                </select>
                <input
                    className="border px-2 py-1 rounded w-40"
                    placeholder="seller_id"
                    value={sellerId}
                    onChange={e => { setPage(1); setSellerId(e.target.value); }}
                />
                <input
                    className="border px-2 py-1 rounded flex-1"
                    placeholder="Tìm code/địa chỉ"
                    value={q}
                    onChange={e => { setPage(1); setQ(e.target.value); }}
                />
            </div>

            {error && <div className="mb-3 text-red-600">Lỗi: {error}</div>}

            <div className="bg-white rounded-xl shadow overflow-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left p-2">ID</th>
                            <th className="text-left p-2">Code</th>
                            <th className="text-left p-2">Seller</th>
                            <th className="text-left p-2">Khách</th>
                            <th className="text-left p-2">Status</th>
                            <th className="text-left p-2">Thanh toán</th>
                            <th className="text-left p-2">Ngày</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resp?.data?.map(o => (
                            <tr key={o.id} className="border-t">
                                <td className="p-2">{o.id}</td>
                                <td className="p-2">{o.code}</td>
                                <td className="p-2">{o.seller_id}</td>
                                <td className="p-2">{o.user?.name} ({o.user?.email})</td>
                                <td className="p-2">{o.status}</td>
                                <td className="p-2">{o.payment?.status} — {o.payment?.amount}</td>
                                <td className="p-2">{new Date(o.created_at).toLocaleString()}</td>
                            </tr>
                        ))}
                        {!resp?.data?.length && (
                            <tr><td className="p-3 text-gray-500" colSpan={7}>Không có dữ liệu.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {resp?.meta && (
                <div className="flex gap-2 mt-3">
                    <button className="px-3 py-1 border rounded" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Trước</button>
                    <div>Trang {resp.meta.current_page} / {resp.meta.last_page}</div>
                    <button className="px-3 py-1 border rounded" disabled={resp.meta.current_page >= resp.meta.last_page} onClick={() => setPage(p => p + 1)}>Sau</button>
                </div>
            )}
        </Shell>
    );
}
