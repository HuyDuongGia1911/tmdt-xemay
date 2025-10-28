import { useEffect, useState } from 'react'
import { getCart } from '../../api/cart'
import { checkout, initPayment } from '../../api/order'
import CheckoutForm from './CheckoutForm'

function genIdempotencyKey() {
    return 'idem-' + Date.now() + '-' + Math.random().toString(36).slice(2)
}

export default function CheckoutPage() {
    const [loading, setLoading] = useState(true)
    const [cart, setCart] = useState({ id: null, items: [], subtotal: 0 })
    const [form, setForm] = useState({
        address: { full_name: '', phone: '', line1: '', line2: '', city: '', district: '', postal_code: '' },
        payment_method: 'momo',
    })
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    async function load() {
        setLoading(true)
        setError('')
        try {
            const data = await getCart()
            setCart({ id: data.id, items: data.items, subtotal: data.subtotal })
        } catch (e) {
            setError(e?.response?.data?.message || 'Không tải được giỏ hàng')
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => { load() }, [])

    async function onSubmit() {
        if (cart.items.length === 0) {
            alert('Giỏ hàng trống.')
            return
        }
        setSubmitting(true)
        setError('')
        try {
            const order = await checkout({
                address: form.address,
                payment_method: form.payment_method,
                idempotencyKey: genIdempotencyKey()
            })
            const { pay_url } = await initPayment({ orderId: order.id, provider: form.payment_method })
            if (!pay_url) throw new Error('Không nhận được pay_url từ cổng thanh toán')
            window.location.assign(pay_url)
        } catch (e) {
            setError(e?.response?.data?.message || e.message || 'Checkout thất bại')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <div>Đang tải...</div>
    if (error) return <div className="text-red-600">{error}</div>

    return (
        <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
                <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
                    <div className="font-semibold mb-2">Đơn hàng</div>
                    {cart.items.length === 0 ? (
                        <div>Giỏ hàng trống.</div>
                    ) : (
                        <ul className="space-y-1">
                            {cart.items.map(i => (
                                <li key={i.id} className="flex items-center justify-between">
                                    <div>{i.motorcycle.name} × {i.qty}</div>
                                    <div>{i.subtotal.toLocaleString()} đ</div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <div>
                <CheckoutForm value={form} onChange={setForm} onSubmit={onSubmit} submitting={submitting} />
            </div>
        </div>
    )
}
