import React, { useEffect, useState } from 'react';
import Shell from '../Shell';
import StatsCard from "../StatsCard";
import { getSellerOverview } from "../../../api/dashboard";

export default function Overview() {
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

    const totalStatus =
        data?.metrics?.order_counts?.reduce((sum, item) => sum + (item.count || 0), 0) || 0;

    return (
        <Shell>
            {/* Header + Range filter */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <div>
                    <h1 className="text-2xl font-semibold">Tổng quan bán hàng</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Theo dõi doanh thu, tình trạng đơn và hiệu quả sản phẩm trong khoảng thời gian bạn chọn.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Khoảng thời gian:</span>
                    <select
                        className="border px-3 py-2 rounded-lg text-sm bg-white shadow-sm"
                        value={range}
                        onChange={(e) => setRange(e.target.value)}
                    >
                        <option value="7d">7 ngày gần đây</option>
                        <option value="30d">30 ngày gần đây</option>
                        <option value="90d">90 ngày gần đây</option>
                    </select>
                </div>
            </div>

            {loading && (
                <div className="mt-4 text-sm text-gray-500">
                    Đang tải dữ liệu tổng quan...
                </div>
            )}

            {!loading && !data && (
                <div className="mt-4 text-sm text-gray-500">
                    Chưa có dữ liệu để hiển thị.
                </div>
            )}

            {data && (
                <>
                    {/* Stats cards giống Seller Center */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <StatsCard
                            label="Tổng doanh thu (paid)"
                            value={data.metrics.total_revenue}
                        />
                        <StatsCard
                            label="Khoảng thời gian"
                            value={`${data.from} → ${data.to}`}
                        />
                        <StatsCard
                            label="Tổng số đơn trong kỳ"
                            value={totalStatus}
                        />
                    </div>

                    {/* 2 panel: trạng thái đơn + top sản phẩm */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        {/* Đơn theo trạng thái */}
                        <div className="bg-white rounded-xl shadow-sm border p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="font-semibold">Đơn theo trạng thái</div>
                                <span className="text-xs text-gray-400">
                                    {data.metrics.order_counts.length} trạng thái
                                </span>
                            </div>

                            {data.metrics.order_counts.length ? (
                                <ul className="space-y-1 text-sm">
                                    {data.metrics.order_counts.map((r) => (
                                        <li
                                            key={r.status}
                                            className="flex items-center justify-between py-1"
                                        >
                                            <span className="capitalize">
                                                {r.status}
                                            </span>
                                            <span className="font-medium">
                                                {r.count}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-sm text-gray-500">
                                    Chưa có đơn hàng trong khoảng thời gian này.
                                </div>
                            )}
                        </div>

                        {/* Top sản phẩm */}
                        <div className="bg-white rounded-xl shadow-sm border p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="font-semibold">Top sản phẩm bán chạy</div>
                                <span className="text-xs text-gray-400">
                                    {data.top_products.length} sản phẩm
                                </span>
                            </div>

                            {data.top_products.length ? (
                                <ul className="space-y-1 text-sm">
                                    {data.top_products.map((p) => (
                                        <li
                                            key={p.id}
                                            className="flex items-center justify-between py-1"
                                        >
                                            <div className="truncate max-w-[220px]">
                                                {p.name}
                                            </div>
                                            <div className="font-medium">
                                                {p.qty} chiếc
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-sm text-gray-500">
                                    Chưa có sản phẩm nào được bán trong khoảng thời gian này.
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </Shell>
    );
}
