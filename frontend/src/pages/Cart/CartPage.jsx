import { useEffect, useState } from 'react'
import { getCart, updateCartItem, removeCartItem } from '../../api/cart'
import CartItemCard from './CartItemCard'
import CartSummary from './CartSummary'

export default function CartPage() {
    const [loading, setLoading] = useState(true)
    const [cart, setCart] = useState({ id: null, items: [], subtotal: 0 })
    const [error, setError] = useState('')

    async function fetchCart() {
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

    useEffect(() => { fetchCart() }, [])

    async function handleUpdateQty(id, qty) {
        try {
            await updateCartItem({ id, qty })
            await fetchCart()
        } catch (e) {
            alert(e?.response?.data?.message || 'Cập nhật thất bại')
        }
    }

    async function handleRemove(id) {
        if (!confirm('Xoá sản phẩm này khỏi giỏ?')) return
        try {
            await removeCartItem(id)
            await fetchCart()
        } catch (e) {
            alert(e?.response?.data?.message || 'Xoá thất bại')
        }
    }

    if (loading) return <div>Đang tải giỏ hàng...</div>
    if (error) return <div className="text-red-600">{error}</div>

    return (
        <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-3">
                {cart.items.length === 0 ? (
                    <div className="bg-white p-6 rounded-xl text-center">Giỏ hàng trống.</div>
                ) : (
                    cart.items.map((item) => (
                        <CartItemCard key={item.id} item={item}
                            onUpdateQty={handleUpdateQty}
                            onRemove={handleRemove} />
                    ))
                )}
            </div>
            <div>
                <CartSummary subtotal={cart.subtotal} />
            </div>
        </div>
    )
}
