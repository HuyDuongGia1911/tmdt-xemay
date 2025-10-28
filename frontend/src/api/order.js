// src/api/order.js
import api from '../lib/axios'

// Tạo đơn (checkout) — hỗ trợ Idempotency-Key để tránh trùng đơn
export async function checkout({ address, payment_method, idempotencyKey }) {
    const headers = {}
    if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey
    const res = await api.post('/api/orders/checkout', { address, payment_method }, { headers })
    return res.data.order
}

// Khởi tạo thanh toán cho order
export async function initPayment({ orderId, provider }) {
    const res = await api.post(`/api/payments/${orderId}/init`, { provider })
    return res.data // { pay_url, payment_id, tx_id }
}

// Xem đơn hàng (buyer chỉ xem đơn của mình)
export async function getOrder(orderId) {
    const res = await api.get(`/api/orders/${orderId}`)
    return res.data.order
}
