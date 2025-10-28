// src/api/cart.js
import api from '../lib/axios'

export async function getCart() {
    const res = await api.get('/api/cart')
    return res.data.data
}

export async function addCartItem({ motorcycle_id, qty, variant = null }) {
    const res = await api.post('/api/cart/items', { motorcycle_id, qty, variant })
    return res.data
}

export async function updateCartItem({ id, qty }) {
    const res = await api.patch(`/api/cart/items/${id}`, { qty })
    return res.data
}

export async function removeCartItem(id) {
    const res = await api.delete(`/api/cart/items/${id}`)
    return res.data
}
