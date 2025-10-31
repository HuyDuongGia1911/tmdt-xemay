import React, { useEffect, useState } from 'react';
import Shell from '../Shell'
import StatsCard from "../StatsCard";
import { getSellerOverview } from "../../../api/dashboard";

export default function SellerOverview() {
    const [range, setRange] = useState('30d');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    async function load() {
        setLoading(true);
        try {
            const res = await getSellerOverview(range);
            setData(res.data);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, [range]);

    return (
        <Shell>
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Seller Overview</h1>
                <select className="border px-2 py-1 rounded" value={range} onChange={(e) => setRange(e.target.value)}>
                    <option value="7d">7 ngày</option>
                    <option value="30d">30 ngày</option>
                    <option value="90d">90 ngày</option>
                </select>
            </div>

            {loading && <div className="mt-4">Loading...</div>}

            {data && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <StatsCard label="Tổng doanh thu (paid)" value={data.metrics.total_revenue} />
                        <StatsCard label="Khoảng thời gian" value={`${data.from} → ${data.to}`} />
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
                        <div className="font-semibold mb-2">Top sản phẩm</div>
                        <ul className="list-disc ml-6">
                            {data.top_products.map((p) => (
                                <li key={p.id}>{p.name} — {p.qty} chiếc</li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </Shell>
    );
}
