import { useEffect, useState } from "react";
import api from "../../../lib/axios";
import Shell from "../Shell";
export default function AdminContacts() {
    const [contacts, setContacts] = useState([]);

    async function load() {
        const res = await api.get("/api/dashboard/admin/contacts")
        setContacts(res.data.data.data);
    }

    useEffect(() => { load(); }, []);

    async function handleDelete(id) {
        if (!confirm("Bạn chắc chắn muốn xóa liên hệ này?")) return;

        await api.delete(`/dashboard/admin/contacts/${id}`);
        load();
    }

    return (
        <Shell>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Liên hệ khách hàng</h1>

                <table className="w-full border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">Tên</th>
                            <th className="p-2 border">Email</th>
                            <th className="p-2 border">Tin nhắn</th>
                            <th className="p-2 border">Thời gian</th>
                            <th className="p-2 border">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map((c) => (
                            <tr key={c.id} className="border">
                                <td className="p-2 border">{c.name}</td>
                                <td className="p-2 border">{c.email}</td>
                                <td className="p-2 border">{c.message}</td>
                                <td className="p-2 border">{c.created_at}</td>
                                <td className="p-2 border">
                                    <button
                                        className="px-3 py-1 bg-red-500 text-white rounded"
                                        onClick={() => handleDelete(c.id)}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Shell>
    );
}
