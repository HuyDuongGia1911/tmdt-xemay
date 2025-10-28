import { useEffect, useState } from 'react'
import { getOrder } from '../api/order'

export default function PaymentResult() {
    const [orderId, setOrderId] = useState('')
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function fetchOrder() {
        if (!orderId) return
        setLoading(true)
        setError('')
        try {
            const o = await getOrder(orderId)
            setOrder(o)
        } catch (e) {
            setOrder(null)
            setError(e?.response?.data?.message || 'Không tìm thấy đơn hoặc không có quyền xem')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const u = new URL(window.location.href)
        const id = u.searchParams.get('orderId')
        if (id) {
            setOrderId(id)
            setTimeout(fetchOrder, 0)
        }
        // eslint-disable-next-line
    }, [])

    return (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
            <h1 className="text-xl font-semibold mb-3">Kết quả thanh toán</h1>
            <div className="flex gap-2 mb-3">
                <input className="flex-1 border rounded px-3 py-2" placeholder="Nhập Order ID" value={orderId}
                    onChange={(e) => setOrderId(e.target.value)} />
                <button onClick={fetchOrder} className="px-4 py-2 bg-black text-white rounded">Xem</button>
            </div>

            {loading && <div>Đang tải...</div>}
            {error && <div className="text-red-600">{error}</div>}

            {order && (
                <div className="space-y-2">
                    <div>Mã đơn: <b>{order.code}</b> (ID: {order.id})</div>
                    <div>Trạng thái: <b>{order.status}</b></div>
                    <div>Thanh toán: <b>{order.payment_status}</b></div>
                    <div>Tổng tiền: <b>{Number(order.total_amount).toLocaleString()} đ</b></div>
                </div>
            )}
        </div>
    )
}
