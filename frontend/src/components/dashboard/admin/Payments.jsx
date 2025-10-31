import React, { useEffect, useState } from 'react';
import Shell from '../Shell';
import { getAdminPayments } from '../../../api/dashboard';

export default function AdminPayments() {
    const [status, setStatus] = useState('');
    const [method, setMethod] = useState('');
    const [page, setPage] = useState(1);
    const [resp, setResp] = useState(null);
    const [error, setError] = useState(null);

    async function load() {
        setError(null);
        try {
            const res = await getAdminPayments({
                status: status || undefined,
                method: method || undefined,
                page
            });
            setResp(res.data);
        } catch (e) {
            setError(e?.response?.data?.message || e.message);
        }
    }

    useEffect(() => { load(); }, [status, method, page]);

    return (
        <Shell>
            <h1 className="text-xl font-bold mb-4">Admin Payments</h1>

            <div className="flex gap-2 mb-4">
                <select className="border px-2 py-1 rounded" value={status} onChange={e => { setPage(1); setStatus(e.target.value); }}>
                    <option value="">(tất cả trạng thái)</option>
                    <option value="pending">pending</option>
                    <option value="paid">paid</option>
                    <option value="failed">failed</option>
                    <option value="refunded">refunded</option>
                </select>
                <select className="border px-2 py-1 rounded" value={method} onChange={e => { setPage(1); setMethod(e.target.value); }}>
                    <option value="">(tất cả phương thức)</option>
                    <option value="momo">momo</option>
                    <option value="vnpay">vnpay</option>
                    {/* thêm nếu có gateway khác */}
                </select>
            </div>

            {error && <div className="mb-3 text-red-600">Lỗi: {error}</div>}

            <div className="bg-white rounded-xl shadow overflow-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left p-2">ID</th>
                            <th className="text-left p-2">Order</th>
                            <th className="text-left p-2">Provider</th>
                            <th className="text-left p-2">Số tiền</th>
                            <th className="text-left p-2">Trạng thái</th>
                            <th className="text-left p-2">Ngày</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resp?.data?.map(p => (
                            <tr key={p.id} className="border-t">
                                <td className="p-2">{p.id}</td>
                                <td className="p-2">#{p.order_id}</td>
                                <td className="p-2">{p.provider}</td>
                                <td className="p-2">{p.amount}</td>
                                <td className="p-2">{p.status}</td>
                                <td className="p-2">{new Date(p.created_at).toLocaleString()}</td>
                            </tr>
                        ))}
                        {!resp?.data?.length && (
                            <tr><td className="p-3 text-gray-500" colSpan={6}>Không có dữ liệu.</td></tr>
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
