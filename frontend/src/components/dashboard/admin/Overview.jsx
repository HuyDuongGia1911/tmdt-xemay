import React, { useEffect, useState } from 'react';
import Shell from '../Shell'
import StatsCard from "../StatsCard";
import { getAdminOverview } from "../../../api/dashboard";

export default function AdminOverview() {
    const [range, setRange] = useState('30d');
    const [data, setData] = useState(null);

    useEffect(() => {
        (async () => {
            const res = await getAdminOverview(range);
            setData(res.data);
        })();
    }, [range]);

    return (
        <Shell>
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Admin Overview</h1>
                <select className="border px-2 py-1 rounded" value={range} onChange={(e) => setRange(e.target.value)}>
                    <option value="7d">7 ngày</option>
                    <option value="30d">30 ngày</option>
                    <option value="90d">90 ngày</option>
                </select>
            </div>

            {data && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                        <StatsCard label="Người dùng" value={data.metrics.total_users} />
                        <StatsCard label="Seller" value={data.metrics.total_sellers} />
                        <StatsCard label="Doanh thu (paid)" value={data.metrics.paid_amount} />
                        <StatsCard label="Số trạng thái đơn" value={data.metrics.order_counts.length} />
                    </div>

                    <div className="mt-6 bg-white rounded-xl shadow p-4">
                        <div className="font-semibold mb-2">Đơn theo trạng thái</div>
                        <ul className="list-disc ml-6">
                            {data.metrics.order_counts.map((r) => (
                                <li key={r.status}>{r.status}: {r.count}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-6 bg-white rounded-xl shadow p-4">
                        <div className="font-semibold mb-2">Top sellers</div>
                        <ul className="list-disc ml-6">
                            {data.top_sellers.map((s) => (
                                <li key={s.seller_id}>Seller {s.seller_id} — {s.orders} đơn — {s.total} VND</li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </Shell>
    );
}
