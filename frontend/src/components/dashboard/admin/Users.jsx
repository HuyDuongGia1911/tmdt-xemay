import React, { useEffect, useState } from 'react';
import Shell from '../Shell';
import { getAdminUsers } from '../../../api/dashboard';

export default function AdminUsers() {
    const [role, setRole] = useState('');
    const [q, setQ] = useState('');
    const [page, setPage] = useState(1);
    const [resp, setResp] = useState(null);
    const [error, setError] = useState(null);

    async function load() {
        setError(null);
        try {
            const res = await getAdminUsers({
                role: role || undefined,
                q: q || undefined,
                page
            });
            setResp(res.data);
        } catch (e) {
            setError(e?.response?.data?.message || e.message);
        }
    }

    useEffect(() => { load(); }, [role, q, page]);

    return (
        <Shell>
            <h1 className="text-xl font-bold mb-4">Admin Users</h1>

            <div className="flex gap-2 mb-4">
                <select className="border px-2 py-1 rounded" value={role} onChange={e => { setPage(1); setRole(e.target.value); }}>
                    <option value="">(tất cả role)</option>
                    <option value="buyer">buyer</option>
                    <option value="seller">seller</option>
                    <option value="admin">admin</option>
                </select>
                <input
                    className="border px-2 py-1 rounded"
                    placeholder="Tìm tên/email"
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
                            <th className="text-left p-2">Tên</th>
                            <th className="text-left p-2">Email</th>
                            <th className="text-left p-2">Role</th>
                            <th className="text-left p-2">Ngày tạo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resp?.data?.map(u => (
                            <tr key={u.id} className="border-t">
                                <td className="p-2">{u.id}</td>
                                <td className="p-2">{u.name}</td>
                                <td className="p-2">{u.email}</td>
                                <td className="p-2">{u.role}</td>
                                <td className="p-2">{new Date(u.created_at).toLocaleString()}</td>
                            </tr>
                        ))}
                        {!resp?.data?.length && (
                            <tr><td className="p-3 text-gray-500" colSpan={5}>Không có dữ liệu.</td></tr>
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
